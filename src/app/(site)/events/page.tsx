import { getAllEvents } from "@/actions/events";
import { squidgame } from "@/app/styles/fonts";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const EventsPage = async () => {
  const events = await getAllEvents();

  return (
    <section className="py-20 bg-gradient-to-b from-black to-black relative min-h-screen overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)]"></div>
      <div className="container mx-auto max-w-7xl flex flex-col gap-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <Link
          href="/"
          className="mb-8 w-10 h-10 bg-pink-600 hover:bg-pink-800 transition-colors rounded-full flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-white" />
        </Link>

        {/* Header Section */}
        <div className="text-center mx-auto max-w-2xl">
          <h2
            className={`${squidgame.className} mb-4 text-4xl font-semibold md:text-5xl lg:text-6xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent`}
          >
            Events
          </h2>
          <p className="text-gray-400 text-lg lg:text-xl">
            Explore the various events happening at <span className="text-pink-500 font-semibold">TECHSPHERE</span>.
          </p>
        </div>

        {/* Events Masonry Grid Container */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 z-20">
          {events?.data?.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="block group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 break-inside-avoid"
            >
              <div className="relative">
                <Image
                  src={event.image_url || "/default-image.jpg"}
                  alt={event.name || "Event image"}
                  className="w-full h-auto object-cover rounded-t-xl"
                  width={500}
                  height={500}
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6">
                  <h3 className="text-xl font-semibold text-white mb-2 text-center first-letter:uppercase">{event.name}</h3>
                  <p className="text-gray-200 text-sm text-center line-clamp-3">{event.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsPage;
