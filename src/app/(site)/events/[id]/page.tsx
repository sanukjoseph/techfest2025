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
    <section className="py-5 md:py-20 px-4 sm:px-6 lg:px-8 relative min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="container max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <Button variant="outline" asChild className="mb-8">
          <Link href="/events" className="flex items-center">
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Events</span>
          </Link>
        </Button>

        {/* Event Header */}
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <Badge variant="outline" className="text-sm">
            {data.category}
          </Badge>
          <h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl text-foreground">{data.name}</h1>
        </div>

        {/* Event Image */}
        <div className="relative w-full max-w-screen-md mx-auto aspect-square rounded-xl overflow-hidden mb-12">
          {data.image_url && <Image src={data.image_url ?? ""} alt={data.name ?? "Event Image"} className="object-cover" fill />}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>

        {/* Event Details */}
        <div className="max-w-screen-md mx-auto">
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">{data.description}</p>
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-foreground">Price:</p>
                    <p className="text-muted-foreground">₹{data.price}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Event Limit:</p>
                    <p className="text-muted-foreground">{data.event_limit}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Event Type:</p>
                    <p className="text-muted-foreground">{data.event_type}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Category:</p>
                    <p className="text-muted-foreground">{data.category}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <AttendeeForm eventId={id} isGroupEvent={data.event_type === "group"} price={data.price || 0} />
      </div>
    </section>
  );
};

export default EventDetailsPage;
