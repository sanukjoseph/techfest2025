import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(3).max(255).optional(),
  username: z.string().min(3).max(150).optional(),
  avatar_url: z.string().url().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
