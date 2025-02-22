import { getEvents } from "@/actions/events";
import EventsForm from "@/components/events/event-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <Card className="w-full">
      <CardContent>
        <EventsForm initialEvents={events?.data} />
      </CardContent>
    </Card>
  );
}
