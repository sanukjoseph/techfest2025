import { squidgame } from "@/app/styles/fonts";
import { getEvent } from "@/actions/events";
import AttendeeForm from "@/components/events/attendee-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const EventDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const event = await getEvent(id);

  if (!event?.data) {
    return notFound();
  }

  const { data } = event;

  return (
    <section className="py-5 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative bg-gradient-to-t from-black to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)]"></div>

      <div className="container max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <Button variant="outline" size={"icon"} asChild className="mb-8 bg-pink-600 hover:bg-pink-800 transition-colors rounded-full">
          <Link href="/events" className="flex items-center">
            <ArrowLeft size={20} />
          </Link>
        </Button>

        {/* Event Header */}
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <Badge variant="outline" className="text-sm bg-gray-900/50 backdrop-blur-sm border-gray-800">
            {data.category}
          </Badge>
          <h1
            className={`${squidgame.className} text-3xl font-semibold md:text-4xl lg:text-5xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent`}
          >
            {data.name}
          </h1>
        </div>

        {/* Event Image */}
        <div className="relative w-full max-w-screen-md mx-auto aspect-square rounded-xl overflow-hidden mb-12 shadow-lg">
          {data.image_url && <Image src={data.image_url ?? ""} alt={data.name ?? "Event Image"} className="object-cover" fill />}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent"></div>
        </div>

        {/* Event Details */}
        <div className="max-w-screen-md mx-auto">
          <Card className="mb-12 bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-semibold">
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg text-gray-400">{data.description}</p>
                <Separator className="bg-gray-800" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-gray-200">Price:</p>
                    <p className="text-gray-400">₹{data.price}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200">Event Limit:</p>
                    <p className="text-gray-400">{data.event_limit}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200">Event Type:</p>
                    <p className="text-gray-400">{data.event_type}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200">Category:</p>
                    <p className="text-gray-400">{data.category}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendee Form */}
        <AttendeeForm eventId={id} isGroupEvent={data.event_type === "group"} price={data.price || 0} />
      </div>
    </section>
  );
};

export default EventDetailsPage;
