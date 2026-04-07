import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Onboarding from "@/components/Onboarding";
import HeroBanner from "@/components/HeroBanner";
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

const allBundles = regionalBundles;

/** Map each country code to its continent group */
const continentMap: Record<string, string> = {
  AE: "middleEast", SA: "middleEast", EG: "middleEast", TR: "middleEast",
  GB: "europe", FR: "europe", DE: "europe", ES: "europe", IT: "europe",
  TH: "asiaPacific", JP: "asiaPacific", MY: "asiaPacific", SG: "asiaPacific",
  AU: "asiaPacific", KR: "asiaPacific",
  US: "americas"
};

const continentOrder = ["middleEast", "europe", "asiaPacific", "americas"] as const;

function countryFlag(code: string): string {
  if (code.length !== 2) return "";
  const offset = 0x1f1e6 - 65;
  return String.fromCodePoint(code.charCodeAt(0) + offset, code.charCodeAt(1) + offset);
}

const continentEmojis: Record<string, string> = {
  middleEast: "🕌",
  europe: "🏰",
  asiaPacific: "⛩️",
  americas: "🗽"
};

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

  const continentGroups = useMemo(() => {
    return continentOrder.map((key) => ({
      key,
      countries: countries.filter((c) => continentMap[c.code] === key)
    }));
  }, []);

  return (
    <AppLayout>
      <Onboarding />
      <div className="px-4 pt-6 pb-4 space-y-6">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }} className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder={t.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} autoFocus className="w-full h-12 ps-10 pe-10 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all touch-target" />
          {query &&
          <button onClick={() => setQuery("")} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          }
        </motion.div>

        {filtered ?
        <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.resultCount(filtered.length)}</p>
            <div className="space-y-2">
              {filtered.map((c, i) => <CountryCard key={c.code} country={c} delay={i * 30} />)}
              {filtered.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">{t.noResults}</p>}
            </div>
          </div> :

        <>
            <SwipeSection title={t.popularDestinations} delay={0.1}>
              {popular.map((c) =>
            <DestinationChip key={c.code} country={c} formatPrice={formatPrice} />
            )}
            </SwipeSection>

            <SwipeSection title={t.regionalBundles} delay={0.15}>
              {allBundles.map((c) => <BundleCard key={c.code} country={c} formatPrice={formatPrice} />)}
            </SwipeSection>

            {/* All Destinations — Tabs */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }} className="space-y-3">
              <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.allDestinations}</h2>
              <ContinentTabs groups={continentGroups} formatPrice={formatPrice} />
            </motion.div>
          </>
        }
      </div>
    </AppLayout>);

};

function SwipeSection({ title, delay, children }: {title: string;delay: number;children: React.ReactNode;}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalDots, setTotalDots] = useState(1);

  const updateDots = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const itemCount = el.children.length;
    if (itemCount === 0) return;
    const firstChild = el.children[0] as HTMLElement;
    const itemWidth = firstChild.offsetWidth + 8; // gap-2 = 8px
    const visible = Math.max(1, Math.round(el.offsetWidth / itemWidth));
    const dots = Math.max(1, itemCount - visible + 1);
    setTotalDots(dots);
    const scrollProgress = el.scrollLeft / (el.scrollWidth - el.offsetWidth || 1);
    setActiveIndex(Math.min(Math.round(scrollProgress * (dots - 1)), dots - 1));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateDots();
    const onScroll = () => {
      const scrollProgress = el.scrollLeft / (el.scrollWidth - el.offsetWidth || 1);
      setActiveIndex(Math.min(Math.round(scrollProgress * (totalDots - 1)), totalDots - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [totalDots, updateDots]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay, ease: [0.2, 0.8, 0.2, 1] }} className="space-y-2">
      <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{title}</h2>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-5 pt-1 pb-1" style={{ WebkitOverflowScrolling: "touch" }}>{children}</div>
      {totalDots > 1 && (
        <div className="flex justify-center gap-1">
          {Array.from({ length: totalDots }).map((_, i) => (
            <span key={i} className={`block w-1.5 h-1.5 rounded-full transition-colors duration-200 ${i === activeIndex ? "bg-foreground" : "bg-muted-foreground/30"}`} />
          ))}
        </div>
      )}
    </motion.div>);

}

function DestinationChip({ country, formatPrice: fp }: {country: {name: string;code: string;startingPrice: number;};formatPrice: (n: number) => string;}) {
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
    </button>);

}

function BundleCard({ country, formatPrice: fp }: {country: {name: string;code: string;startingPrice: number;planCount: number;};formatPrice: (n: number) => string;}) {
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
    </button>);

}

// Continent tabs for All Destinations section
function ContinentTabs({ groups, formatPrice: fp }: {
  groups: { key: string; countries: { name: string; code: string; startingPrice: number; planCount: number }[] }[];
  formatPrice: (n: number) => string;
}) {
  const [active, setActive] = useState(groups[0]?.key ?? "");
  const navigate = useNavigate();
  const { t, locale } = useLanguage();

  const tabLabels: Record<string, string> = {
    middleEast: t.continents.middleEast,
    europe: t.continents.europe,
    asiaPacific: t.continents.asiaPacific,
    americas: t.continents.americas,
  };

  const activeGroup = groups.find((g) => g.key === active)?.countries ?? [];

  return (
    <div className="space-y-2">
      {/* Tab bar */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
        {groups.map(({ key }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 ${
              active === key
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {tabLabels[key] || key}
          </button>
        ))}
      </div>

      {/* Country list */}
      <div className="rounded-xl bg-card shadow-card overflow-hidden divide-y divide-border/50">
        {activeGroup.map((c) => {
          const flag = countryFlag(c.code);
          const name = getCountryName(c.code, c.name, locale);
          return (
            <button
              key={c.code}
              onClick={() => navigate(`/plans/${c.code}`)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-start hover:bg-accent/50 transition-colors active:bg-accent"
            >
              <span className="text-xl leading-none">{flag}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{name}</p>
              </div>
              <p className="text-xs font-mono-data font-medium text-muted-foreground">{fp(c.startingPrice)}</p>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0 rtl:rotate-180" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Index;