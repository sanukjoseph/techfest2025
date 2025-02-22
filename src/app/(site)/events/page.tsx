import { getAllEvents } from "@/actions/events";
import { squidgame } from "@/app/styles/fonts";
import Image from "next/image";
import Link from "next/link";

const EventsPage = async () => {
  const events = await getAllEvents();

  return (
    <section className="py-20 bg-background relative min-h-screen">
      {/* Background Pattern */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="container mx-auto  flex flex-col gap-16 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mx-auto max-w-2xl">
          <h2 className={`${squidgame.className} mb-4 text-4xl font-semibold md:text-5xl lg:text-6xl text-[#ed298f]`}>Events</h2>
          <p className="text-muted-foreground text-lg lg:text-xl">Explore the various events happening at Techsphere.</p>
        </div>

        {/* Events Flex Container */}
        <div className="flex flex-wrap justify-center gap-8 z-20">
          {events?.data?.map((event) => (
            <div
              key={event.id}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg w-full sm:w-[calc(50%-20px)] lg:w-[calc(33.333%-22px)]"
            >
              {/* Event Image */}
              <div className="relative aspect-square w-full">
                <Image
                  src={event.image_url || "/default-image.jpg"}
                  alt={event.name || "Event image"}
                  className="object-cover p-3 rounded-md"
                  fill
                />
              </div>

              {/* Event Details */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-4 text-xl font-semibold">{event.name}</h3>
                <p className="mb-6 text-muted-foreground">{event.description}</p>

                {/* Button to Event Detail Page */}
                <div className="mt-auto">
                  <Link
                    href={`/events/${event.id}`}
                    className="inline-block w-full animate-fade-in bg-[#ed298f] hover:bg-[#ed298eec] text-white rounded-md px-6 py-3 text-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsPage;
