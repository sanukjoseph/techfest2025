"use client";

import { useActionState } from "react";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function Logout() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, formAction, isPending] = useActionState(logout, null);

  return (
    <form action={formAction}>
      <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white cursor-pointer" disabled={isPending}>
        {isPending ? "Logging out..." : "Logout"}
      </Button>
    </form>
  );
}
