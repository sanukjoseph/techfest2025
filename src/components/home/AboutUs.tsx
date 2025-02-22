import { squidgame } from "@/app/styles/fonts";
import Image from "next/image";

export default function AboutUs() {
  return (
    <section
      id="about"
      className="py-12 relative w-full min-h-fit  bg-slate-800 bg-cover bg-center flex items-center px-6 md:px-12 lg:px-24"
      //   style={{ backgroundImage: "url('/hero-upscale.jpg')" }} // Replace with correct image path
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 text-white flex flex-col md:flex-row items-center justify-evenly w-full">
        {/* Left Side - About Content */}
        <div className="max-w-3xl text-gray-300">
          <h2 className={`${squidgame.className} text-3xl md:text-5xl font-bold mb-4`}>About Us</h2>
          <p className="text-sm md:text-lg leading-relaxed">
            The <strong>MCA Department of SJCET</strong>, under the <strong>SMASH Association</strong>, proudly presents
            <strong>Techsphere 2025</strong>—the annual technical fest that brings together innovation, creativity, and technical
            brilliance. This event serves as a platform for aspiring tech enthusiasts to showcase their skills and push the boundaries of
            technology.
          </p>
          <p className="text-sm md:text-lg mt-4 leading-relaxed">
            Experience a two-day tech extravaganza featuring thrilling competitions, insightful workshops, and engaging activities. Join us
            as we celebrate technology, talent, and teamwork at <strong>Techsphere 2025</strong>. Be part of the future of tech!
          </p>
        </div>

        {/* Right Side - Logos */}
        <div className="mt-8 md:mt-0 flex flex-row items-center gap-6">
          <Image
            src="/sjcet.png" // Replace with correct logo path
            alt="St. Joseph's College of Engineering and Technology"
            width={200}
            height={200}
            className="w-40 md:w-52"
          />
          <Image src="/smash.png" alt="SMASH" width={200} height={200} className="w-40 md:w-52" />
        </div>
      </div>
    </section>
  );
}
