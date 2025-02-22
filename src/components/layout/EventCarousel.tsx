"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
// import { eventDetails } from "@/lib/eventList";
import Image from "next/image";

const imgWidth = 300;
const imgHeight: number = 200;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EventCarousel({ allEvents }: any) {
// export function EventCarousel({ allEvents }: { allEvents: { data: Array<{ id: string; name: string; image_url: string }> } }) {

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      className="w-full max-w-full"
    >
      <CarouselContent>
        {allEvents?.data?.map((event: { id: string; name: string; image_url: string }, index: number) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4 w-fit">
            <div className="p-1">
              <Card className="border-0">
                <CardContent className="flex aspect-square items-center justify-center p-2">
                  {/* <span className="text-3xl font-semibold">{index + 1}</span> */}
                  <Link href={`/events/${event.id}`} className="relative">
                    {/* <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold text-pink-500 font-gameOfSquid shadow-xl text-4xl">
                      {event.name}
                    </h1> */}
                    <Image width={imgWidth} height={imgHeight} src={event.image_url} alt={event.name} className="w-full object-contain rounded-md" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
}
