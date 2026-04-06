import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Wifi, Smartphone, Signal, AlertTriangle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { EsimPlan } from "@/data/esim-data";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage, getCountryName } from "@/contexts/LanguageContext";

const PlanDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan as EsimPlan | undefined;
  const { formatPrice } = useCurrency();
  const { t, locale } = useLanguage();

  if (!plan) {
    return (
      <AppLayout showBack title={t.plan}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{t.planNotFound}</p>
        </div>
      </AppLayout>
    );
  }

  const features = [
    { icon: <Signal className="w-4 h-4" />, label: t.speed, value: plan.speed },
    { icon: <Wifi className="w-4 h-4" />, label: t.hotspotLabel, value: plan.hotspot ? t.supported : t.notSupported },
    { icon: <Smartphone className="w-4 h-4" />, label: t.type, value: t.esimDigital },
  ];

  const faqs = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: plan.hotspot ? t.faqA2Yes : t.faqA2No },
    { q: t.faqQ3, a: t.faqA3 },
  ];

  return (
    <AppLayout showBack showNav={false}>
      <div className="px-4 pt-6 pb-28 space-y-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-foreground flex items-center justify-center">
              <span className="text-primary-foreground text-[10px] font-bold font-mono-data">{plan.countryCode}</span>
            </div>
            <span className="text-sm text-muted-foreground">{getCountryName(plan.countryCode, plan.country, locale)}</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
            <h1 className="text-4xl font-bold tracking-display">{plan.validity}</h1>
              <p className="text-sm text-muted-foreground mt-1">{plan.data}</p>
            </div>
            <div className="text-end">
              {plan.isBestValue && (
                <span className="inline-block mb-1 px-2 py-0.5 bg-foreground text-primary-foreground text-[10px] font-bold uppercase rounded-sm tracking-wider">{t.bestValue}</span>
              )}
              <p className="text-3xl font-mono-data font-bold">{formatPrice(plan.price)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }} className="space-y-2">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.details}</h2>
          <div className="bg-card rounded-lg shadow-card divide-y divide-border">
            {features.map((f) => (
              <div key={f.label} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">{f.icon}{f.label}</div>
                <span className="text-sm font-medium">{f.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }} className="space-y-2">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.worksOn}</h2>
          <div className="flex flex-wrap gap-2">
            {plan.networks.map((n) => (
              <span key={n} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-md">{n}</span>
            ))}
          </div>
        </motion.div>

        {plan.conditions && plan.conditions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.13, ease: [0.2, 0.8, 0.2, 1] }} className="space-y-2">
            <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              {t.conditions ?? "Conditions"}
            </h2>
            <div className="bg-card rounded-lg shadow-card divide-y divide-border">
              {plan.conditions.map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3">
                  <span className="text-base leading-none mt-0.5">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{t.conditionLabels?.[c.label] || c.label}</p>
                    <p className="text-xs text-muted-foreground leading-body mt-0.5">{t.conditionDetails?.[c.detail] || c.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }} className="bg-secondary rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-foreground" />
            <span className="text-sm font-medium">{t.worksInstantly}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-body ps-6">{t.worksInstantlyDesc}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }} className="space-y-3">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.commonQuestions}</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="space-y-1">
                <p className="text-sm font-medium">{faq.q}</p>
                <p className="text-xs text-muted-foreground leading-body">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 max-w-[480px] mx-auto">
        <button onClick={() => navigate("/checkout", { state: { plan } })} className="w-full h-12 bg-foreground text-primary-foreground font-semibold rounded-lg btn-press transition-all duration-200 touch-target text-sm">
          {t.buyNow} · {formatPrice(plan.price)}
        </button>
      </div>
    </AppLayout>
  );
};

export default PlanDetails;
