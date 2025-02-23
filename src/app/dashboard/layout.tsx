import { Logout } from "@/components/auth/logout";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold">
          Welcome,
          <span className="first-letter:uppercase ml-2">{data.user.email?.split("@")[0]}</span>
        </span>
        <Logout />
      </div>
      {children}
    </div>
  );
}
