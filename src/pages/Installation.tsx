import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, ExternalLink, Smartphone, Download, Plane, Signal, ChevronDown, AlertTriangle } from "lucide-react";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { EsimPlan } from "@/data/esim-data";
import { useLanguage, getCountryName } from "@/contexts/LanguageContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const iconMap: Record<string, React.ReactNode> = {
  download: <Download className="w-5 h-5" />,
  plane: <Plane className="w-5 h-5" />,
  signal: <Signal className="w-5 h-5" />,
};

const Installation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan as EsimPlan | undefined;
  const [copied, setCopied] = useState(false);
  const [deviceOpen, setDeviceOpen] = useState(false);
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

  const howItWorksSteps = t.howItWorksSteps as { icon: string; label: string; desc: string }[];

  return (
    <AppLayout showBack={false} showNav={false} title={undefined}>
      <div className="px-4 pt-6 pb-8 space-y-6">
        {/* Success Header */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }} className="text-center space-y-3">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2, type: "spring" }} className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-primary-foreground" strokeWidth={3} />
          </motion.div>
          <h1 className="text-xl font-bold tracking-display">{t.purchaseComplete}</h1>
          <p className="text-sm text-muted-foreground leading-body whitespace-pre-line">
            {t.esimReady(getCountryName(plan?.countryCode || "", plan?.country || "", locale))}
          </p>
        </motion.div>

        {/* Before Flight Advisory */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }} className="bg-accent/50 border border-accent rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-accent-foreground flex-shrink-0" />
            <h2 className="text-sm font-semibold text-accent-foreground">{t.beforeFlightTitle}</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-body">{t.beforeFlightDesc}</p>
        </motion.div>

        {/* How It Works - Visual Flow */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }} className="space-y-3">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.howItWorksTitle}</h2>
          <div className="bg-card rounded-xl shadow-card p-4">
            <div className="flex items-start justify-between relative">
              {howItWorksSteps.map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center text-center relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.15, type: "spring" }}
                    className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center text-primary-foreground mb-2"
                  >
                    {iconMap[s.icon]}
                  </motion.div>
                  <p className="text-[11px] font-semibold leading-tight">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{s.desc}</p>
                </div>
              ))}
              {/* Connector lines */}
              <div className="absolute top-6 left-[16.5%] right-[16.5%] h-[2px] bg-border z-0">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="h-full bg-foreground/30 origin-left"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* QR Code */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.18, ease: [0.2, 0.8, 0.2, 1] }} className="flex flex-col items-center gap-4">
          <div className="w-48 h-48 bg-foreground rounded-xl flex items-center justify-center p-4">
            <div className="w-full h-full bg-primary-foreground rounded-md grid grid-cols-7 grid-rows-7 gap-[2px] p-2">
              {Array.from({ length: 49 }).map((_, i) => (
                <div key={i} className={`rounded-[1px] ${Math.random() > 0.4 ? "bg-foreground" : "bg-transparent"}`} />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.scanWithCamera}</p>
          <button
            onClick={() => {/* deep link or install action */}}
            className="w-full h-12 bg-foreground text-primary-foreground font-semibold rounded-lg btn-press transition-all duration-200 touch-target text-sm flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t.installEsim}
          </button>
        </motion.div>

        {/* Manual Entry */}
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

        {/* Installation Steps */}
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

        {/* Device Compatibility - Collapsible */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.28, ease: [0.2, 0.8, 0.2, 1] }}>
          <Collapsible open={deviceOpen} onOpenChange={setDeviceOpen}>
            <CollapsibleTrigger className="w-full bg-card rounded-lg shadow-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.deviceCompatibility}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${deviceOpen ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="bg-card rounded-b-lg shadow-card px-4 pb-4 pt-1 space-y-3 -mt-1">
                {(t.compatibleDevices as { brand: string; models: string }[]).map((d, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-foreground">{d.brand}</p>
                    <p className="text-xs text-muted-foreground leading-body">{d.models}</p>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </motion.div>

        {/* Watch Video */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}>
          <button className="w-full h-12 bg-secondary text-secondary-foreground font-medium rounded-lg btn-press transition-all duration-200 touch-target text-sm flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4" />
            {t.watchHowToInstall}
          </button>
        </motion.div>

        {/* Go to eSIMs */}
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
