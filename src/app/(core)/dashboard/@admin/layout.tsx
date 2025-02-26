import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { getEventStats } from "@/actions/attendee";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_EMAIL, EVENTS_EMAIL } from "@/lib/constant";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  const userEmail = user?.email;

  const stats = await getEventStats();

  const Statics = [
    { label: "Total Registrations", value: stats.totalRegistrations },
    { label: "Unique Attendees", value: stats.uniqueAttendees },
    { label: "Total Events", value: stats.totalEvents },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {(userEmail === ADMIN_EMAIL || userEmail === EVENTS_EMAIL) && (
            <Button asChild>
              <Link href="/dashboard/events">Create Event</Link>
            </Button>
          )}
          <Button variant="outline" asChild disabled>
            <Link href="/verification">Verification</Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Statics.map((stat) => (
          <Card key={stat.label} className="p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{stat.label}</h2>
            <p className="text-3xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Events</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", name: "All Attendees", link: "/dashboard", attendeeCount: null },
            ...stats.eventStats.map(({ id, name, attendeeCount }) => ({
              id,
              name,
              link: `/dashboard/${id}`,
              attendeeCount,
            })),
          ].map(({ id, name, link, attendeeCount }) => (
            <Button key={id} asChild variant={id === "all" ? "default" : "outline"}>
              <Link href={link}>
                {name} {attendeeCount !== null ? `(${attendeeCount})` : ""}
              </Link>
            </Button>
          ))}
        </div>
      </div>
      {children}
    </>
  );
}
