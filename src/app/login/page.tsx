import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import LoginFrom from "@/components/auth/login-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/dashboard");
  }

  return <LoginFrom />;
}
