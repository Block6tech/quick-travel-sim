import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import PlanCard from "@/components/PlanCard";
import { countries, regionalBundles, getPlansForCountry } from "@/data/esim-data";

const CountryPlans = () => {
  const { code } = useParams<{ code: string }>();
  const country = [...countries, ...regionalBundles].find((c) => c.code === code);
  const plans = getPlansForCountry(code || "");

  if (!country) {
    return (
      <AppLayout showBack title="Not Found">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Destination not found.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBack title={`${country.name}`}>
      <div className="px-4 pt-6 pb-4 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold font-mono-data">
                {country.code}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-display">
                Data for {country.name}
              </h1>
              <p className="text-xs text-muted-foreground leading-body">
                Instant activation · No roaming fees
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-2">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.05 + i * 0.04,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            >
              <PlanCard plan={plan} />
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default CountryPlans;
