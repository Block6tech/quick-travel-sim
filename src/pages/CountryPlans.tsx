import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import PlanCard from "@/components/PlanCard";
import { countries, regionalBundles, getPlansForCountry } from "@/data/esim-data";
import { useLanguage, getCountryName } from "@/contexts/LanguageContext";
import { ContinentIcon } from "@/components/ContinentIcons";

const REGIONAL_CODES = ["EU", "AS", "ME", "GL", "GP"];

function countryFlag(code: string): string {
  if (code.length !== 2) return "";
  const offset = 0x1f1e6 - 65;
  return String.fromCodePoint(code.charCodeAt(0) + offset, code.charCodeAt(1) + offset);
}

const CountryPlans = () => {
  const { code } = useParams<{ code: string }>();
  const country = [...countries, ...regionalBundles].find((c) => c.code === code);
  const plans = getPlansForCountry(code || "");
  const { t, locale } = useLanguage();

  if (!country) {
    return (
      <AppLayout showBack title={t.notFound}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{t.destinationNotFound}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBack title={getCountryName(country.code, country.name, locale)}>
      <div className="px-4 pt-6 pb-4 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
              {REGIONAL_CODES.includes(country.code) ? (
                <ContinentIcon code={country.code} className="w-7 h-7" />
              ) : (
                <span className="text-2xl leading-none">{countryFlag(country.code)}</span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-display">
                {t.dataFor(getCountryName(country.code, country.name, locale))}
              </h1>
              <p className="text-xs text-muted-foreground leading-body">
                {t.instantActivation}
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
