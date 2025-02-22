import React from 'react'
import { EventCarousel } from "@/components/layout/EventCarousel"
import { getAllEvents } from '@/actions/events';
import { squidgame } from '@/app/styles/fonts';

const FeaturedEvents = async() => {
  const events = await getAllEvents();

  return (
    <div className="px-2 m-4" id="events">
        <h1 className={`${squidgame.className} p-6 text-center md:px-2 text-3xl sm:text-4xl md:text-5xl`}>Featured Events</h1>
      <EventCarousel allEvents={events} />
    </div>
  )
}

export default FeaturedEvents
