import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Wifi, User, Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
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

  const toggleLang = () => setLocale(locale === "en" ? "ar" : "en");

  const navItems = [
    { icon: Search, label: t.navExplore, path: "/" },
    { icon: Wifi, label: t.navMyEsims, path: "/dashboard" },
    { icon: User, label: t.navAccount, path: "/account" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[480px] mx-auto">
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
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="CamelSim" className="w-7 h-7 dark:hidden" />
              <img src="/logo-dark.png" alt="CamelSim" className="w-7 h-7 hidden dark:block" />
              <span className="text-lg font-bold tracking-display">{t.appName}</span>
            </div>
          )}
          {title && (
            <h1 className="text-sm font-semibold absolute left-1/2 -translate-x-1/2">{title}</h1>
          )}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-accent/50 transition-colors btn-press touch-target"
            aria-label="Switch language"
          >
            <Languages className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">{locale === "en" ? "عربي" : "EN"}</span>
          </button>
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

            <div className="relative flex items-center h-[56px]">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="relative flex-1 flex items-center justify-center h-full btn-press focus:outline-none"
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

                    <div className="relative z-10 flex items-center gap-2">
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

                      <AnimatePresence mode="popLayout">
                        {isActive && (
                          <motion.span
                            key={item.path}
                            className="text-[11px] font-bold text-primary-foreground tracking-wide uppercase"
                            initial={{ width: 0, opacity: 0, filter: "blur(4px)" }}
                            animate={{ width: "auto", opacity: 1, filter: "blur(0px)" }}
                            exit={{ width: 0, opacity: 0, filter: "blur(4px)" }}
                            transition={{ type: "spring", stiffness: 400, damping: 28 }}
                            style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Top edge glow for active */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-glow"
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-primary-foreground/60"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.nav>
        </div>
      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
