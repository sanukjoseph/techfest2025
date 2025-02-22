import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  price: z.number().min(0).max(10000),
  event_limit: z.number().min(1).max(1000),
  image_url: z.string().url(),
  event_type: z.enum(["single", "group"]).default("single"),
  category: z.enum(["technical", "non-technical"]).default("technical"),
  format: z.enum(["workshop", "competition"]).default("competition"),
  num_winners: z.number().min(0).default(0),
  min_group_size: z.number().min(1).default(1),
  max_group_size: z.number().min(1).default(5),
});

export const fileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type),
      "Only JPEG, PNG, GIF and WebP images are allowed",
    ),
});

export type EventFormData = z.infer<typeof eventSchema>;
