"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { createClientSupabaseClient } from "@/lib/supabase/client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setSessionExpiry, clearSession, setLoading } = useAuthStore();
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setSessionExpiry(session.expires_at ?? null);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
        setSessionExpiry(session.expires_at ?? null);
      } else {
        clearSession();
      }
      setLoading(false);
    });

    const checkInterval = setInterval(() => {
      const expiry = useAuthStore.getState().sessionExpiry;
      if (expiry && Date.now() / 1000 >= expiry) {
        clearSession();
        window.location.href = "/login";
      }
    }, 60000);

    return () => {
      subscription.unsubscribe();
      clearInterval(checkInterval);
    };
  }, [setUser, setSessionExpiry, clearSession, setLoading, supabase.auth]);

  return <>{children}</>;
}
