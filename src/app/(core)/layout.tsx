import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import { Logout } from "@/components/auth/logout";

export default async function CoreLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await (await supabase).auth.getUser();

  if (error) {
    console.error("Authentication error:", error);
    redirect("/login");
  }

  if (!user) {
    console.error("User not found");
    notFound();
  }

  const userEmail = user?.email;

  return (
    <div className="container mx-auto p-4 space-y-4 py-12">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold">
          Welcome,
          <span className="first-letter:uppercase ml-2">{userEmail?.split("@")[0]}</span>
        </span>
        <Logout />
      </div>
      {children}
    </div>
  );
}
