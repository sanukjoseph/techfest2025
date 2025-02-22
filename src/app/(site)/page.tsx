import AboutUs from "@/components/home/AboutUs";
import CountDownSection from "@/components/home/CountDownSection";
import { FAQSection } from "@/components/home/FAQSection";
import FeaturedEvents from "@/components/home/FeaturedEvents";
import HeroSection from "@/components/home/HeroSection";

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
