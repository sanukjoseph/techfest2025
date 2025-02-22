"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { squidgame } from "@/app/styles/fonts";

export default function PaymentFailedPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const fullText = "Payment Failed";

  useEffect(() => {
    toast.error("Payment failed. Please try again.");
    const timeout = setTimeout(() => {
      router.push("/");
    }, 7000);

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
      clearInterval(typingInterval);
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
        }}
        className="relative p-8 rounded-lg border-4 border-red-500"
      >
        <motion.h1 className={`${squidgame.className} text-4xl font-bold mb-4 text-red-500`}>{text}</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }} className="text-gray-300 mb-6">
          Please try again. You will be redirected shortly.
        </motion.p>
        <motion.div
          className="absolute top-2 right-2 w-8 h-8"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          <div className="w-full h-full bg-red-500 rounded-sm"></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-black transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}
