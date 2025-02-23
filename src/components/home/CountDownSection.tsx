"use client";

import Image from "next/image";
import React from "react";
import CountdownTimer from "./CountDownTimer";
import { Button } from "../ui/button";
import { squidgame } from "@/app/styles/fonts";
import Link from "next/link";

const CountDownSection = () => {
  const targetDate = "2025-02-27T00:00:00"; // Target date for the countdown
  const badgeText = {
    prefix: "🔥 Techsphere",
    highlight: "- UNLEASH THE ENERGY",
    suffix: "TECH + Culture",
  };
  const headingText = {
    line1: "LET THE",
    line2: "GAMES BEGIN",
    highlight: "GAMES BEGIN",
  };
  const buttonText = "Register now";
  const characterImage = "/doll.png";

  return (
    <div className={`${squidgame.className} relative h-screen flex items-center justify-center bg-cover bg-center`}>
      {/* Content Container */}
      <div className="relative flex flex-col items-center text-center text-white z-10 gap-8 md:gap-12">
        {/* Top Badge */}
        <div className="px-4 py-2 border border-pink-600 rounded-full text-xs md:text-sm flex gap-1 md:gap-2 items-center bg-black bg-opacity-50">
          <span className="text-gray-300">{badgeText.prefix}</span>
          <span className="text-blue-400 font-bold">{badgeText.highlight}</span>
          <span className="text-gray-300">{badgeText.suffix}</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold">
          {headingText.line1} <br />
          <span className="text-pink-500">{headingText.highlight}</span>
        </h1>

        {/* Timer and Symbols */}
        <div className="relative flex justify-center">
          {/* Timer */}
          <CountdownTimer
            targetDate={targetDate}
            className="flex gap-2 justify-center z-30 absolute"
            subClassname="p-3 md:p-5 bg-pink-950 bg-opacity-60 rounded-lg shadow-black backdrop-filter backdrop-blur-sm"
          />

          {/* Symbols */}
          <div className="z-10 flex justify-center items-center mt-14 gap-6 text-pink-600 text-8xl opacity-80 md:text-9xl font-extrabold">
            <span>&#9675;</span>
            <span>&#9651;</span>
            <span>&#9633;</span>
          </div>
        </div>

        {/* Buy Now Button */}
        <Button
          variant={"outline"}
          className="px-6 py-5 border border-pink-500 rounded-lg text-lg hover:bg-pink-600 hover:text-white transition"
        >
          <Link href={"/events"}>{buttonText}</Link>
        </Button>
      </div>
      {/* Character Image */}
      <div className="absolute bottom-0 right-20 hidden md:block">
        <Image src={characterImage} alt="Character" width={1000} height={1000} className="object-contain w-[350px] h-[100%]" />
      </div>
    </div>
  );
};

export default CountDownSection;
