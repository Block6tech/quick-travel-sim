import { useEffect } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { BarChart3, ShoppingBag, Users, Tag, Gift, LogOut, ArrowLeft, Smartphone } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

const navItems = [
  { to: "/admin", icon: BarChart3, label: "Dashboard", end: true },
  { to: "/admin/esim", icon: SimCard, label: "eSIM Management" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/discounts", icon: Tag, label: "Discounts" },
  { to: "/admin/referrals", icon: Gift, label: "Referrals" },
];

export default function AdminLayout() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/");
  }, [loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 border-e border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <img src="/logo.png" alt="CamelSim" className="w-6 h-6 dark:hidden" />
          <img src="/logo-dark.png" alt="CamelSim" className="w-6 h-6 hidden dark:block" />
          <h1 className="text-sm font-bold tracking-display">CamelSim Admin</h1>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-foreground text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-2 border-t border-border space-y-0.5">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
