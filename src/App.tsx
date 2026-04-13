import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import SplashScreen from "@/components/SplashScreen";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import CountryPlans from "./pages/CountryPlans.tsx";
import PlanDetails from "./pages/PlanDetails.tsx";
import Checkout from "./pages/Checkout.tsx";
import Installation from "./pages/Installation.tsx";
import AddEsim from "./pages/AddEsim.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Account from "./pages/Account.tsx";
import Auth from "./pages/Auth.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import HelpCenter from "./pages/HelpCenter.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminOrders from "./pages/admin/AdminOrders.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminDiscounts from "./pages/admin/AdminDiscounts.tsx";
import AdminReferrals from "./pages/admin/AdminReferrals.tsx";
import AdminEsimManagement from "./pages/admin/AdminEsimManagement.tsx";
import AdminBanners from "./pages/admin/AdminBanners.tsx";
import AdminTerms from "./pages/admin/AdminTerms.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <TooltipProvider>
            <SplashScreen visible={showSplash} />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/plans/:code" element={<CountryPlans />} />
                <Route path="/plan/:id" element={<PlanDetails />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/installation" element={<Installation />} />
                <Route path="/add-esim" element={<AddEsim />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/account" element={<Account />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="banners" element={<AdminBanners />} />
                  <Route path="esim" element={<AdminEsimManagement />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="discounts" element={<AdminDiscounts />} />
                  <Route path="referrals" element={<AdminReferrals />} />
                  <Route path="terms" element={<AdminTerms />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
