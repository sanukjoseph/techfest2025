import { z } from "zod";

export const attendeeSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  college_name: z.string().min(3, "College name must be at least 3 characters"),
  department: z.string().min(3, "Department must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone_no: z.string().min(10, "Phone number must be at least 10 characters"),
  university_reg_no: z.string().min(3, "University registration number must be at least 3 characters"),
  group_member_ids: z.string().optional(),
  payment_id: z.string().nullable().optional(),
});

export type AttendeeFormData = z.infer<typeof attendeeSchema>;
