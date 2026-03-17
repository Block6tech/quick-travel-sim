import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ChevronRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import CountryCard from "@/components/CountryCard";
import { countries, regionalBundles } from "@/data/esim-data";
import { ContinentIcon } from "@/components/ContinentIcons";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage, getCountryName } from "@/contexts/LanguageContext";

const popularCodes = ["AE", "TR", "GB", "US", "TH", "SA"];

const globalBundles = [
  { name: "Global", code: "GL", startingPrice: 15, planCount: 4 },
  { name: "Global Plus", code: "GP", startingPrice: 25, planCount: 3 },
];

const regionOnly = regionalBundles.filter((b) => b.code !== "GL");

function countryFlag(code: string): string {
  if (code.length !== 2) return "";
  const offset = 0x1f1e6 - 65;
  return String.fromCodePoint(code.charCodeAt(0) + offset, code.charCodeAt(1) + offset);
}

const Index = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { t, locale } = useLanguage();
  const cn = (code: string, name: string) => getCountryName(code, name, locale);

  const popular = useMemo(() => countries.filter((c) => popularCodes.includes(c.code)), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return countries.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }, [query]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof countries> = {};
    countries.forEach((c) => {
      const translated = cn(c.code, c.name);
      const letter = translated[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(c);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b, locale));
  }, [locale]);

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 space-y-6">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}>
          <h1 className="text-2xl font-bold tracking-display whitespace-pre-line">{t.heroTitle}</h1>
          <p className="text-sm text-muted-foreground mt-1 leading-body">{t.heroSubtitle}</p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }} className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder={t.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} autoFocus className="w-full h-12 ps-10 pe-10 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all touch-target" />
          {query && (
            <button onClick={() => setQuery("")} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>

        {filtered ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.resultCount(filtered.length)}</p>
            <div className="space-y-2">
              {filtered.map((c, i) => (<CountryCard key={c.code} country={c} delay={i * 30} />))}
              {filtered.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">{t.noResults}</p>}
            </div>
          </div>
        ) : (
          <>
            <SwipeSection title={t.popularDestinations} delay={0.1}>
              {popular.map((c) => (
                <DestinationChip key={c.code} country={c} formatPrice={formatPrice} />
              ))}
            </SwipeSection>

            <SwipeSection title={t.regionalBundles} delay={0.15}>
              {regionOnly.map((c) => (<BundleCard key={c.code} country={c} formatPrice={formatPrice} />))}
            </SwipeSection>

            <SwipeSection title={t.globalBundles} delay={0.2}>
              {globalBundles.map((c) => (<BundleCard key={c.code} country={c} formatPrice={formatPrice} />))}
            </SwipeSection>

            {/* All Destinations — Alphabetical grouped list */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }} className="space-y-2">
              <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.allDestinations}</h2>

              {/* Alphabet quick-jump bar */}
              <div className="flex flex-wrap gap-1 pb-1">
                {grouped.map(([letter]) => (
                  <button
                    key={letter}
                    onClick={() => document.getElementById(`letter-${letter}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="w-7 h-7 rounded-md bg-secondary text-muted-foreground text-[11px] font-medium flex items-center justify-center hover:bg-accent hover:text-foreground transition-colors"
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {/* Grouped country list */}
              <div className="rounded-xl bg-card shadow-card overflow-hidden divide-y divide-border">
                {grouped.map(([letter, group]) => (
                  <div key={letter} id={`letter-${letter}`}>
                    {/* Letter header — sticky */}
                    <div className="px-3 py-1.5 bg-secondary/60 sticky top-0 z-10">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase">{letter}</span>
                    </div>
                    {/* Countries in this letter */}
                    <div className="divide-y divide-border/50">
                      {group.map((c) => (
                        <AlphabetCountryRow key={c.code} country={c} formatPrice={formatPrice} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

function SwipeSection({ title, delay, children }: { title: string; delay: number; children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay, ease: [0.2, 0.8, 0.2, 1] }} className="space-y-3">
      <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{title}</h2>
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 pb-1" style={{ WebkitOverflowScrolling: "touch" }}>{children}</div>
    </motion.div>
  );
}

function DestinationChip({ country, formatPrice: fp }: { country: { name: string; code: string; startingPrice: number }; formatPrice: (n: number) => string }) {
  const navigate = useNavigate();
  const { t, locale } = useLanguage();
  const flag = countryFlag(country.code);
  const name = getCountryName(country.code, country.name, locale);
  return (
    <button onClick={() => navigate(`/plans/${country.code}`)} className="flex-shrink-0 snap-start flex items-center gap-2.5 ps-1.5 pe-4 py-1.5 rounded-full bg-card shadow-card hover:shadow-card-hover transition-all duration-200 btn-press touch-target">
      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
        <span className="text-lg leading-none">{flag}</span>
      </div>
      <div className="text-start whitespace-nowrap">
        <p className="text-xs font-medium">{name}</p>
        <p className="text-[10px] text-muted-foreground font-mono-data">{t.from} {fp(country.startingPrice)}</p>
      </div>
    </button>
  );
}

function BundleCard({ country, formatPrice: fp }: { country: { name: string; code: string; startingPrice: number; planCount: number }; formatPrice: (n: number) => string }) {
  const navigate = useNavigate();
  const { t, locale } = useLanguage();
  const name = getCountryName(country.code, country.name, locale);
  return (
    <button onClick={() => navigate(`/plans/${country.code}`)} className="flex-shrink-0 snap-start w-40 p-4 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-200 btn-press text-start touch-target">
      <div className="w-10 h-10 rounded-lg bg-secondary text-foreground flex items-center justify-center mb-3">
        <ContinentIcon code={country.code} />
      </div>
      <p className="text-sm font-medium">{name}</p>
      <div className="flex items-baseline justify-between mt-1">
        <p className="text-xs text-muted-foreground">{t.plans(country.planCount)}</p>
        <p className="text-xs font-mono-data font-medium">{fp(country.startingPrice)}</p>
      </div>
    </button>
  );
}

function AlphabetCountryRow({ country, formatPrice: fp }: { country: { name: string; code: string; startingPrice: number; planCount: number }; formatPrice: (n: number) => string }) {
  const navigate = useNavigate();
  const { t, locale } = useLanguage();
  const flag = countryFlag(country.code);
  const name = getCountryName(country.code, country.name, locale);
  return (
    <button
      onClick={() => navigate(`/plans/${country.code}`)}
      className="flex items-center gap-3 w-full px-3 py-2.5 text-start hover:bg-accent/50 transition-colors active:bg-accent"
    >
      <span className="text-xl leading-none">{flag}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-[11px] text-muted-foreground">{t.plans(country.planCount)}</p>
      </div>
      <p className="text-xs font-mono-data font-medium text-muted-foreground">{fp(country.startingPrice)}</p>
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0 rtl:rotate-180" />
    </button>
  );
}

export default Index;
