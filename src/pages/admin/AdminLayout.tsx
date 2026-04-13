import { useEffect, useState } from "react";
import { useNavigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { BarChart3, ShoppingBag, Users, Tag, Gift, ArrowLeft, Smartphone, Image, FileText, Settings, Menu, X } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

const navItems = [
  { to: "/admin", icon: BarChart3, label: "Dashboard", end: true },
  { to: "/admin/banners", icon: Image, label: "Banners" },
  { to: "/admin/esim", icon: Smartphone, label: "eSIM Management" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/discounts", icon: Tag, label: "Discounts" },
  { to: "/admin/referrals", icon: Gift, label: "Referrals" },
  { to: "/admin/terms", icon: FileText, label: "Terms & Conditions" },
  { to: "/admin/settings", icon: Settings, label: "Program Settings" },
];

export default function AdminLayout() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

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

  const currentLabel = navItems.find(
    (item) => item.end ? location.pathname === item.to : location.pathname.startsWith(item.to) && item.to !== "/admin"
  )?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 start-0 z-50 w-56 border-e border-border bg-card flex flex-col
          transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="CamelSim" className="w-6 h-6 dark:hidden" />
            <img src="/logo-dark.png" alt="CamelSim" className="w-6 h-6 hidden dark:block" />
            <h1 className="text-sm font-bold tracking-display">CamelSim Admin</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-md hover:bg-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${
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
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-md hover:bg-secondary">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold">{currentLabel}</h1>
        </div>
        <div className="max-w-5xl mx-auto p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
