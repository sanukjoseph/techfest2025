"use client";

import { SlidingNumber } from "@/components/ui/sliding-number";
import { useEffect, useState } from "react";

export function Countdown() {
  const targetDate = new Date("2025-02-27T00:00:00").getTime(); // Target date: 27/02/2025
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  function calculateTimeLeft(targetDate: number) {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  return (
    <div className="flex flex-col items-center justify-center text-4xl sm:text-6xl opacity-40 animate-fade-in">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Days */}
        <div className="flex flex-col items-center animate-fade-in-up">
          <SlidingNumber value={timeLeft.days} padStart={true} />
          <span className="text-sm text-zinc-500 mt-2">days left</span>
        </div>

        <span className="text-4xl sm:text-6xl text-zinc-500 animate-fade-in">:</span>

        {/* Hours */}
        <div className="flex flex-col items-center animate-fade-in-up">
          <SlidingNumber value={timeLeft.hours} padStart={true} />
          <span className="text-sm text-zinc-500 mt-2">hours left</span>
        </div>

        <span className="text-4xl sm:text-6xl text-zinc-500 animate-fade-in">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center animate-fade-in-up">
          <SlidingNumber value={timeLeft.minutes} padStart={true} />
          <span className="text-sm text-zinc-500 mt-2">minutes left</span>
        </div>

        <span className="text-4xl sm:text-6xl text-zinc-500 animate-fade-in">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center animate-fade-in-up">
          <SlidingNumber value={timeLeft.seconds} padStart={true} />
          <span className="text-sm text-zinc-500 mt-2">seconds left</span>
        </div>
      </div>
    </div>
  );
}
