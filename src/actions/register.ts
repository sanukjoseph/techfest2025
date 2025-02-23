"use server";

import Razorpay from "razorpay";
import { AttendeeFormData } from "@/lib/validations/attendee";
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
        event_id: eventId,
        payment_status: price > 0 ? "pending" : "success",
      },
      ...groupMembers.map((member) => ({
        full_name: member.full_name,
        college_name: member.college_name,
        department: member.department,
        email: member.email,
        phone_no: member.phone_no,
        payment_id: null,
        event_id: eventId,
        payment_status: price > 0 ? "pending" : "success",
      })),
    ];

    for (const attendee of allAttendees) {
      const { data: existingAttendee } = await supabase
        .from("attendees")
        .select("payment_id, payment_status")
        .or(`email.eq.${attendee.email},phone_no.eq.${attendee.phone_no}`)
        .single();

      if (existingAttendee) {
        if (existingAttendee.payment_status === "success") {
          return {
            error: `Attendee with email ${attendee.email} or phone ${attendee.phone_no} has already purchased a valid event ticket.`,
          };
        }
        if (existingAttendee.payment_id && existingAttendee.payment_status !== "success") {
          await supabase.from("attendees").delete().match({ email: attendee.email, phone_no: attendee.phone_no });
        }
      }
    }

    if (price > 0) {
      const options = {
        amount: price * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
      };

      const order = await razorpay.orders.create(options);
      const { error: insertError } = await supabase.from("attendees").insert(
        allAttendees.map((attendee) => ({
          ...attendee,
          payment_id: order.id,
        })),
      );

      if (insertError) {
        return { error: insertError.message };
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
      const { error: insertError } = await supabase.from("attendees").insert(allAttendees);
      if (insertError) {
        return { error: insertError.message };
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
        .select("event_id");

      if (attendeesError) throw attendeesError;

      if (status === "success" && updatedAttendees && updatedAttendees.length > 0) {
        const eventId = updatedAttendees[0].event_id;
        const attendeesCount = updatedAttendees.length;

        // Fetch current event details
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("registration_count, event_limit, active")
          .eq("id", eventId!)
          .single();

        if (eventError) throw eventError;

        const newRegistrationCount = (eventData.registration_count || 0) + attendeesCount;
        const shouldDisable = eventData.event_limit !== null && newRegistrationCount >= eventData.event_limit;

        if (!eventId) {
          throw new Error("Event ID is required");
        }

        // Update event registration count and active status
        const { error: updateError } = await supabase
          .from("events")
          .update({
            registration_count: newRegistrationCount,
            active: shouldDisable ? false : eventData.active,
          })
          .eq("id", eventId);

        if (updateError) throw updateError;
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
