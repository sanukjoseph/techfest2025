import { getEvents } from "@/actions/events";
import EventsForm from "@/components/events/event-form";
import { ADMIN_EMAIL, EVENTS_EMAIL, FACULTY_EMAIL } from "@/lib/constant";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export default async function EventsPage() {
  // Verify the user has permission to access this page
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  const userEmail = user?.email;

  // Only admin and events users can access this page
  if (!userEmail || ![ADMIN_EMAIL, EVENTS_EMAIL].includes(userEmail)) {
    // Faculty can view but not edit
    if (userEmail === FACULTY_EMAIL) {
      // Allow faculty to view in read-only mode
    } else {
      redirect("/dashboard");
    }
  }

  const events = await getEvents();
  return <EventsForm initialEvents={events?.data} />;
}
