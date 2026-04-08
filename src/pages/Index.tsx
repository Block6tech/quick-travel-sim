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
  QA: "middleEast", KW: "middleEast", BH: "middleEast", JO: "middleEast",
  MA: "middleEast", ZA: "middleEast",
  GB: "europe", FR: "europe", DE: "europe", ES: "europe", IT: "europe",
  NL: "europe", CH: "europe", PT: "europe", GR: "europe", PL: "europe",
  SE: "europe", AT: "europe",
  TH: "asiaPacific", JP: "asiaPacific", MY: "asiaPacific", SG: "asiaPacific",
  AU: "asiaPacific", KR: "asiaPacific", ID: "asiaPacific", IN: "asiaPacific",
  VN: "asiaPacific", PH: "asiaPacific", NZ: "asiaPacific",
  US: "americas", CA: "americas", MX: "americas", BR: "americas",
  CO: "americas", AR: "americas", CL: "americas", PE: "americas",
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

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/96599550255"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 end-4 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform btn-press"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
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