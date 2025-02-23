"use server";

import Razorpay from "razorpay";
import { AttendeeFormData } from "@/lib/validations/attendee";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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
      },
      ...groupMembers.map((member) => ({
        full_name: member.full_name,
        college_name: member.college_name,
        department: member.department,
        email: member.email,
        phone_no: member.phone_no,
        payment_id: null,
        event_id: eventId,
      })),
    ];

    for (const attendee of allAttendees) {
      const { data: existingAttendee } = await supabase
        .from("attendees")
        .select("*")
        .or(`email.eq.${attendee.email},phone_no.eq.${attendee.phone_no}`)
        .single();

      if (existingAttendee) {
        return { error: `Attendee with email ${attendee.email} or phone ${attendee.phone_no} is already registered for another event.` };
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
