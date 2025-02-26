"use server";

import Razorpay from "razorpay";
import type { AttendeeFormData } from "@/lib/validations/attendee";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function registerAttendees(
  attendeesData: AttendeeFormData[],
  price: number,
  eventName: string,
  eventDescription: string,
  eventId: string,
) {
  try {
    const supabase = await createServerSupabaseClient();
    const mainAttendee = attendeesData[0];
    const groupMembers = mainAttendee.group_members || [];

    const allAttendees = [
      {
        full_name: mainAttendee.full_name,
        college_name: mainAttendee.college_name,
        department: mainAttendee.department,
        email: mainAttendee.email,
        phone_no: mainAttendee.phone_no,
        payment_id: null,
        payment_status: price > 0 ? "pending" : "success",
      },
      ...groupMembers.map((member) => ({
        full_name: member.full_name,
        college_name: member.college_name,
        department: member.department,
        email: member.email,
        phone_no: member.phone_no,
        payment_id: null,
        payment_status: price > 0 ? "pending" : "success",
      })),
    ];

    for (const attendee of allAttendees) {
      const { data: existingAttendee, error: fetchError } = await supabase
        .from("attendees")
        .select("id, paid_event_count, payment_id")
        .or(`email.eq.${attendee.email},phone_no.eq.${attendee.phone_no}`)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      let attendeeId;
      let existingPaymentId = null;

      if (existingAttendee) {
        if (price > 0 && (existingAttendee.paid_event_count ?? 0) > 0) {
          return {
            error: `Attendee with email ${attendee.email} or phone ${attendee.phone_no} has already registered for a paid event.`,
          };
        }
        const { data: existingRegistration, error: registrationError } = await supabase
          .from("attendee_events")
          .select("event_id")
          .eq("attendee_id", existingAttendee.id)
          .eq("event_id", eventId)
          .single();

        if (registrationError && registrationError.code !== "PGRST116") {
          throw registrationError;
        }

        if (existingRegistration) {
          return {
            error: `Attendee with email ${attendee.email} or phone ${attendee.phone_no} is already registered for this event.`,
          };
        }

        attendeeId = existingAttendee.id;
        existingPaymentId = existingAttendee.payment_id;

        // Update existing attendee (excluding paid_event_count update here, will handle after payment)
        const { error: updateError } = await supabase
          .from("attendees")
          .update({
            full_name: attendee.full_name,
            college_name: attendee.college_name,
            department: attendee.department,
            payment_id: attendee.payment_id || existingPaymentId,
            payment_status: attendee.payment_status,
          })
          .eq("id", existingAttendee.id);

        if (updateError) throw updateError;
      } else {
        // Insert new attendee
        const { data: newAttendee, error: insertError } = await supabase
          .from("attendees")
          .insert({
            ...attendee,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        attendeeId = newAttendee.id;
      }

      // Insert into attendee_events for both new and existing attendees
      const { error: relationError } = await supabase.from("attendee_events").insert({ attendee_id: attendeeId, event_id: eventId });

      if (relationError) throw relationError;
    }

    if (price > 0) {
      const options = {
        amount: price * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
      };

      const order = await razorpay.orders.create(options);

      // Update payment_id for all attendees (using email to link, assuming unique emails)
      for (const attendee of allAttendees) {
        const { error: updatePaymentIdError } = await supabase
          .from("attendees")
          .update({ payment_id: order.id })
          .eq("email", attendee.email);
        if (updatePaymentIdError) {
          throw updatePaymentIdError;
        }
      }

      return {
        orderId: order.id,
        eventName,
        eventDescription,
        price,
        user: {
          name: allAttendees[0].full_name,
          email: allAttendees[0].email,
          phone: allAttendees[0].phone_no,
        },
      };
    } else {
      // Update event registration count
      const { error: updateError } = await supabase.rpc("update_all_events_registration_count");
      if (updateError) {
        throw updateError;
      }

      return { success: true };
    }
  } catch (err) {
    console.error("Error during registration:", err);
    return { error: "An error occurred during registration." };
  }
}

export const updatePaymentStatus = actionClient
  .schema(
    z.object({
      paymentId: z.string(),
      status: z.enum(["success", "failed", "pending"]),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { paymentId, status } = parsedInput;
    const supabase = await createServerSupabaseClient();

    try {
      // Start a transaction
      const { error: transactionError } = await supabase.rpc("create_attendees_transaction");
      if (transactionError) throw transactionError;

      // Update attendees' payment status
      const { data: updatedAttendees, error: attendeesError } = await supabase
        .from("attendees")
        .update({ payment_status: status })
        .eq("payment_id", paymentId)
        .select("id, paid_event_count"); // Select paid_event_count for update

      if (attendeesError) throw attendeesError;

      if (status === "success" && updatedAttendees && updatedAttendees.length > 0) {
        // Update paid_event_count for successful payments only if it wasn't already incremented
        for (const attendee of updatedAttendees) {
          if (attendee.paid_event_count === 0) {
            // Check if paid_event_count is 0
            const { error: updateCountError } = await supabase.from("attendees").update({ paid_event_count: 1 }).eq("id", attendee.id);

            if (updateCountError) throw updateCountError;
          }
        }

        // Update event registration counts
        const { error: updateRegistrationError } = await supabase.rpc("update_all_events_registration_count");
        if (updateRegistrationError) throw updateRegistrationError;
      }

      // Commit the transaction
      const { error: commitError } = await supabase.rpc("commit_transaction");
      if (commitError) throw commitError;

      return { success: true };
    } catch (error) {
      console.error("Action error:", error);
      // Rollback the transaction in case of any error
      await supabase.rpc("rollback_transaction");
      return { success: false, error: "Failed to update payment status and event details." };
    }
  });
