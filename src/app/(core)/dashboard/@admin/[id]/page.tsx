import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { AttendeesTable } from "@/components/dashboard/attendee/attendees-table";
import { getEventName } from "@/actions/attendee";

type AdminEventPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ query?: string; page?: string; itemsPerPage?: string }>;
};

export default async function AdminEventPage({ params, searchParams }: AdminEventPageProps) {
  const { query, page, itemsPerPage } = await searchParams;
  const eventId = (await params).id;

  const currentPage = Number(page) || 1;
  const itemsPerPageValue = Number(itemsPerPage) || 6;
  const eventName = await getEventName(eventId);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Attendees for {eventName}</h2>
      <Suspense fallback={<TableSkeleton />}>
        <AttendeesTable query={query || ""} currentPage={currentPage} itemsPerPage={itemsPerPageValue} eventId={eventId} />
      </Suspense>
    </div>
  );
}
