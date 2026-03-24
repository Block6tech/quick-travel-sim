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

      {/* Bottom Nav — Orbital Dock */}
      {showNav && (
        <div className="sticky bottom-0 px-4 pb-5 pt-2 pointer-events-none">
          <nav className="pointer-events-auto relative mx-auto">
            {/* Glassmorphic base bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[58px] bg-card/70 dark:bg-card/80 backdrop-blur-xl rounded-[20px] border border-border/50 shadow-[0_-4px_30px_rgba(0,0,0,0.08),0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_-4px_30px_rgba(0,0,0,0.3),0_8px_40px_rgba(0,0,0,0.4)]" />
            
            <div className="relative flex items-end justify-around px-6 h-[68px]">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="relative flex flex-col items-center btn-press focus:outline-none group"
                    aria-label={item.label}
                  >
                    {/* Floating orb for active state */}
                    <motion.div
                      className="relative flex items-center justify-center"
                      animate={{
                        y: isActive ? -8 : 6,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {/* Glow ring */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <div className="w-[52px] h-[52px] rounded-full bg-foreground shadow-[0_4px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.1)] flex items-center justify-center">
                              {/* Inner pulse ring */}
                              <motion.div
                                className="absolute inset-[2px] rounded-full border-2 border-background/30"
                                animate={{ scale: [1, 1.08, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Icon */}
                      <motion.div
                        className="relative z-10"
                        animate={{
                          scale: isActive ? 1.15 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <Icon
                          strokeWidth={isActive ? 2.5 : 2}
                          className={`w-[22px] h-[22px] transition-colors duration-300 ${
                            isActive
                              ? "text-primary-foreground"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        />
                      </motion.div>
                    </motion.div>

                    {/* Label */}
                    <motion.span
                      className={`text-[10px] font-semibold mt-0.5 transition-colors duration-300 ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                      animate={{
                        y: isActive ? -4 : 2,
                        opacity: isActive ? 1 : 0.6,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {item.label}
                    </motion.span>

                    {/* Active dot indicator */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-[2px] w-1 h-1 rounded-full bg-foreground"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        />
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
