/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

const emailSchema = z.object({
  email: z.string().email(),
});

export async function verifyEmail(prevState: any, formData: FormData) {
  const validatedFields = emailSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return { error: "Please enter a valid email address." };
  }
  return { error: null };
}

const attendeeIdSchema = z.object({
  id: z.string(),
  attendee_id: z.string().length(3).regex(/^\d+$/),
});

export async function updateAttendeeId(prevState: any, formData: FormData) {
  const validatedFields = attendeeIdSchema.safeParse({
    id: formData.get("id"),
    attendee_id: formData.get("attendee_id"),
  });

  if (!validatedFields.success) {
    return { error: "Please enter a valid 3-digit Attendee ID.", success: false };
  }

  const { id, attendee_id } = validatedFields.data;

  const client = createClient();

  // Check if the attendee ID is already in use
  const { data: existingAttendee, error: checkError } = await (await client)
    .from("attendees")
    .select("id")
    .eq("attendee_id", attendee_id)
    .limit(1)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking existing attendee:", checkError);
    return { error: "An error occurred. Please try again.", success: false };
  }

  if (existingAttendee) {
    return { error: "This Attendee ID is already in use.", success: false };
  }

  // Update the attendee with the new ID
  const { error: updateError } = await (await client).from("attendees").update({ attendee_id }).eq("id", id);

  if (updateError) {
    console.error("Error updating attendee:", updateError);
    return { error: "Failed to update Attendee ID. Please try again.", success: false };
  }

  revalidatePath("/verification");
  return { error: null, success: true };
}

type Attendee = {
  id: string;
  full_name: string;
  college_name: string;
  department: string;
  email: string;
  phone_no: string;
  attendee_id: string | null;
  attendee_events: { events: { id: string; name: string } }[];
};

export async function getData(email: string): Promise<Attendee | null> {
  const client = createClient();
  const { data, error } = await (
    await client
  )
    .from("attendees")
    .select(
      `
      id,
      full_name,
      college_name,
      department,
      email,
      phone_no,
      attendee_id,
      attendee_events (
        events (id, name)
      )
    `,
    )
    .eq("email", email)
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching attendee data:", error);
    return null;
  }

  return data as Attendee;
}
