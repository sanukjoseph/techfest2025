import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { unauthorized } from "next/navigation";
import { getEventStats } from "@/actions/attendee";
import { ADMIN_EMAIL, EVENTS_EMAIL, FACULTY_EMAIL, VERIFICATION_EMAILS } from "@/lib/constant";

export default async function DashboardLayout({ admin, coordinator }: { children: ReactNode; admin: ReactNode; coordinator: ReactNode }) {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await (await supabase).auth.getUser();

  if (error || !user) {
    unauthorized();
  }

  const userEmail = user.email;

  if (!userEmail) {
    redirect("/login");
  }

  if (userEmail && VERIFICATION_EMAILS.includes(userEmail)) {
    return redirect("/verification");
  }
  const isAdminUser = userEmail && [ADMIN_EMAIL, EVENTS_EMAIL, FACULTY_EMAIL].includes(userEmail);

  const stats = await getEventStats();
  const isCoordinator = stats.eventStats.some((event) => event.coordinatorEmail === userEmail);
  return <>{isAdminUser ? admin : isCoordinator ? coordinator : null}</>;
}
