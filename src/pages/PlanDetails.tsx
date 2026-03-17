import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Wifi, Smartphone, Signal } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { EsimPlan } from "@/data/esim-data";

const PlanDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan as EsimPlan | undefined;

  if (!plan) {
    return (
      <AppLayout showBack title="Plan">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Plan not found.</p>
        </div>
      </AppLayout>
    );
  }

  const features = [
    { icon: <Signal className="w-4 h-4" />, label: "Speed", value: plan.speed },
    { icon: <Wifi className="w-4 h-4" />, label: "Hotspot", value: plan.hotspot ? "Supported" : "Not supported" },
    { icon: <Smartphone className="w-4 h-4" />, label: "Type", value: "eSIM (Digital)" },
  ];

  const faqs = [
    { q: "Will it work when I land?", a: "Yes. Your eSIM activates instantly once connected to a local network. Just turn on data roaming in your settings." },
    { q: "Can I share data via hotspot?", a: plan.hotspot ? "Yes, hotspot / tethering is fully supported with this plan." : "No, this plan does not support hotspot." },
    { q: "What if I run out of data?", a: "You can buy a top-up at any time from your dashboard. Your number stays the same." },
  ];

  return (
    <AppLayout showBack showNav={false}>
      <div className="px-4 pt-6 pb-28 space-y-6">
        {/* Plan Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-foreground flex items-center justify-center">
              <span className="text-primary-foreground text-[10px] font-bold font-mono-data">
                {plan.countryCode}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{plan.country}</span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-display">{plan.data}</h1>
              <p className="text-sm text-muted-foreground mt-1">{plan.validity}</p>
            </div>
            <div className="text-right">
              {plan.isBestValue && (
                <span className="inline-block mb-1 px-2 py-0.5 bg-foreground text-primary-foreground text-[10px] font-bold uppercase rounded-sm tracking-wider">
                  Best Value
                </span>
              )}
              <p className="text-3xl font-mono-data font-bold">${plan.price.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
          className="space-y-2"
        >
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Details</h2>
          <div className="bg-card rounded-lg shadow-card divide-y divide-border">
            {features.map((f) => (
              <div key={f.label} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {f.icon}
                  {f.label}
                </div>
                <span className="text-sm font-medium">{f.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Networks */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="space-y-2"
        >
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Works on
          </h2>
          <div className="flex flex-wrap gap-2">
            {plan.networks.map((n) => (
              <span
                key={n}
                className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-md"
              >
                {n}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Trust */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          className="bg-secondary rounded-lg p-4 space-y-2"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-foreground" />
            <span className="text-sm font-medium">Works instantly when you land</span>
          </div>
          <p className="text-xs text-muted-foreground leading-body pl-6">
            Turn on data roaming and you're connected. No physical SIM swap needed.
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="space-y-3"
        >
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Common questions
          </h2>
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

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 max-w-[480px] mx-auto">
        <button
          onClick={() => navigate("/checkout", { state: { plan } })}
          className="w-full h-12 bg-foreground text-primary-foreground font-semibold rounded-lg btn-press transition-all duration-200 touch-target text-sm"
        >
          Buy Now · ${plan.price.toFixed(2)}
        </button>
      </div>
    </AppLayout>
  );
};

export default PlanDetails;
