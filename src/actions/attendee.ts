"use server";

import { AttendeeData } from "@/components/dashboard/attendee/columns";
import { createClient } from "@/lib/supabase/client";

export const getAttendees = async (
  query: string,
  page: number,
  itemsPerPage: number,
  eventId?: string,
): Promise<{ data: AttendeeData[]; count: number }> => {
  const supabase = await createClient();
  const offset = (page - 1) * itemsPerPage;

  // Base query with payment status condition
  let queryBuilder = supabase
    .from("attendees")
    .select(
      `*,
        attendee_events!inner (
          event:events (
            id,
            name,
            price
          )
        )`,
      { count: "exact" },
    )
    .range(offset, offset + itemsPerPage - 1)
    .in("payment_status", ["success", "completed"]); // Only include attendees with valid payment status

  // Add search filter if query is provided
  if (query) {
    queryBuilder = queryBuilder.ilike("full_name", `%${query}%`);
  }

  // Add event filter if eventId is provided
  if (eventId) {
    queryBuilder = queryBuilder.eq("attendee_events.event_id", eventId);
  }

  // Execute the query
  const { data: attendees, error, count } = await queryBuilder;

  if (error) {
    console.error("Error fetching attendees:", error);
    return { data: [], count: 0 };
  }

  // Format the attendees to include event names
  const formattedAttendees =
    attendees?.map((attendee) => {
      return {
        ...attendee,
        event_names: attendee.attendee_events
          .map((ae) => ae.event?.name)
          .filter(Boolean)
          .join(", "),
      };
    }) ?? [];

  return { data: formattedAttendees, count: count || 0 };
};

export const getEventStats = async () => {
  const supabase = await createClient();

  // Fetch all attendee_events with attendee_id and event_id, joining attendees to filter by payment_status
  const { data: registrations, error: regError } = await supabase
    .from("attendee_events")
    .select(
      `attendee_id, 
       event_id,
       attendee:attendees (
         payment_status
       )`,
    )
    .in("attendee.payment_status", ["success", "completed"]); // Only include attendees with valid payment status

  // Fetch all events with id, name, and coordinator_email
  const { data: events, error: eventError } = await supabase.from("events").select("id, name, coordinator_email");

  // Handle errors
  if (regError || eventError) {
    console.error("Error fetching stats:", regError || eventError);
    return {
      totalRegistrations: 0,
      uniqueAttendees: 0,
      totalEvents: 0,
      eventStats: [],
    };
  }

  // Calculate unique attendees
  const uniqueAttendees = new Set(registrations.map((r) => r.attendee_id)).size;

  // Map event stats
  const eventStats = events.map((event) => ({
    id: event.id,
    name: event.name,
    attendeeCount: registrations.filter((r) => r.event_id === event.id).length,
    coordinatorEmail: event.coordinator_email,
  }));

  return {
    totalRegistrations: registrations.length,
    uniqueAttendees,
    totalEvents: events.length,
    eventStats,
  };
};

export const getEventName = async (eventId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("name").eq("id", eventId).single();

  if (error) {
    console.error("Error fetching event name:", error, { eventId });
    return "Unknown Event";
  }
  if (!data) {
    console.error("No event data found for eventId:", eventId);
    return "Unknown Event";
  }

  return data?.name;
};
