"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import type { Tables } from "@/lib/supabase/types";

type Event = Tables<"events">;

interface EventCarouselProps {
  data?: Event[];
}

export function EventCarousel({ data }: EventCarouselProps) {
  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
      className="w-full max-w-full"
    >
      <CarouselContent>
        {data?.map((event: Event) => (
          <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <div className="p-1">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-0">
                  <Link href={`/events/${event.id}`} className="block relative">
                    <div className="relative w-full" style={{ minHeight: "200px" }}>
                      <Image
                        src={event.image_url || "/default-image.jpg"}
                        alt={event.name || "Event"}
                        layout="responsive"
                        width={500}
                        height={300}
                        objectFit="contain"
                        className="rounded-md"
                      />
                    </div>
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
