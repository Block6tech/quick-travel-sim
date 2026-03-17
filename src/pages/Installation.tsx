import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { EsimPlan } from "@/data/esim-data";
import { useLanguage, getCountryName } from "@/contexts/LanguageContext";

const Installation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan as EsimPlan | undefined;
  const [copied, setCopied] = useState(false);
  const { t, locale } = useLanguage();

  const smdpAddress = "smdp.io.simlink.com";
  const activationCode = "K2-29FJ-LKSD9";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { step: "1", title: t.step1Title, desc: t.step1Desc },
    { step: "2", title: t.step2Title, desc: t.step2Desc },
    { step: "3", title: t.step3Title, desc: t.step3Desc },
    { step: "4", title: t.step4Title, desc: t.step4Desc },
  ];

  return (
    <AppLayout showBack={false} showNav={false}>
      <div className="px-4 pt-6 pb-8 space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }} className="text-center space-y-3">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2, type: "spring" }} className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-primary-foreground" strokeWidth={3} />
          </motion.div>
          <h1 className="text-xl font-bold tracking-display">{t.purchaseComplete}</h1>
          <p className="text-sm text-muted-foreground leading-body whitespace-pre-line">
            {t.esimReady(plan?.country || "")}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }} className="flex flex-col items-center gap-4">
          <div className="w-48 h-48 bg-foreground rounded-xl flex items-center justify-center p-4">
            <div className="w-full h-full bg-primary-foreground rounded-md grid grid-cols-7 grid-rows-7 gap-[2px] p-2">
              {Array.from({ length: 49 }).map((_, i) => (
                <div key={i} className={`rounded-[1px] ${Math.random() > 0.4 ? "bg-foreground" : "bg-transparent"}`} />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.scanWithCamera}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }} className="space-y-3">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.orEnterManually}</h2>
          <div className="bg-card rounded-lg shadow-card divide-y divide-border">
            <div className="flex items-center justify-between p-3">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.smdpAddress}</p>
                <p className="text-xs font-mono-data mt-0.5">{smdpAddress}</p>
              </div>
              <button onClick={() => handleCopy(smdpAddress)} className="p-2 rounded-md hover:bg-secondary transition-colors btn-press">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
            <div className="flex items-center justify-between p-3">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.activationCode}</p>
                <p className="text-xs font-mono-data mt-0.5">{activationCode}</p>
              </div>
              <button onClick={() => handleCopy(activationCode)} className="p-2 rounded-md hover:bg-secondary transition-colors btn-press">
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }} className="space-y-3">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.installIn2Min}</h2>
          <div className="space-y-3">
            {steps.map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-foreground text-[10px] font-bold font-mono-data">{s.step}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="text-xs text-muted-foreground leading-body">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}>
          <button className="w-full h-12 bg-secondary text-secondary-foreground font-medium rounded-lg btn-press transition-all duration-200 touch-target text-sm flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4" />
            {t.watchHowToInstall}
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}>
          <button onClick={() => navigate("/dashboard")} className="w-full h-12 bg-foreground text-primary-foreground font-semibold rounded-lg btn-press transition-all duration-200 touch-target text-sm">
            {t.goToMyEsims}
          </button>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Installation;
