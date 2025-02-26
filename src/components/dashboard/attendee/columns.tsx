"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export interface AttendeeData {
  id: string;
  created_at: string;
  full_name: string | null;
  college_name: string | null;
  department: string | null;
  email: string | null;
  phone_no: string | null;
  attendee_id: string | null; // Allow null
  payment_status: string | null;
  event_names: string;
}

export const columns: ColumnDef<AttendeeData, unknown>[] = [
  {
    accessorKey: "attendee_id",
    header: "Attendee ID",
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Attendee Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "college_name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          College Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone_no",
    header: "Phone Number",
  },
  {
    accessorKey: "event_names",
    header: "Event Names",
    cell: ({ row }) => {
      const eventNames: string = row.getValue("event_names");
      return <div>{eventNames.split(",").join(", ")}</div>;
    },
  },
];
