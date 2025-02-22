import { createSafeActionClient } from "next-safe-action";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const actionClient = createSafeActionClient();

export const ServeractionClient = actionClient
  .use(async ({ next }) => {
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Unauthorized:", error);
        throw new Error("Unauthorized");
      }

      return next({ ctx: { supabase, user } });
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Internal Server Error");
    }
  })
  .use(async ({ next, ctx }) => {
    const { user, supabase } = ctx;
    return next({ ctx: { supabase, userId: user.id } });
  })
  .use(async ({ next, ctx }) => {
    return next({ ctx });
  });
