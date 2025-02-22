// src/lib/validations/profile.ts
import * as z from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
