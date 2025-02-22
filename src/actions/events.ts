"use server";

import { ServeractionClient, actionClient } from "@/lib/safe-action";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { eventSchema } from "@/lib/validations/event";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createEventSchema = eventSchema;
const updateEventSchema = eventSchema.extend({
  id: z.string().uuid(),
});
const deleteEventSchema = z.object({
  id: z.string().uuid(),
});

const updateAttendeeWinningPositionSchema = z.object({
  eventId: z.string().uuid(),
  winnerPositions: z.array(
    z.object({
      attendeeId: z.string().length(3),
      position: z.number().min(1),
    }),
  ),
});

const EVENTFORMROUTE = "/create";

export const getEvents = ServeractionClient.action(async ({ ctx }) => {
  const { supabase, user } = ctx;
  if (!user?.id) throw new Error("Unauthorized: No user found");
  try {
    const { data, error } = await supabase.from("events").select("*").eq("user_id", user.id);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to retrieve events");
  }
});

export const getAllEvents = actionClient.action(async () => {
  const supabase = await createServerSupabaseClient();
  try {
    const { data, error } = await supabase.from("events").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to retrieve events");
  }
});

export const getEvent = actionClient.schema(z.string().uuid()).action(async ({ parsedInput }) => {
  const supabase = await createServerSupabaseClient();
  try {
    const { data, error } = await supabase.from("events").select("*").eq("id", parsedInput).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw new Error("Failed to retrieve event");
  }
});

export const createEvent = ServeractionClient.schema(createEventSchema).action(async ({ parsedInput, ctx }) => {
  const { supabase, userId, user } = ctx;
  if (!userId) {
    return { message: "Unauthorized", type: "error" };
  }

  try {
    if (!user.email) {
      return { message: "User email is required", type: "error" };
    }
    const { error: profileUpsertError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        full_name: user.user_metadata?.full_name || null,
        username: user.user_metadata?.username || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        email: user.email,
      })
      .eq("id", userId);

    if (profileUpsertError) {
      console.error("Error upserting profile:", profileUpsertError);
      return { message: "Failed to create event", type: "error" };
    }

    const { error: eventInsertError } = await supabase.from("events").insert({
      name: parsedInput.name,
      description: parsedInput.description,
      price: parsedInput.price,
      event_limit: parsedInput.event_limit,
      image_url: parsedInput.image_url,
      user_id: userId,
      event_type: parsedInput.event_type,
      category: parsedInput.category,
      format: parsedInput.format,
      num_winners: parsedInput.num_winners,
    });

    if (eventInsertError) {
      throw eventInsertError;
    }
    revalidatePath(EVENTFORMROUTE);
    return { message: "Event created successfully", type: "success" };
  } catch (error) {
    console.error("Error creating event:", error);
    return { message: "Failed to create event", type: "error" };
  }
});

export const updateEvent = ServeractionClient.schema(updateEventSchema).action(
  async ({ parsedInput: { id, name, description, price, event_limit, image_url, event_type, category, format, num_winners }, ctx }) => {
    const { supabase, user } = ctx;
    if (!user?.id) return { message: "Unauthorized", type: "error" };

    try {
      const { data: existingEvent, error: fetchError } = await supabase.from("events").select("user_id").eq("id", id).single();
      if (fetchError || !existingEvent || existingEvent.user_id !== user.id) {
        return { message: "Event not found or access denied", type: "error" };
      }

      const { error } = await supabase
        .from("events")
        .update({ name, description, price, event_limit, image_url, event_type, category, format, num_winners })
        .eq("id", id);
      if (error) throw error;

      revalidatePath(EVENTFORMROUTE);
      return { message: "Event updated successfully", type: "success" };
    } catch (error) {
      console.error("Error updating event:", error);
      return { message: "Failed to update event", type: "error" };
    }
  },
);

export const deleteEvent = ServeractionClient.schema(deleteEventSchema).action(async ({ parsedInput: { id }, ctx }) => {
  const { supabase, user } = ctx;
  if (!user?.id) return { message: "Unauthorized", type: "error" };

  try {
    const { data: existingEvent, error: fetchError } = await supabase.from("events").select("user_id").eq("id", id).single();
    if (fetchError || !existingEvent || existingEvent.user_id !== user.id) {
      return { message: "Event not found or access denied", type: "error" };
    }

    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw error;

    revalidatePath(EVENTFORMROUTE);
    return { message: "Event deleted successfully", type: "success" };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { message: "Failed to delete event", type: "error" };
  }
});

export const updateAttendeeWinningPosition = ServeractionClient.schema(updateAttendeeWinningPositionSchema).action(
  async ({ parsedInput: { eventId, winnerPositions }, ctx }) => {
    const { supabase, user } = ctx;
    if (!user?.id) return { message: "Unauthorized", type: "error" };

    try {
      for (const winnerPosition of winnerPositions) {
        const { attendeeId, position } = winnerPosition;

        // Fetch the attendee to check if they exist and belong to the event
        const { data: attendee, error: fetchError } = await supabase
          .from("attendees")
          .select("*")
          .eq("event_id", eventId)
          .eq("attendee_id", attendeeId)
          .single();

        if (fetchError || !attendee) {
          console.error(`Attendee with ID ${attendeeId} not found in event ${eventId}`);
          return { message: `Attendee with ID ${attendeeId} not found in event ${eventId}`, type: "error" };
        }

        // If the event is a group event, update all group members
        if (attendee.group_member_ids) {
          const groupMemberIds = attendee.group_member_ids.split(",");
          for (const memberId of groupMemberIds) {
            const { error: updateError } = await supabase
              .from("attendees")
              .update({ winning_position: position })
              .eq("event_id", eventId)
              .eq("attendee_id", memberId);

            if (updateError) {
              console.error(`Error updating winning position for attendee ${memberId}:`, updateError);
              return { message: `Failed to update winning position for attendee ${memberId}`, type: "error" };
            }
          }
        } else {
          const { error: updateError } = await supabase
            .from("attendees")
            .update({ winning_position: position })
            .eq("event_id", eventId)
            .eq("attendee_id", attendeeId);

          if (updateError) {
            console.error(`Error updating winning position for attendee ${attendeeId}:`, updateError);
            return { message: `Failed to update winning position for attendee ${attendeeId}`, type: "error" };
          }
        }
      }

      revalidatePath(`/events/${eventId}`);
      return { message: "Competition results updated successfully", type: "success" };
    } catch (error) {
      console.error("Error updating competition results:", error);
      return { message: "Failed to update competition results", type: "error" };
    }
  },
);
