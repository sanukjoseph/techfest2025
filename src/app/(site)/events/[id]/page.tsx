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
import { squidgame } from "@/app/styles/fonts";
import { Metadata } from "next";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const id = (await params).id;
  const event = await getEvent(id);
  if (!event?.data) {
    return {
      title: "Event Not Found",
    };
  }
  return {
    title: event.data.name ?? "Event Details",
    description: event.data.description ?? undefined,
    openGraph: {
      title: event.data.name ?? undefined,
      description: event.data.description ?? undefined,
      images: event.data.image_url ? [event.data.image_url] : undefined,
    },
    twitter: {
      title: event.data.name ?? undefined,
      description: event.data.description ?? undefined,
      images: event.data.image_url ? [event.data.image_url] : undefined,
    },
  };
}

const EventDetailsPage = async ({ params }: Params) => {
  const id = (await params).id;
  const event = await getEvent(id);

  if (!event?.data) {
    return notFound();
  }

  const { data } = event;

  return (
    <section className="min-h-screen py-5 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative ">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)]" />

      <div className="container max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <Button
          variant="outline"
          size="icon"
          asChild
          className="mb-8 bg-pink-600 hover:bg-pink-800 transition-colors rounded-full focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-black"
        >
          <Link href="/events" className="flex items-center">
            <ArrowLeft size={20} />
            <span className="sr-only">Back to events</span>
          </Link>
        </Button>

        {/* Event Header */}
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <Badge variant="outline" className="text-sm bg-gray-900/50 backdrop-blur-sm border-gray-800 px-4 py-1 uppercase">
            {data.category}
          </Badge>
          <h1
            className={`${squidgame.className} text-3xl font-semibold md:text-4xl lg:text-5xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent px-4`}
          >
            {data.name}
          </h1>
        </div>

        {/* Event Image */}
        <div className="relative w-full max-w-4xl mx-auto mb-12">
          <div className="relative w-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-gray-800">
            <Image
              src={data.image_url ?? "/default-image.jpg"}
              alt=""
              width={1920}
              height={1080}
              priority
              className="w-full h-auto"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
          </div>
        </div>

        {/* Event Details */}
        <div className="max-w-4xl mx-auto space-y-12">
          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-semibold">
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">{data.description}</p>
                <Separator className="bg-gray-800" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h2 className="font-semibold text-gray-200 text-md">Registration Fee</h2>
                    <p className="text-gray-400 text-lg">{data.price ? `₹${data.price}` : "Free"}</p>
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-semibold text-gray-200 text-md">Max Participants</h2>
                    <p className="text-gray-400 text-lg">{data.event_limit || "Unlimited"}</p>
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-semibold text-gray-200 text-md">Team Size</h2>
                    <p className="text-gray-400 text-lg capitalize">
                      {data.event_type}
                      <span className="ml-2">
                        {data.event_type === "group" && (
                          <>
                            {data.min_group_size} - {data.max_group_size}
                          </>
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-semibold text-gray-200 text-md">Category</h2>
                    <p className="text-gray-400 text-lg capitalize">{data.category}</p>
                  </div>
                </div>
                <div className="space-y-">
                  <h2 className="text-sm text-gray-600">
                    <span className="text-red-800">Disclamer:</span> The details provided will be directly reflected in the certificate.
                    Please ensure accuracy, as the organization is not responsible for any errors in the submitted information. for errors.
                  </h2>
                </div>
              </div>
            </CardContent>
          </Card>
          {data.active ? (
            <AttendeeForm
              eventId={data.id}
              name={data.name ?? ""}
              price={data.price ?? 0}
              description={data.description ?? ""}
              eventType={data.event_type ?? ""}
              maxGroupSize={data.max_group_size ?? 0}
              minGroupSize={data.min_group_size ?? 0}
            />
          ) : (
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 shadow-xl text-center">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-semibold">
                  Registration Closed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-300 leading-relaxed">Registration for this event is now closed.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventDetailsPage;
