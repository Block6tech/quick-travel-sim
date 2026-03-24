import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Wifi, User, Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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

      {/* Bottom Nav — Modern floating pill */}
      {showNav && (
        <div className="sticky bottom-0 pb-2 px-4 pt-1 pointer-events-none">
          <nav className="pointer-events-auto mx-auto max-w-[360px] bg-foreground/95 backdrop-blur-xl rounded-2xl shadow-lg">
            <div className="flex items-center justify-around h-[60px] px-2">
              <NavItem
                icon={<Search className="w-[22px] h-[22px]" />}
                label={t.navExplore}
                active={location.pathname === "/"}
                onClick={() => navigate("/")}
              />
              <NavItem
                icon={<Wifi className="w-[22px] h-[22px]" />}
                label={t.navMyEsims}
                active={location.pathname === "/dashboard"}
                onClick={() => navigate("/dashboard")}
              />
              <NavItem
                icon={<User className="w-[22px] h-[22px]" />}
                label={t.navAccount}
                active={location.pathname === "/account"}
                onClick={() => navigate("/account")}
              />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center gap-0.5 w-16 h-11 justify-center rounded-xl transition-all duration-300 btn-press ${
      active
        ? "text-primary-foreground bg-primary-foreground/15"
        : "text-primary-foreground/50 hover:text-primary-foreground/75"
    }`}
  >
    <div className={`transition-transform duration-300 ${active ? "scale-110 -translate-y-0.5" : ""}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-semibold tracking-wide transition-all duration-300 ${
      active ? "opacity-100" : "opacity-60"
    }`}>
      {label}
    </span>
    {active && (
      <span className="absolute -bottom-0.5 w-5 h-[3px] rounded-full bg-primary-foreground animate-in fade-in zoom-in-75 duration-300" />
    )}
  </button>
);

export default AppLayout;
