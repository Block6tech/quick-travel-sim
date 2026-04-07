import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import travelersImg from "@/assets/travelers-esim.png";
import bannerGlobal from "@/assets/banner-global-connect.jpg";
import bannerTravel from "@/assets/banner-travel-easy.jpg";

export interface BannerSlide {
  id: string;
  image: string;
  alt: string;
}

const mockSlides: BannerSlide[] = [
  { id: "1", image: travelersImg, alt: "Stay connected anywhere" },
  { id: "2", image: bannerGlobal, alt: "Global eSIM coverage" },
  { id: "3", image: bannerTravel, alt: "Travel made easy" },
];

const AUTO_PLAY_MS = 4000;

export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const slides = mockSlides;

  const next = useCallback(() => {
    setActive((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="space-y-2"
    >
      {/* Banner */}
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-secondary">
        <AnimatePresence mode="wait">
          <motion.img
            key={slides[active].id}
            src={slides[active].image}
            alt={slides[active].alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active
                ? "w-5 bg-foreground"
                : "w-1.5 bg-muted-foreground/30"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
