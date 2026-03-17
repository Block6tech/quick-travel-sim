import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Globe, Earth, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import CountryCard from "@/components/CountryCard";
import { countries, regionalBundles } from "@/data/esim-data";

const popularCodes = ["AE", "TR", "GB", "US", "TH", "SA"];

const globalBundles = [
  { name: "Global", code: "GL", startingPrice: 15, planCount: 4 },
  { name: "Global Plus", code: "GP", startingPrice: 25, planCount: 3 },
];

const regionOnly = regionalBundles.filter((b) => b.code !== "GL");

/** Convert ISO 3166-1 alpha-2 to flag emoji */
function countryFlag(code: string): string {
  if (code.length !== 2) return "";
  const offset = 0x1f1e6 - 65; // 'A' = 65
  return String.fromCodePoint(
    code.charCodeAt(0) + offset,
    code.charCodeAt(1) + offset
  );
}

/** Continent / region icons (black & white, distinct per region) */
const regionIcons: Record<string, React.ReactNode> = {
  /* Europe – EU stars circle */
  EU: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2l.9 2.8H16l-2.5 1.8.9 2.8L12 7.6l-2.4 1.8.9-2.8L8 4.8h3.1z" opacity=".6"/>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 6l.45 1.4h1.47l-1.19.86.46 1.4L12 8.8l-1.19.86.46-1.4-1.19-.86h1.47zM7.5 8.5l.45 1.4h1.47l-1.19.86.46 1.4-1.19-.86-1.19.86.46-1.4-1.19-.86h1.47zM16.5 8.5l.45 1.4h1.47l-1.19.86.46 1.4-1.19-.86-1.19.86.46-1.4-1.19-.86h1.47zM5.5 13l.45 1.4h1.47l-1.19.86.46 1.4L5.5 15.8l-1.19.86.46-1.4-1.19-.86h1.47zM18.5 13l.45 1.4h1.47l-1.19.86.46 1.4-1.19-.86-1.19.86.46-1.4-1.19-.86h1.47zM7.5 17l.45 1.4h1.47l-1.19.86.46 1.4-1.19-.86-1.19.86.46-1.4-1.19-.86h1.47zM16.5 17l.45 1.4h1.47l-1.19.86.46 1.4-1.19-.86-1.19.86.46-1.4-1.19-.86h1.47zM12 18.5l.45 1.4h1.47l-1.19.86.46 1.4L12 21.3l-1.19.86.46-1.4-1.19-.86h1.47z" opacity=".35" />
    </svg>
  ),
  /* Asia – pagoda / temple silhouette */
  AS: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2v1M12 3C10 5 8 6 8 8h8c0-2-2-3-4-5z"/>
      <path d="M7 8c-1 1-2 2-2 3h14c0-1-1-2-2-3"/>
      <path d="M5 11c-1 1-1.5 2-1.5 3H20.5c0-1-.5-2-1.5-3"/>
      <path d="M3.5 14v1h17v-1"/>
      <rect x="9" y="15" width="6" height="7" rx="0.5"/>
      <line x1="12" y1="15" x2="12" y2="22"/>
      <line x1="6" y1="22" x2="18" y2="22"/>
    </svg>
  ),
  /* Middle East – crescent & star */
  ME: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M15 4a8 8 0 1 0 0 16 6 6 0 0 1 0-16z"/>
      <path d="M17.5 8l.6 1.9h2l-1.6 1.2.6 1.9-1.6-1.2-1.6 1.2.6-1.9-1.6-1.2h2z" fill="currentColor" stroke="none"/>
    </svg>
  ),
  /* Global – full globe with grid lines */
  GL: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>
      <path d="M4.63 5h14.74M4.63 19h14.74"/>
    </svg>
  ),
  GP: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>
      <path d="M4.63 5h14.74M4.63 19h14.74"/>
    </svg>
  ),
};

const Index = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const popular = useMemo(
    () => countries.filter((c) => popularCodes.includes(c.code)),
    []
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <h1 className="text-2xl font-bold tracking-display">
            Stay connected,
            <br />
            anywhere you go.
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-body">
            Instant eSIM activation. No roaming fees.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Where are you going?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full h-12 pl-10 pr-10 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all touch-target"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>

        {/* Search Results */}
        {filtered ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-2">
              {filtered.map((c, i) => (
                <CountryCard key={c.code} country={c} delay={i * 30} />
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No destinations found. Try a different search.
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Popular — horizontal swipe */}
            <SwipeSection title="Popular destinations" delay={0.1}>
              {popular.map((c) => (
                <DestinationChip key={c.code} country={c} />
              ))}
            </SwipeSection>

            {/* Regional Bundles — horizontal swipe */}
            <SwipeSection title="Regional bundles" delay={0.15}>
              {regionOnly.map((c) => (
                <BundleCard key={c.code} country={c} icon={regionIcons[c.code] || regionIcons.EU} />
              ))}
            </SwipeSection>

            {/* Global Bundles — horizontal swipe */}
            <SwipeSection title="Global bundles" delay={0.2}>
              {globalBundles.map((c) => (
                <BundleCard key={c.code} country={c} icon={regionIcons[c.code] || regionIcons.GL} />
              ))}
            </SwipeSection>

            {/* All Countries — compact grid */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              className="space-y-3"
            >
              <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                All destinations
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {countries.map((c) => (
                  <CompactCountryCard key={c.code} country={c} />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

/* ── Swipeable horizontal section ── */
function SwipeSection({
  title,
  delay,
  children,
}: {
  title: string;
  delay: number;
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="space-y-3"
    >
      <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
        {title}
      </h2>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 pb-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>
    </motion.div>
  );
}

/* ── Popular destination chip with flag emoji ── */
function DestinationChip({
  country,
}: {
  country: { name: string; code: string; startingPrice: number };
}) {
  const navigate = useNavigate();
  const flag = countryFlag(country.code);

  return (
    <button
      onClick={() => navigate(`/plans/${country.code}`)}
      className="flex-shrink-0 snap-start flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-card shadow-card hover:shadow-card-hover transition-all duration-200 btn-press touch-target"
    >
      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
        <span className="text-lg leading-none">{flag}</span>
      </div>
      <div className="text-left whitespace-nowrap">
        <p className="text-xs font-medium">{country.name}</p>
        <p className="text-[10px] text-muted-foreground font-mono-data">
          from ${country.startingPrice.toFixed(2)}
        </p>
      </div>
    </button>
  );
}

/* ── Bundle card with continent/globe B&W icon ── */
function BundleCard({
  country,
  icon,
}: {
  country: { name: string; code: string; startingPrice: number; planCount: number };
  icon: React.ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/plans/${country.code}`)}
      className="flex-shrink-0 snap-start w-40 p-4 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-200 btn-press text-left touch-target"
    >
      <div className="w-10 h-10 rounded-lg bg-secondary text-foreground flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-sm font-medium">{country.name}</p>
      <div className="flex items-baseline justify-between mt-1">
        <p className="text-xs text-muted-foreground">{country.planCount} plans</p>
        <p className="text-xs font-mono-data font-medium">
          ${country.startingPrice.toFixed(2)}
        </p>
      </div>
    </button>
  );
}

/* ── Compact country card with flag for "All destinations" grid ── */
function CompactCountryCard({
  country,
}: {
  country: { name: string; code: string; startingPrice: number };
}) {
  const navigate = useNavigate();
  const flag = countryFlag(country.code);

  return (
    <button
      onClick={() => navigate(`/plans/${country.code}`)}
      className="flex items-center gap-2 p-2.5 rounded-lg bg-card shadow-card hover:shadow-card-hover transition-all duration-200 btn-press text-left touch-target"
    >
      <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
        <span className="text-base leading-none">{flag}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium truncate">{country.name}</p>
        <p className="text-[10px] text-muted-foreground font-mono-data">
          ${country.startingPrice.toFixed(2)}
        </p>
      </div>
    </button>
  );
}

export default Index;
