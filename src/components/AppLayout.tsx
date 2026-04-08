import { ReactNode, useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Wifi, User, Languages, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency, currencies } from "@/contexts/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showNav?: boolean;
}

const AppLayout = ({ children, title, showBack = false, showNav = true }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, isRTL, locale, setLocale } = useLanguage();
  const { currency, setCurrencyByCode } = useCurrency();
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);

  const toggleLang = () => setLocale(locale === "en" ? "ar" : "en");

  // Close currency picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setShowCurrencyPicker(false);
      }
    };
    if (showCurrencyPicker) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showCurrencyPicker]);

  const navItems = [
    { icon: Search, label: t.navExplore, path: "/" },
    { icon: Wifi, label: t.navMyEsims, path: "/dashboard" },
    { icon: User, label: t.navAccount, path: "/account" },
  ];

  const isCheckout = location.pathname.startsWith("/checkout");

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[480px] mx-auto">

      {/* WhatsApp floating button — hidden on checkout */}
      {!isCheckout && (
        <motion.a
          href="https://wa.me/96599550255"
          target="_blank"
          rel="noopener noreferrer"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="fixed bottom-24 end-4 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform btn-press"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </motion.a>
      )}
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="touch-target flex items-center justify-center btn-press"
              aria-label="Go back"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-foreground">
                <path d={isRTL ? "M9 18L15 12L9 6" : "M15 18L9 12L15 6"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ) : (
            <button onClick={() => navigate("/")} className="flex items-center gap-2 btn-press">
              <img src="/logo.png" alt="CamelSim" className="w-7 h-7 dark:hidden" />
              <img src="/logo-dark.png" alt="CamelSim" className="w-7 h-7 hidden dark:block" />
              <span className="text-lg font-bold tracking-display">{t.appName}</span>
            </button>
          )}
          {title && (
            <h1 className="text-sm font-semibold absolute left-1/2 -translate-x-1/2">{title}</h1>
          )}
          <div className="flex items-center gap-1">
            {/* Currency selector */}
            <div ref={currencyRef} className="relative">
              <button
                onClick={() => setShowCurrencyPicker(!showCurrencyPicker)}
                className="flex items-center gap-0.5 px-2 py-1 rounded-md hover:bg-accent/50 transition-colors btn-press touch-target"
                aria-label="Select currency"
              >
<svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {/* Euro circle */}
                    <circle cx="8" cy="12" r="6" />
                    <text x="4.5" y="16" fontSize="11" fontWeight="bold" strokeWidth="0" fill="currentColor">€</text>
                    {/* Dollar circle */}
                    <circle cx="16" cy="12" r="6" />
                    <text x="12.8" y="16" fontSize="11" fontWeight="bold" strokeWidth="0" fill="currentColor">$</text>
                    {/* Exchange arrows */}
                    <path d="M14 6l2-2 2 2" strokeWidth="1.5" />
                    <path d="M10 18l-2 2-2-2" strokeWidth="1.5" />
                  </svg>
                <span className="text-xs font-medium text-muted-foreground">{currency.code}</span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${showCurrencyPicker ? "rotate-180" : ""}`} />
              </button>
              {showCurrencyPicker && (
                <div className="absolute end-0 top-full mt-1 w-48 rounded-lg bg-card shadow-lg border border-border z-50 overflow-hidden">
                  <div className="max-h-56 overflow-y-auto">
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => { setCurrencyByCode(c.code); setShowCurrencyPicker(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-accent/50 transition-colors ${c.code === currency.code ? "font-bold bg-accent/30" : ""}`}
                      >
                        <span>{c.symbol} {c.name}</span>
                        <span className="text-muted-foreground font-mono-data">{c.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-accent/50 transition-colors btn-press touch-target"
              aria-label="Switch language"
            >
              <Languages className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">{locale === "en" ? "عربي" : "EN"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Nav — Morphing Island */}
      {showNav && (
        <div className="sticky bottom-0 px-5 pb-5 pt-2 pointer-events-none">
          <motion.nav
            className="pointer-events-auto mx-auto relative overflow-hidden rounded-2xl bg-foreground"
            style={{ boxShadow: "0 10px 50px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)" }}
            layout
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          >
            {/* Ambient gradient sweep */}
            <motion.div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                background: "linear-gradient(105deg, transparent 40%, hsl(var(--primary-foreground)) 50%, transparent 60%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative flex items-center h-[60px]">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="relative flex-1 flex flex-col items-center justify-center gap-1 h-full btn-press focus:outline-none"
                    aria-label={item.label}
                  >
                    {/* Active background pill */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-bg"
                        className="absolute inset-y-[6px] inset-x-[6px] rounded-xl bg-primary-foreground/15"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}

                    <div className="relative z-10 flex-col gap-1 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: isActive ? [0, -8, 8, 0] : 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <Icon
                          strokeWidth={isActive ? 2.5 : 1.8}
                          className={`w-5 h-5 transition-colors duration-200 ${
                            isActive ? "text-primary-foreground" : "text-primary-foreground/40"
                          }`}
                        />
                      </motion.div>

                      <span
                        className={`text-[14px] font-semibold transition-colors duration-200 ${
                          isActive ? "text-primary-foreground" : "text-primary-foreground/40"
                        }`}
                      >
                        {item.label}
                      </span>

                      {/* Indicator dot row — keeps space consistent */}
                      <div className="h-[3px] flex items-center justify-center">
                        {isActive && (
                          <motion.div
                            layoutId="nav-glow"
                            className="w-5 h-[2.5px] rounded-full bg-primary-foreground/70"
                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
                          />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.nav>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
