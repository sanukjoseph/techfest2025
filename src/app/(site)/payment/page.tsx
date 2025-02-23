/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { updatePaymentStatus } from "@/actions/register";

function Payment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const eventName = searchParams.get("eventName");
  const price = searchParams.get("price");
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");

  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending");

  useEffect(() => {
    if (!orderId || !eventName || !price || !name || !email || !phone) {
      router.push("/");
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setIsRazorpayLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script.");
      setPaymentStatus("failed");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [orderId, eventName, price, name, email, phone, router]);

  useEffect(() => {
    if (!isRazorpayLoaded) return;

    let rzp: any;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: price,
      currency: "INR",
      name: eventName,
      description: "Event Registration",
      order_id: orderId,
      handler: async () => {
        if (!orderId) {
          setPaymentStatus("failed");
          return;
        }
        const result = await updatePaymentStatus({ paymentId: orderId, status: "success" });
        if (!result || result.data?.error) {
          setPaymentStatus("failed");
          return;
        }
        setPaymentStatus("success");
      },
      prefill: {
        name: name,
        email: email,
        contact: phone,
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: async () => {
          if (orderId) {
            const result = await updatePaymentStatus({ paymentId: orderId, status: "failed" });
            if (!result || result.data?.error) {
              setPaymentStatus("failed");
              return;
            }
          }
          setPaymentStatus("failed");
        },
      },
      method: {
        netbanking: false,
        card: true,
        upi: true,
        wallet: false,
      },
    };

    rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", async () => {
      if (!orderId) {
        setPaymentStatus("failed");
        return;
      }
      const result = await updatePaymentStatus({ paymentId: orderId, status: "failed" });
      if (!result || result.data?.error) {
        setPaymentStatus("failed");
        return;
      }
      setPaymentStatus("failed");
    });

    rzp.open();

    return () => {
      if (rzp) {
        rzp.close();
      }
    };
  }, [isRazorpayLoaded, orderId, eventName, price, name, email, phone]);

  useEffect(() => {
    if (paymentStatus === "success") {
      window.location.href = "/payment/success";
    } else if (paymentStatus === "failed") {
      window.location.href = "/payment/failed";
    }
  }, [paymentStatus]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Processing Payment...</h1>
        <p className="text-gray-600">Please wait while we redirect you to the payment gateway.</p>
      </div>
    </div>
  );
}

const PaymentPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader size={48} className="animate-spin" />
        </div>
      }
    >
      <Payment />
    </Suspense>
  );
};

export default PaymentPage;
