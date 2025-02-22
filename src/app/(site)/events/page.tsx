import { getAllEvents } from "@/actions/events";
import { squidgame } from "@/app/styles/fonts";
import { Button } from "@/components/ui/button";
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
        <Button variant="outline" size={"icon"} asChild className="mb-8 bg-pink-600 hover:bg-pink-800  transition-colors rounded-full">
          <Link href="/" className="flex items-center">
            <ArrowLeft size={20} />
          </Link>
        </Button>

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

        {/* Events Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 z-20">
          {events?.data?.map((event) => (
            <div
              key={event.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Event Image */}
              <div className="relative aspect-square w-full">
                <Image
                  src={event.image_url || "/default-image.jpg"}
                  alt={event.name || "Event image"}
                  className="object-cover p-3 rounded-xl object-top"
                  fill
                />
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">View Event</span>
                </div>
              </div>

              {/* Event Details */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-200 first-letter:uppercase">{event.name}</h3>
                <p className="mb-6 text-gray-400 line-clamp-1">{event.description}</p>

                {/* Button to Event Detail Page */}
                <div className="mt-auto">
                  <Link
                    href={`/events/${event.id}`}
                    className="inline-block w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-md px-6 py-3 text-center text-sm font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsPage;
