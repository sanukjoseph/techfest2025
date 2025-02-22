import { z } from "zod";

export const orderSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("INR"),
});

export const verifySchema = z.object({
  razorpay_order_id: z.string().min(1, "Order ID is required"),
  razorpay_payment_id: z.string().min(1, "Payment ID is required"),
  razorpay_signature: z.string().min(1, "Signature is required"),
});
