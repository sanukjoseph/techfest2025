import { getEvents } from "@/actions/events";
import EventsForm from "@/components/events/event-form";

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsForm initialEvents={events?.data} />;
}
