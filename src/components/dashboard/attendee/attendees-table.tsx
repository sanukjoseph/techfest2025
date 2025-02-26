import { DataTable } from "./data-table"; // Adjust the import path as needed
import { columns } from "./columns"; // Adjust the import path as needed
import { getAttendees } from "@/actions/attendee";

export async function AttendeesTable({
  query,
  currentPage,
  itemsPerPage,
  eventId,
}: {
  query: string;
  currentPage: number;
  itemsPerPage: number;
  eventId?: string;
}) {
  const { data: attendees, count } = await getAttendees(query, currentPage, itemsPerPage, eventId);

  return <DataTable columns={columns} data={attendees} totalPages={Math.ceil(count / itemsPerPage)} />;
}
