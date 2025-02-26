import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { unauthorized } from "next/navigation";
import { getEventStats } from "@/actions/attendee";

export const ADMIN_EMAIL = "admin@smash.com";
export const EVENTS_EMAIL = "event@smash.com";
export const FACULTY_EMAIL = "faculty@smash.com";

const VERIFICATION_EMAILS = ["verify@gmail.com"];

export default async function DashboardLayout({
  admin,
  coordinator,
  verification,
}: {
  children: ReactNode;
  admin: ReactNode;
  coordinator: ReactNode;
  verification: ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await (await supabase).auth.getUser();

  if (error || !user) {
    unauthorized();
  }

  const userEmail = user.email;

  // Render the appropriate slot based on user role
  if (!userEmail) {
    redirect("/login");
  }

  // Check if user is admin, events, or faculty
  const isAdminUser = userEmail && [ADMIN_EMAIL, EVENTS_EMAIL, FACULTY_EMAIL].includes(userEmail);

  // Check if user is a coordinator
  const stats = await getEventStats();
  const isCoordinator = stats.eventStats.some((event) => event.coordinatorEmail === userEmail);

  // Check if user has verification access
  const hasVerificationAccess = isAdminUser || isCoordinator || (userEmail && VERIFICATION_EMAILS.includes(userEmail));

  // If user doesn't have admin or coordinator access but has verification access,
  // redirect them to the verification route
  if (!isAdminUser && !isCoordinator && hasVerificationAccess) {
    return <>{verification}</>;
  }

  // Otherwise, render the appropriate slot based on user role
  return <>{isAdminUser ? admin : isCoordinator ? coordinator : verification}</>;
}
