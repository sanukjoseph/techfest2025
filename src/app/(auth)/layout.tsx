import { getServerSession } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}
