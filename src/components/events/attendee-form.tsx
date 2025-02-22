/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useTransition, useCallback, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createAttendee } from "@/actions/attendees";
import { attendeeSchema } from "@/lib/validations/attendee";
import Script from "next/script";
import { createOrderAction, verifyPaymentAction } from "@/actions/payment";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AttendeeFormData = z.infer<typeof attendeeSchema>;

interface AttendeeFormProps {
  eventId?: string;
  isGroupEvent: boolean;
  price: number;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const AttendeeForm = ({ eventId, isGroupEvent, price }: AttendeeFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [razorpayOrderId, setRazorpayOrderId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [requiresPayment, setRequiresPayment] = useState(price > 0);

  const form = useForm<AttendeeFormData>({
    resolver: zodResolver(attendeeSchema),
    defaultValues: {
      full_name: "",
      college_name: "",
      department: "",
      email: "",
      phone_no: "",
      university_reg_no: "",
      group_member_ids: "",
      payment_id: null,
    },
  });

  useEffect(() => {
    setRequiresPayment(price > 0);
  }, [price, form]);

  const onSubmit = async (data: AttendeeFormData) => {
    startTransition(async () => {
      try {
        const finalPaymentId = paymentId;
        if (requiresPayment && (!paymentId || !razorpayOrderId)) {
          toast.error("Payment is required to complete registration.");
          return;
        }
        const result = await createAttendee({ ...data, event_id: eventId, payment_id: finalPaymentId });
        if (result?.serverError) {
          throw new Error(result.serverError);
        }
        toast.success("Registration successful!");
        router.refresh();
        if (eventId) {
          router.push(`/events/${eventId}/success`);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to register");
        if (eventId) {
          router.push(`/events/${eventId}/failure`);
        }
      }
    });
  };

  const handlePayment = useCallback(async () => {
    setPaymentError(null);
    startTransition(async () => {
      try {
        const orderResponse = await createOrderAction({ amount: price * 100, currency: "INR" });
        if (!orderResponse?.data?.orderId) {
          throw new Error(orderResponse?.serverError || "Failed to create order");
        }
        setRazorpayOrderId(orderResponse.data.orderId);
        const formValues = form.getValues();
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: price * 100,
          currency: "INR",
          name: "TechSphere",
          description: "Payment for your order",
          order_id: orderResponse.data.orderId,
          handler: async function (response: RazorpayResponse) {
            const verificationResponse = await verifyPaymentAction({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResponse?.data?.success) {
              setPaymentId(response.razorpay_payment_id);
              toast.success("Payment successful! Please submit the form to complete registration.");
            } else {
              setPaymentError(verificationResponse?.data?.message || "Payment verification failed");
              toast.error(verificationResponse?.data?.message || "Payment verification failed");
            }
          },
          prefill: {
            name: formValues.full_name,
            email: formValues.email,
            contact: formValues.phone_no,
          },
          theme: {
            color: "#3399cc",
          },
          method: {
            netbanking: false,
            card: true,
            upi: true,
            wallet: false,
          },
          modal: {
            ondismiss: function () {
              toast.error("Payment window closed. Please try again.");
            },
          },
        };

        const razorpay = new (window as any).Razorpay(options);

        razorpay.on("payment.failed", function (response: any) {
          setPaymentError("Payment failed");
          toast.error("Payment failed");
          console.error(response.error);
        });

        razorpay.open();
      } catch (error) {
        setPaymentError(error instanceof Error ? error.message : "Payment failed. Please try again.");
        toast.error(error instanceof Error ? error.message : "Payment failed. Please try again.");
      }
    });
  }, [price, form]);

  return (
    <Card className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-3 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Event Registration
        </CardTitle>
        <CardDescription className="text-gray-400">Fill out the form below to register for the event.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full Name"
                      {...field}
                      disabled={isPending}
                      className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* College Name */}
            <FormField
              control={form.control}
              name="college_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">College Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="College Name"
                      {...field}
                      disabled={isPending}
                      className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Department */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Department</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Department"
                      {...field}
                      disabled={isPending}
                      className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      type="email"
                      {...field}
                      disabled={isPending}
                      className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phone_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone Number"
                      type="tel"
                      {...field}
                      disabled={isPending}
                      className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* University Registration Number */}
            <FormField
              control={form.control}
              name="university_reg_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">University Registration Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="University Registration Number"
                      {...field}
                      disabled={isPending}
                      className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Group Member IDs (if applicable) */}
            {eventId && isGroupEvent && (
              <FormField
                control={form.control}
                name="group_member_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Group Member IDs (comma-separated)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter 3-digit IDs of group members"
                        {...field}
                        disabled={isPending}
                        className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            )}

            {/* Payment Error Alert */}
            {requiresPayment && paymentError && (
              <Alert variant="destructive" className="bg-red-900/50 border-red-800">
                <AlertDescription className="text-red-300">{paymentError}</AlertDescription>
              </Alert>
            )}

            {/* Conditional Button Rendering */}
            {requiresPayment ? (
              paymentId ? (
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                >
                  Complete Registration
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handlePayment}
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                >
                  {isPending ? "Processing Payment..." : "Register and Pay"}
                </Button>
              )
            ) : (
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                Complete Registration
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
    </Card>
  );
};

export default AttendeeForm;
