"use server";

import { actionClient } from "@/lib/safe-action";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { attendeeSchema } from "@/lib/validations/attendee";

const createAttendeeSchema = attendeeSchema.extend({
  event_id: z.string().uuid().optional(),
});

export const createAttendee = actionClient.schema(createAttendeeSchema).action(async ({ parsedInput }) => {
  try {
    const supabase = await createServerSupabaseClient();
    const attendee_id = Math.floor(100 + Math.random() * 900).toString();
    const eventIds = parsedInput.event_id ? [parsedInput.event_id] : [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { event_id, ...attendeeData } = parsedInput;

    const { error: attendeeError } = await supabase
      .from("attendees")
      .insert([
        {
          ...attendeeData,
          attendee_id: attendee_id,
          general_pass: true,
          event_ids: eventIds,
        },
      ])
      .select()
      .single();
    if (attendeeError) {
      console.error("Error creating attendee:", attendeeError);
      return { serverError: "Failed to create attendee" };
    }
    if (parsedInput.event_id) {
      revalidatePath(`/events/${parsedInput.event_id}`);
    }
    revalidatePath(`/`);
    return { data: { ...parsedInput, attendee_id }, type: "success" };
  } catch (error) {
    console.error("Error creating attendee:", error);
    return { serverError: "Failed to create attendee" };
  }
});
