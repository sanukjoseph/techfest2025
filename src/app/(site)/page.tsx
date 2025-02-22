import { Countdown } from "@/components/site/countdown";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight-new";
import { ArrowRight, Triangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { squidgame } from "../styles/fonts";

export default async function Home() {
  return (
    <div className="relative h-svh flex flex-col justify-center items-center overflow-hidden">
      <Spotlight />
      <div className="absolute inset-0 bg-[url(/mask.png)] bg-contain bg-center bg-no-repeat opacity-30 z-0 animate-fade-in"></div>
      <div className="flex flex-col gap-5 h-full w-full justify-center items-center text-center animate-fade-in">
        <div className="relative flex sm:mt-20 h-full flex-col gap-5 z-10 justify-center items-center">
          <span className="flex size-16 items-center justify-center rounded-full border md:size-20 animate-scale-in">
            <Triangle size={32} className="text-[#ed298f] animate-pulse" />
          </span>
          <h2 className={`${squidgame.className} max-w-screen-lg text-balance text-4xl font-medium md:text-6xl animate-fade-in`}>
            TECHSPHERE
          </h2>
          <p className="max-w-screen-md text-muted-foreground md:text-lg animate-fade-in">
            A tech festival that celebrates innovation and technology.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 z-50 animate-fade-in">
            <Button size="lg" asChild className="animate-fade-in bg-[#ed298f] hover:bg-[#ed298eec] text-white">
              <Link href="/events">
                Explore <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 animate-fade-in-up">
            <Countdown />
          </div>
        </div>
        <div className="w-full max-w-screen-lg mt-8 animate-fade-in-up">
          <Image
            src="/hero.svg"
            alt="Tech Fest"
            className="mx-auto h-full max-h-[524px] w-full rounded-2xl object-cover filter brightness-90"
            width={1200}
            height={600}
          />
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-background animate-fade-in"></div>
    </div>
  );
}
