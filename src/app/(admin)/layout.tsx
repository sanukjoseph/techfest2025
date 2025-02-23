import { getServerSession } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { AuthProvider } from "@/providers/auth-provider";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }
  return (
    <AuthProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </AuthProvider>
  );
}
