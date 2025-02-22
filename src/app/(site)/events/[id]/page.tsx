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

      <div className="container mx-auto lg:px-12">
        {/* Back Button */}
        <Button variant="outline" asChild className="mb-8">
          <Link href="/events" className="flex items-center">
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Events</span>
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row gap-8 items-start w-full pt-36 pb-4">
          {/* Event Header */}
          <div className="flex flex-col items-center gap-4 text-center mb-12">
            <Badge variant="outline" className="text-sm">
              {data.category}
            </Badge>
            <h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl text-foreground">{data.name}</h1>
          </div>

          {/* Event Image */}
          <div className="p-4 md:p-0 w-full md:w-2/5 z-20">
            {data.image_url && (
              <Image
                width={1000}
                height={1000}
                src={data.image_url ?? ""}
                alt={data.name ?? "Event Image"}
                className="w-fit h-3/5 border rounded-md object-contain shadow-lg"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>

          {/* Event Details */}
          <div className="max-w-screen-md mx-">
            <Card className="mb-12 border">
              <CardHeader>
                <CardTitle className={`${squidgame.className} text-xl sm:text-2xl md:text-4xl font-bold text-foreground`}>
                  {data.name} & Debugging
                </CardTitle>
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
                      <p className="font-semibold text-foreground">Max Limit:</p>
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
        </div>

        <AttendeeForm eventId={id} isGroupEvent={data.event_type === "group"} price={data.price || 0} />
      </div>
    </section>
    // <div className="-mt-20">
    //   {/* <div className="absolute bottom-0 left-0 right-0 top-0 z-10 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div> */}
    //   <div className="container mx-auto lg:px-12">
    //     <div className="flex flex-col md:flex-row gap-8 items-start w-full pt-36 pb-4">
    //       {/* Event Image */}
    //       <div className="p-4 md:p-0 w-full md:w-2/5">
    //         <Image
    //           width={1000}
    //           height={1000}
    //           alt={data.id}
    //           src={data.image_url || ""}
    //           className="w-full h-3/5 border rounded-md object-contain shadow-lg"
    //         />
    //       </div>

    //       {/* Event Details */}
    //       <div className="flex flex-col gap-6 px-4 w-full justify-center">
    //         <h1 className={`${squidgame.className} text-xl sm:text-2xl md:text-4xl font-bold flex items-center gap-4`}>
    //           {data.name}
    //           <Badge variant="outline" className="text-sm">
    //             {data.category}
    //           </Badge>
    //         </h1>
    //         <h4 className={`${squidgame.className} text-base md:text-2xl`}>Description</h4>
    //         <p className="text-sm md:text-base">{data.description}</p>
    //         <h1
    //           className={`${squidgame.className} text-center text-xl w-full md:text-2xl lg:text-3xl font-bold text-white bg-white/10 rounded-lg p-2`}
    //         >
    //           Registration Fee: {data.price}/-
    //         </h1>

    //         {/* Prize Pool */}
    //         {/* <h1 className={`${squidgame.className} text-xl md:text-3xl font-bold`}>
    //           Prize Pool - <span className="text-pink-500">{data.price} K</span>
    //         </h1> */}

    //         {/* Register Button */}
    //         <div className="w-full">
    //           <Button
    //             className="bg-pink-600 text-white text-md font-gameOfSquid p-4 py-2 hover:bg-pink-900 rounded-lg w-full md:w-fit"
    //             variant={"default"}
    //           >
    //             Register Now
    //           </Button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <AttendeeForm eventId={id} isGroupEvent={data.event_type === "group"} price={data.price || 0} />
    // </div>
  );
};

export default EventDetailsPage;
