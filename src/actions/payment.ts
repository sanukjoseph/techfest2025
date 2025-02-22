"use server";

import { actionClient } from "@/lib/safe-action";
import Razorpay from "razorpay";
import crypto from "crypto";
import { orderSchema, verifySchema } from "@/lib/validations/payment";

const key_id = process.env.RAZORPAY_KEY_ID as string;
const key_secret = process.env.RAZORPAY_KEY_SECRET as string;

if (!key_id || !key_secret) {
  throw new Error("Razorpay keys are missing");
}

const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export const createOrderAction = actionClient.schema(orderSchema).action(async ({ parsedInput }) => {
  try {
    const { amount, currency } = parsedInput;
    const options = {
      amount,
      currency,
      receipt: `receipt#${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    console.log("Order Created Successfully");
    return { orderId: order.id };
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    return { error: "Failed to create order", status: 500 };
  }
});

export const verifyPaymentAction = actionClient.schema(verifySchema).action(async ({ parsedInput }) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsedInput;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return { error: "Razorpay secret not found", success: false, status: 400 };
    }
    const HMAC = crypto.createHmac("sha256", secret);
    HMAC.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = HMAC.digest("hex");
    if (generatedSignature === razorpay_signature) {
      return { message: "Payment verified successfully", success: true };
    } else {
      return { error: "Invalid signature", success: false, status: 400 };
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return { error: "An error occurred", success: false, status: 500 };
  }
});
