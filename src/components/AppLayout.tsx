import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Wifi, User } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showNav?: boolean;
}

const AppLayout = ({ children, title, showBack = false, showNav = true }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

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
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center">
                <Wifi className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-display">simlink</span>
            </div>
          )}
          {title && (
            <h1 className="text-sm font-semibold absolute left-1/2 -translate-x-1/2">{title}</h1>
          )}
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Nav */}
      {showNav && (
        <nav className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="flex items-center justify-around h-14">
            <NavItem
              icon={<Search className="w-5 h-5" />}
              label="Explore"
              active={location.pathname === "/"}
              onClick={() => navigate("/")}
            />
            <NavItem
              icon={<Wifi className="w-5 h-5" />}
              label="My eSIMs"
              active={location.pathname === "/dashboard"}
              onClick={() => navigate("/dashboard")}
            />
            <NavItem
              icon={<User className="w-5 h-5" />}
              label="Account"
              active={location.pathname === "/account"}
              onClick={() => navigate("/account")}
            />
          </div>
        </nav>
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
    className={`flex flex-col items-center gap-0.5 touch-target justify-center btn-press ${
      active ? "text-foreground" : "text-text-tertiary"
    }`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default AppLayout;
