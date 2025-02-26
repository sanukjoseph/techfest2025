import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { AttendeesTable } from "@/components/dashboard/attendee/attendees-table";

type RootAttendeesPageProps = {
  searchParams: Promise<{ query?: string; page?: string; itemsPerPage?: string }>;
};

export default async function EventAttendeesPage({ searchParams }: RootAttendeesPageProps) {
  const { query, page, itemsPerPage } = await searchParams;

  const currentPage = Number(page) || 1;
  const itemsPerPageValue = Number(itemsPerPage) || 6;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">All Attendees</h2>
      <Suspense fallback={<TableSkeleton />}>
        <AttendeesTable query={query || ""} currentPage={currentPage} itemsPerPage={itemsPerPageValue} eventId={undefined} />{" "}
      </Suspense>
    </div>
  );
}
