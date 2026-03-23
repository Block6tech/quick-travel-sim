import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Zap, Smartphone, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const ONBOARDING_KEY = "camelsim_onboarding_done";

const steps = [
  { icon: Globe, key: "onboard1" as const },
  { icon: Zap, key: "onboard2" as const },
  { icon: Smartphone, key: "onboard3" as const },
];

export default function Onboarding() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      setVisible(true);
    }
  }, []);

  const finish = () => {
    localStorage.setItem(ONBOARDING_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  const isLast = step === steps.length - 1;
  const current = steps[step];
  const Icon = current.icon;

  const titles = [t.onboardTitle1, t.onboardTitle2, t.onboardTitle3];
  const descs = [t.onboardDesc1, t.onboardDesc2, t.onboardDesc3];

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="w-full max-w-[480px] bg-background rounded-t-3xl px-6 pt-8 pb-10"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Skip */}
        <div className="flex justify-end mb-4">
          <button
            onClick={finish}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.onboardSkip}
          </button>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? 40 : -40 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center text-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-8 h-8 text-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{titles[step]}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
              {descs[step]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-6 bg-foreground" : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Action */}
        <Button
          onClick={() => (isLast ? finish() : setStep(step + 1))}
          className="w-full h-12 text-sm font-semibold rounded-xl"
        >
          {isLast ? t.onboardGetStarted : t.onboardNext}
          {!isLast && <ChevronRight className="w-4 h-4" />}
        </Button>
      </motion.div>
    </div>
  );
}
