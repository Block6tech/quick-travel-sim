import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import travelersImg from "@/assets/travelers-esim.png";
import bannerGlobal from "@/assets/banner-global-connect.png";
import bannerTravel from "@/assets/banner-travel-easy.png";

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
}

const fallbackSlidesEn: BannerSlide[] = [
  { id: "1", image_url: "", title: "Stay connected,\nanywhere you go", subtitle: "Instant eSIM activation. No roaming fees." },
  { id: "2", image_url: "", title: "Global coverage\nin 120+ countries", subtitle: "One tap setup. Unlimited data plans." },
  { id: "3", image_url: "", title: "Travel smarter\nwith eSIM", subtitle: "Skip the SIM card hassle. Connect instantly." },
];

const fallbackSlidesAr: BannerSlide[] = [
  { id: "1", image_url: "", title: "ابقَ متصلاً،\nأينما ذهبت", subtitle: "تفعيل فوري لشريحة eSIM. بدون رسوم تجوال." },
  { id: "2", image_url: "", title: "تغطية عالمية\nفي أكثر من 120 دولة", subtitle: "إعداد بنقرة واحدة. باقات بيانات غير محدودة." },
  { id: "3", image_url: "", title: "سافر بذكاء\nمع eSIM", subtitle: "تخلّص من عناء الشرائح. اتصل فوراً." },
];

const fallbackImages: Record<string, string> = { "1": travelersImg, "2": bannerGlobal, "3": bannerTravel };

const AUTO_PLAY_MS = 4000;

export default function HeroBanner() {
  const { locale } = useLanguage();
  const [active, setActive] = useState(0);
  const fallback = locale === "ar" ? fallbackSlidesAr : fallbackSlidesEn;
  const [slides, setSlides] = useState<BannerSlide[]>(fallback);

  useEffect(() => {
    supabase
      .from("banner_slides")
      .select("id, title, subtitle, title_ar, subtitle_ar, image_url")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped = data.map((s: any) => ({
            id: s.id,
            image_url: s.image_url,
            title: locale === "ar" && s.title_ar ? s.title_ar : s.title,
            subtitle: locale === "ar" && s.subtitle_ar ? s.subtitle_ar : s.subtitle,
          }));
          setSlides(mapped);
        } else {
          setSlides(fallback);
        }
      });
  }, [locale]);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  const current = slides[active];
  const imgSrc = current.image_url || fallbackImages[current.id] || travelersImg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="space-y-2"
    >
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-secondary">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
          >
            <motion.img
              src={imgSrc}
              alt={current.title}
              className="w-20 h-20 object-contain"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <h2 className="text-base font-bold text-foreground text-center whitespace-pre-line leading-tight mt-2">
              {current.title}
            </h2>
            <p className="text-xs text-muted-foreground text-center mt-1">
              {current.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-5 bg-foreground" : "w-1.5 bg-muted-foreground/30"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
