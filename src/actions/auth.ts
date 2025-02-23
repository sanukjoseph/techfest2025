"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type ActionState = {
  error?: string;
};

export async function login(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await (await supabase).auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = createClient();
  const { error } = await (await supabase).auth.signOut();

  if (error) {
    console.error("Logout failed:", error);
    throw new Error("Logout failed. Please try again.");
  }

  redirect("/");
}
