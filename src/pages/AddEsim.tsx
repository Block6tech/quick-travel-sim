import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, Sparkles, ArrowRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useLanguage, getCountryName } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { countries } from "@/data/esim-data";

const POPULAR_CODES = ["AE", "TR", "GB", "US", "SA", "TH", "JP", "FR"];

const AddEsim = () => {
  const navigate = useNavigate();
  const { t, locale } = useLanguage();
  const { formatPrice } = useCurrency();
  const [query, setQuery] = useState("");

  const popularCountries = useMemo(
    () => countries.filter((c) => POPULAR_CODES.includes(c.code)),
    []
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        getCountryName(c.code, c.name, locale).toLowerCase().includes(q)
    );
  }, [query, locale]);

  const showResults = query.trim().length > 0;

  return (
    <AppLayout title={t.addEsimTitle ?? "Add eSIM"} showBack showNav={false}>
      <div className="px-4 pt-5 pb-8 space-y-6">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full h-12 pl-10 pr-4 bg-secondary rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-shadow"
              autoFocus
            />
          </div>
        </motion.div>

        {/* Search results */}
        <AnimatePresence mode="wait">
          {showResults ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {t.noResults}
                </p>
              ) : (
                filtered.map((country, i) => (
                  <CountryRow
                    key={country.code}
                    country={country}
                    index={i}
                    locale={locale}
                    format={formatPrice}
                    from={t.from}
                    plans={t.plans}
                    onClick={() => navigate(`/plans/${country.code}`)}
                  />
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-3 p-4 bg-card rounded-xl shadow-card btn-press text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.allDestinations ?? "All destinations"}</p>
                    <p className="text-[11px] text-muted-foreground">{countries.length}+ {t.countries ?? "countries"}</p>
                  </div>
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-3 p-4 bg-card rounded-xl shadow-card btn-press text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.regionalBundles ?? "Regional"}</p>
                    <p className="text-[11px] text-muted-foreground">{t.multiCountry ?? "Multi-country"}</p>
                  </div>
                </button>
              </div>

              {/* Popular destinations */}
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {t.popularDestinations}
                </h2>
                <div className="space-y-2">
                  {popularCountries.map((country, i) => (
                    <CountryRow
                      key={country.code}
                      country={country}
                      index={i}
                      locale={locale}
                      format={format}
                      from={t.from}
                      plans={t.plans}
                      onClick={() => navigate(`/plans/${country.code}`)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

interface CountryRowProps {
  country: { name: string; code: string; startingPrice: number; planCount: number };
  index: number;
  locale: string;
  format: (n: number) => string;
  from: string;
  plans: (n: number) => string;
  onClick: () => void;
}

function CountryRow({ country, index, locale, format, from, plans, onClick }: CountryRowProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 bg-card rounded-xl shadow-card btn-press"
    >
      <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center shrink-0">
        <span className="text-primary-foreground text-xs font-bold font-mono-data">{country.code}</span>
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium">{getCountryName(country.code, country.name, locale)}</p>
        <p className="text-[11px] text-muted-foreground">
          {from} {format(country.startingPrice)} · {plans(country.planCount)}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground" />
    </motion.button>
  );
}

export default AddEsim;
