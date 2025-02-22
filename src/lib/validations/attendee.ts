import { z } from "zod";

export const attendeeSchema = z.object({
  full_name: z.string().nonempty("Full name is required"),
  college_name: z.string().nonempty("College name is required"),
  department: z.string().nonempty("Department is required"),
  email: z.string().email("Invalid email address"),
  phone_no: z.string().nonempty("Phone number is required"),
  payment_id: z.string().nullable(),
  event_id: z.string().nonempty("Event ID is required"),
  group_members: z
    .array(
      z.object({
        full_name: z.string().nonempty("Full name is required"),
        college_name: z.string().nonempty("College name is required"),
        department: z.string().nonempty("Department is required"),
        email: z.string().email("Invalid email address"),
        phone_no: z.string().nonempty("Phone number is required"),
      }),
    )
    .optional(),
});

export type AttendeeFormData = z.infer<typeof attendeeSchema>;
