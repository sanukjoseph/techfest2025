"use client";

import React, { useRef, useEffect } from "react";
// import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollSectionProps {
  items: React.ReactNode[];
  direction: "vertical" | "horizontal";
}

const ScrollSection: React.FC<ScrollSectionProps> = ({ items, direction }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const itemsElements = Array.from(section.querySelectorAll(".item"));

    gsap.to(itemsElements, {
      xPercent: direction === "horizontal" ? -100 * (items.length - 1) : 0,
      yPercent: direction === "vertical" ? -100 * (items.length - 1) : 0,
      ease: "power1.out",
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        snap: 1 / (items.length - 1),
        start: "top top",
        end: `+=${items.length * 100}%`,
      },
    });
  }, [items, direction]);

  return (
    <div
      ref={sectionRef}
      className={`scroll-section relative overflow-hidden bg-gradient-to-b from-background from-60% to-white flex ${direction === "horizontal" ? "flex-row" : "flex-col"}`}
    >
      {items.map((item, index) => (
        <div key={index} className="item w-screen h-screen flex items-center justify-center snap-center">
          {item}
        </div>
      ))}
    </div>
  );
};

export default ScrollSection;
