"use server";

import { actionClient, ServeractionClient } from "@/lib/safe-action";
import { loginSchema, registerSchema, resetPasswordSchema } from "@/lib/validations/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { profileSchema } from "@/lib/validations/profile";

export const loginUser = actionClient.schema(loginSchema).action(async ({ parsedInput }) => {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsedInput.email,
      password: parsedInput.password,
    });
    if (error) throw error;
    return { data, type: "success" };
  } catch (error) {
    console.error("Login error:", error);
    return { message: error instanceof Error ? error.message : "Failed to login", type: "error" };
  }
});

export const registerUser = actionClient.schema(registerSchema).action(async ({ parsedInput }) => {
  try {
    const supabase = await createServerSupabaseClient();
    const headersList = await headers();
    const origin = headersList.get("origin") || headersList.get("referer") || "";

    const { data, error } = await supabase.auth.signUp({
      email: parsedInput.email,
      password: parsedInput.password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return { data, type: "success" };
  } catch (error) {
    console.error("Registration error:", error);
    return { message: error instanceof Error ? error.message : "Failed to register", type: "error" };
  }
});

export const resetPassword = actionClient.schema(resetPasswordSchema).action(async ({ parsedInput }) => {
  try {
    const supabase = await createServerSupabaseClient();
    const headersList = await headers();
    const origin = headersList.get("origin") || headersList.get("referer") || "";

    const { data, error } = await supabase.auth.resetPasswordForEmail(parsedInput.email, {
      redirectTo: `${origin}/auth/callback`,
    });
    if (error) throw error;
    return { message: "Password reset email sent", type: "success", data };
  } catch (error) {
    console.error("Password reset error:", error);
    return { message: error instanceof Error ? error.message : "Failed to reset password", type: "error" };
  }
});

export const updateProfile = ServeractionClient.schema(profileSchema).action(async ({ parsedInput, ctx }) => {
  const { supabase, user } = ctx;
  if (!user?.id) return { message: "Unauthorized", type: "error" };

  try {
    const { error } = await supabase.auth.updateUser({
      data: { ...parsedInput },
    });
    if (error) throw error;
    revalidatePath("/profile");
    return { message: "Profile updated successfully", type: "success" };
  } catch (error) {
    console.error("Profile update error:", error);
    return { message: "Failed to update profile", type: "error" };
  }
});

export type ProfileData = {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
};

export const getProfile = ServeractionClient.action(async ({ ctx: { user } }) => {
  if (!user) {
    return { serverError: "Failed to fetch user profile" };
  }
  return {
    data: {
      id: user.id,
      full_name: user.user_metadata?.full_name || null,
      username: user.user_metadata?.username || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      last_sign_in_at: user.last_sign_in_at || null,
    },
  };
});

export const getUserID = ServeractionClient.action(async ({ ctx: { user } }) => {
  if (!user) {
    return { serverError: "Failed to fetch user ID" };
  }
  return {
    data: {
      id: user.id,
    },
  };
});
