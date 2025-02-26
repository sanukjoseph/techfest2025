import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { AttendeesTable } from "@/components/dashboard/attendee/attendees-table";
import { getEventStats } from "@/actions/attendee";
import { createClient } from "@/lib/supabase/client";

type CoordinatorDashboardPageProps = {
  searchParams: Promise<{ query?: string; page?: string; itemsPerPage?: string }>;
};

export default async function CoordinatorDashboardPage({ searchParams }: CoordinatorDashboardPageProps) {
  const { query, page, itemsPerPage } = await searchParams;
  const currentPage = Number(page) || 1;
  const itemsPerPageValue = Number(itemsPerPage) || 6;

  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  const userEmail = user?.email;

  const stats = await getEventStats();
  const userEvent = stats.eventStats.find((event) => event.coordinatorEmail === userEmail);

  if (!userEvent) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Your Event Attendees</h2>
      <Suspense fallback={<TableSkeleton />}>
        <AttendeesTable query={query || ""} currentPage={currentPage} itemsPerPage={itemsPerPageValue} eventId={userEvent.id} />
      </Suspense>
    </div>
  );
}
