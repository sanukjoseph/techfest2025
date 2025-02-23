import { squidgame } from "@/app/styles/fonts";
import Image from "next/image";

export default function AboutUs() {
  return (
    <section
      id="about"
      className="py-20 relative w-full min-h-fit bg-cover bg-center flex flex-col items-center justify-center px-6 md:px-12 lg:px-24"
      // style={{ backgroundImage: "url('/about-bg.jpg')" }} // Add a background image
    >
      <div className="relative z-10 text-white flex flex-col items-center w-full max-w-7xl">
        <div className="max-w-3xl text-gray-300 flex flex-col">
          <h2
            className={`${squidgame.className} text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient`}
          >
            About Us
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-6 text-left">
            The <strong className="text-pink-400">MCA Department of SJCET</strong>, under the{" "}
            <strong className="text-pink-400">SMASH Association</strong>, proudly presents{" "}
            <strong className="text-pink-400">Techsphere 2025</strong>—the annual technical fest that brings together innovation,
            creativity, and technical brilliance. This event serves as a platform for aspiring tech enthusiasts to showcase their skills and
            push the boundaries of technology.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-left">
            Experience a day tech extravaganza featuring thrilling competitions, insightful workshops, and engaging activities. Join us as
            we celebrate technology, talent, and teamwork at <strong className="text-pink-400">Techsphere 2025</strong>. Be part of the
            future of tech!
          </p>
        </div>
        <div className="mt-12 flex flex-row items-center gap-8 md:gap-12">
          <div className="relative w-40 md:w-52 h-40 md:h-52 hover:scale-105 transition-transform duration-300">
            <Image src="/sjcet.png" alt="St. Joseph's College of Engineering and Technology" fill className="object-contain" />
          </div>
          <div className="relative w-40 md:w-52 h-40 md:h-52 hover:scale-105 transition-transform duration-300">
            <Image src="/smash.png" alt="SMASH" fill className="object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
