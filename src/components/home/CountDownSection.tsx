import Image from "next/image";
import React from "react";
import CountdownTimer from "../layout/CountDownTimer";
import { Button } from "../ui/button";
import { squidgame } from "@/app/styles/fonts";

const CountDownSection = () => {
  return (
    <div className={`${squidgame.className} relative h-screen flex items-center justify-center bg-cover bg-center`}>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content Container */}
      <div className="relative flex flex-col items-center text-center text-white z-10 gap-10">
        {/* Top Badge */}
        <div className="px-4 mx-1 py-2 border border-pink-600 rounded-full text-xs md:text-sm flex gap-1 md:gap-2 items-center">
          <span className="text-gray-300">🔥 Techsphere</span>
          <span className="text-blue-400 font-bold">
            - UNLEASH THE ENERGY
          </span>{" "}
          &<span className="text-gray-300">TECH + Culture</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mt-6">
          LET THE <br />
          <span className="text-pink-500">GAMES BEGIN</span>
        </h1>

        <div className="relative flex justify-center">
          {/* timer */}
          <CountdownTimer
            targetDate="2025-02-27T00:00:00"
            className="flex gap-2 justify-center z-30 absolute"
            subClassname="p-3 md:p-5 bg-pink-950 bg-opacity-60 rounded-lg shadow-black backdrop-filter backdrop-blur-sm"
          />

          {/* Symbols */}
          <div className="z-10 flex justify-center items-center mt-14 gap-6 text-pink-600 text-8xl opacity-80 md:text-9xl font-extrabold ">
            <span>&#9675;</span>
            <span>&#9651;</span>
            <span>&#9633;</span>
          </div>
        </div>

        {/* Buy Now Button */}
        <Button
          variant={"outline"}
          className=" px-6 py-5 border border-pink-500 rounded-lg text-lg hover:bg-pink-600 transition"
        >
          Register now
        </Button>
        {/* Countdown Timer */}
      </div>

      {/* Character Image */}
      <div className="absolute bottom-0 right-20 hidden md:block">
        <Image
          src="/doll.png"
          alt="Character"
          width={1000}
          height={1000}
          className="object-contain w-[350px] h-[100%]"
        />
      </div>
    </div>
  );
};

export default CountDownSection;
{
  /* <div className="relative w-full h-10 bg-pink-500">
      <div className="absolute top-0 left-0 w-20 h-10 bg-black clip-notch"></div>
    </div> */
}
