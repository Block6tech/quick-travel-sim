import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const anim = (d = 0) => ({
  initial: { opacity: 0, y: 8 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.3, delay: d, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] },
});

export default function HelpCenter() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  const categories = t.faqCategories as {
    title: string;
    items: { q: string; a: string }[];
  }[];

  return (
    <AppLayout>
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="flex items-center gap-3 px-4 h-14 max-w-lg mx-auto">
            <button onClick={() => navigate(-1)} className="p-1 -ml-1">
              {isRTL ? (
                <ChevronRight className="w-5 h-5 text-foreground" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-foreground" />
              )}
            </button>
            <h1 className="text-lg font-semibold text-foreground">{t.helpCenter}</h1>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          {categories.map((cat, ci) => (
            <motion.div key={ci} {...anim(ci * 0.08)}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {cat.title}
              </h2>
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                <Accordion type="single" collapsible>
                  {cat.items.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`${ci}-${i}`}
                      className="border-border/50 last:border-b-0"
                    >
                      <AccordionTrigger className="px-4 text-sm font-medium text-foreground hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 text-sm text-muted-foreground leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
