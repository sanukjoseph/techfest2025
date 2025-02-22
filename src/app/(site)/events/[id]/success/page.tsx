"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { squidgame } from "@/app/styles/fonts";

export default function NormalSuccessPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const fullText = "Registration Successful!"; // Custom text for normal success

  useEffect(() => {
    toast.success("Registration successful! Thank you for joining us.");
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
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="relative p-8 rounded-full border-4 border-pink-500"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center"
        >
          <h1 className={`${squidgame.className} text-4xl font-bold mb-4 text-pink-500`}>{text}</h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-gray-300 mb-4"
          >
            Thank you for registering. You will be redirected shortly.
          </motion.p>
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
            }}
            className="absolute top-2 right-2 w-8 h-8"
          >
            <div className="w-full h-full border-4 border-pink-500 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-pink-500 transform -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
