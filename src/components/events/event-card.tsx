"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info } from "lucide-react";
import Link from "next/link";

interface EventCardProps {
  event: {
    id: string;
    name: string | null;
    description: string | null;
    image_url: string | null;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="flex items-center justify-center py-20 w-screen">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-center mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-[300px] sm:h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden"
        >
          <Image
            src={event.image_url || "/placeholder.svg"}
            alt={event.name || "event-image"}
            width={600}
            height={400}
            className="object-contain w-full h-full"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="space-y-2 w-[90%] text-start">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">{event.name}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-balance">{event.description}</p>
          </div>

          <div className="flex flex-wrap gap-4 justify-start">
            <Button size="lg">
              <Link href={`/events/${event.id}`}>View Event</Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>{event.name}</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
                  <Button className="w-full mt-6">Register for this Event</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventCard;
