"use client";

import { useActionState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { verifyEmail } from "@/actions/verification";

export default function VerificationForm() {
  const [state, formAction, isPending] = useActionState(verifyEmail, {
    error: null,
  });

  const { replace } = useRouter();
  const pathname = usePathname();

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      action={formAction}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        replace(`${pathname}?email=${encodeURIComponent(email)}`);
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="Enter your email" />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Verifying..." : "Verify"}
      </Button>
      {state.error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm">
          {state.error}
        </motion.p>
      )}
    </motion.form>
  );
}
