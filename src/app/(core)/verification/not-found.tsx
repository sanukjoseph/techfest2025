"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="mb-4">The attendee you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/verification" className="text-blue-500 hover:underline">
        Go back to verification
      </Link>
    </motion.div>
  );
}
