import React from "react";
import { EventCarousel } from "@/components/layout/EventCarousel";
import { getAllEvents } from "@/actions/events";
import { squidgame } from "@/app/styles/fonts";

const FeaturedEvents = async () => {
  const eventsResult = await getAllEvents();
  const events = eventsResult?.data || [];

  return (
    <section className="px-4 py-12" id="events">
      <div className="container mx-auto">
        {/* Heading */}
        <h1
          className={`${squidgame.className} text-center text-4xl sm:text-5xl md:text-6xl font-bold mb-12 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent`}
        >
          Featured Events
        </h1>

        {/* Event Carousel */}
        {events?.length > 0 ? (
          <EventCarousel data={events} />
        ) : (
          <p className="text-center text-gray-600 text-lg">No events available at the moment.</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedEvents;
