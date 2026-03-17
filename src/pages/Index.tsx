import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import CountryCard from "@/components/CountryCard";
import { countries, regionalBundles } from "@/data/esim-data";

const popularCodes = ["AE", "TR", "GB", "US", "TH", "SA"];

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
            {/* Popular */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="space-y-3"
            >
              <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Popular destinations
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {popular.map((c, i) => (
                  <button
                    key={c.code}
                    onClick={() => navigate(`/plans/${c.code}`)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-card shadow-card hover:shadow-card-hover transition-all duration-200 btn-press touch-target"
                  >
                    <div className="w-10 h-10 rounded-md bg-foreground flex items-center justify-center">
                      <span className="text-primary-foreground text-xs font-bold font-mono-data">
                        {c.code}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium truncate max-w-full">
                        {c.name.length > 10 ? c.code : c.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono-data">
                        ${c.startingPrice.toFixed(2)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Regional */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              className="space-y-3"
            >
              <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Regional bundles
              </h2>
              <div className="space-y-2">
                {regionalBundles.map((c, i) => (
                  <CountryCard key={c.code} country={c} delay={i * 30} />
                ))}
              </div>
            </motion.div>

            {/* All Countries */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="space-y-3"
            >
              <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                All destinations
              </h2>
              <div className="space-y-2">
                {countries.map((c, i) => (
                  <CountryCard key={c.code} country={c} delay={i * 20} />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;
