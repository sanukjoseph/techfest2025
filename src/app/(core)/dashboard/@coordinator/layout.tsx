import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { getEventStats } from "@/actions/attendee";
import { createClient } from "@/lib/supabase/client";

export default async function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  const userEmail = user?.email;

  const stats = await getEventStats();
  const userEvent = stats.eventStats.find((event) => event.coordinatorEmail === userEmail);

  if (!userEvent) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Button variant="outline" asChild disabled>
            <Link href="/verification">Verification</Link>
          </Button>
        </div>
      </div>
      <h2 className="text-xl font-semibold">Your Event: {userEvent.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Event Details</h3>
          <p>
            <strong>Event Name:</strong> {userEvent.name}
          </p>
          <p>
            <strong>Attendee Count:</strong> {userEvent.attendeeCount}
          </p>
        </Card>
        <Card className="p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Registration Statistics</h3>
          <p>
            <strong>Total Registrations:</strong> {userEvent.attendeeCount}
          </p>
          <p>
            <strong>Registration Status:</strong> {userEvent.attendeeCount > 0 ? "Active" : "No registrations yet"}
          </p>
        </Card>
      </div>
      {children}
    </>
  );
}
