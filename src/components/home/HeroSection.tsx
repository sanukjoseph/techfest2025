import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { squidgame } from "@/app/styles/fonts";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div
      id="home"
      className="relative h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/hero-upscale.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Gradient shadow at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-background to-transparent z-50"></div>

      {/* Content */}
      <div className="relative h-screen w-full flex items-center justify-center text-center text-white z-10">
        <div className="flex flex-col overflow-hidden">
          {/* Main heading and character image */}
          <div className="flex items-center justify-center flex-col md:flex-row md:w-full mt-12">
            {/* TECHSPHERE heading */}
            <h1
              className={`${squidgame.className} text-4xl md:text-6xl font-extrabold md:mb-4 md:mr-32 tracking-[.4rem] z-10 drop-shadow-[0px_0px_47px_rgba(234,6,86,0.9)] text-gray-200`}
            >
              TECHSPHERE
            </h1>

            {/* Character image */}
            <Image
              src="/char.png"
              alt="Character"
              width={1000}
              height={1000}
              className="invisible md:visible h-[100%] object-contain rounded z-20 absolute bottom-0 md:ml-4 md:w-fit"
            />

            {/* A Techno fest heading */}
            <h1
              className={`${squidgame.className} text-2xl md:text-4xl pt-12 md:pt-40 md:ml-32 font-extrabold mb-4 tracking-[.4rem] z-10 drop-shadow-[0px_0px_39px_rgba(77,234,231,0.9)] text-gray-200`}
            >
              A Techno fest
            </h1>
          </div>

          {/* Button */}
          <div className="flex justify-center md:justify-end items-end mb-4 md:mb-0">
            <Button
              className={`${squidgame.className} border border-pink-500 bg-pink-600 rounded-lg text-lg hover:bg-pink-700 transition text-white shadow-xl`}
            >
              <Link href="/events">Join the Game</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
