// "use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { squidgame } from "@/app/styles/fonts";
import Link from "next/link";
// import { Button } from "./ui/button";

const HeroSection = () => {
  return (
    <div
      id="home"
      className="relative h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/hero-upscale.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      <div className="relative h-screen w-full flex items-center justify-center text-center text-white z-10">
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-center flex-col md:flex-row md:w-full mt-12">
            <h1
              className={` ${squidgame.className} text-4xl md:text-6xl font-extrabold md:mb-4 md:mr-32 tracking-[.4rem] z-10 drop-shadow-[0px_0px_47px_rgba(234,6,86,0.9) shadow-2xl text-gray-200`}
            >
              TECHSPHERE
            </h1>
            <Image
              src="/char.png"
              alt="Character"
              width={1000}
              height={1000}
              className="invisible md:visible h-[100%] object-contain rounded z-20 absolute bottom-0 md:ml-4 md:w-fit"
            />
            <h1
              className={`${squidgame.className} text-2xl md:text-4xl pt-12 md:pt-40 md:ml-32 font-extrabold mb-4 tracking-[.4rem] z-10 drop-shadow-[0px_0px_39px_rgba(77,234,231,0.9) shadow-2xl text-gray-200`}
            >
              A Techno fest
            </h1>
          </div>
          <div className="flex justify-center md:justify-end items-end mb-4 md:mb-0">
            <Button
              // variant={"outline"}
              className={`${squidgame.className} border border-pink-500 bg-pink-600 rounded-lg text-lg hover:bg-pink-700 transition text-white shadow-xl`}
            >
              <Link href="/events">
                Join the Game
              </Link>
            </Button>
            {/* <h1 className="md:text-center text-xl md:text-2xl font-bold text-white bg-white bg-opacity-5 font-gameOfSquid rounded-lg p-4">
              <span className="text-pink-500">Registration</span> Starts at:
              <CountdownTimer
                targetDate="2025-02-22T07:00:00"
                className="flex gap-2 justify-center px-4 shadow-lg mt-2"
                subClassname="p-3 md:p-5 bg-pink-600 bg-opacity-60 rounded-lg text-sm md:text-lg shadow-sm shadow-black backdrop-filter backdrop-blur-sm"
              />
            </h1> */}
          </div>
          {/* <div className="flex p-2 gap-12">
            <h1 className="md:text-center text-xl md:text-2xl shadow-lg font-bold text-white bg-white font-gameOfSquid bg-opacity-10 rounded-lg p-2">
              Total Prize Pool -{" "}
              <span className="text-pink-500 text-2xl md:text-4xl">15 K</span>{" "}
              /-
            </h1>
          </div> */}
        </div>
      </div>

      {/* <div className="absolute bottom-0 left-0 right-0 flex justify-around p-4 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold">1.65B+</h2>
          <p>Hours Streamed in 28 Days</p>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">$900M+</h2>
          <p>Value for Netflix</p>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">142M</h2>
          <p>Households Watched</p>
        </div>   
      </div> */}
    </div>
  );
};

export default HeroSection;
