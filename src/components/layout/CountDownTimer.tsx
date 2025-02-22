"use client"

import React, { useState, useEffect, useCallback } from "react";

const CountdownTimer = ({ targetDate, className, subClassname }: { targetDate: string; className: string; subClassname: string; }) => {
  const calculateTimeLeft = useCallback(() => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <div className={className}>
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Min", value: timeLeft.minutes },
        { label: "Sec", value: timeLeft.seconds },
      ].map((time, index) => (
        <div
          key={index}
          className={subClassname}
        >
          <span className="text-lg md:text-3xl font-semibold">{time.value}</span>
          <p className="md:text-xs text-gray-400">{time.label}</p>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
