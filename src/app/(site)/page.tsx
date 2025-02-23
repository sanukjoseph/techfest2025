import AboutUs from "@/components/home/AboutUs";
import CountDownSection from "@/components/home/CountDownSection";
import { FAQSection } from "@/components/home/FAQSection";
import FeaturedEvents from "@/components/home/FeaturedEvents";
import HeroSection from "@/components/home/HeroSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMASH Tech Fest - Home",
  description: "Welcome to SMASH Tech Fest! Discover exciting events, learn new skills, and connect with the tech community.",
};

export default function Home() {
  return (
    <div className="bg-black relative overflow-hidden">
      <HeroSection />
      <FeaturedEvents />
      <CountDownSection />
      <AboutUs />
      <FAQSection />
    </div>
  );
}
