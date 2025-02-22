"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import { Tables } from "@/lib/supabase/types";

type Event = Tables<"events">;

interface EventCarouselProps {
  data?: Event[];
}

export function EventCarousel({ data }: EventCarouselProps) {
  return (
    <Carousel
      opts={{
        align: "center", // Center the carousel items
        loop: true, // Enable infinite loop
      }}
      plugins={[
        Autoplay({
          delay: 3000, // Autoplay delay
        }),
      ]}
      className="w-full max-w-full"
    >
      <CarouselContent>
        {data?.map((event: Event) => (
          <CarouselItem key={event.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
            <div className="p-1 flex justify-center">
              {" "}
              {/* Center the card */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-[300px]">
                <CardContent className="flex aspect-square items-center justify-center p-2 relative">
                  <Link href={`/events/${event.id}`} className="relative w-full h-full">
                    {/* Event Image */}
                    <Image
                      src={event.image_url || "/default-image.jpg"}
                      alt={event.name || "Event"}
                      fill
                      className="object-cover rounded-md"
                    />
                    {/* Event Name Overlay */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-md">
                      <h1 className="text-white text-2xl font-bold text-center px-2">{event.name}</h1>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
