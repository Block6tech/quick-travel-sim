import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Wifi, Eye, EyeOff, Phone } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { EsimPlan } from "@/data/esim-data";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage, getCountryName } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan as EsimPlan | undefined;
  const { formatPrice } = useCurrency();
  const { t, locale } = useLanguage();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!plan) {
    return (
      <AppLayout showBack showNav={false} title={t.checkout}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{t.noPlanSelected}</p>
        </div>
      </AppLayout>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!user) {
      if (!email.trim()) e.email = "Required";
      if (password.length < 6) e.password = t.passwordTooShort;
      if (password !== confirmPassword) e.confirmPassword = t.passwordMismatch;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePurchase = async () => {
    if (!validate()) return;
    setProcessing(true);

    try {
      let currentUser = user;

      // If not logged in, sign up or sign in
      if (!currentUser) {
        // Try sign up first
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { phone: phone.trim() || null } },
        });

        if (signUpError) {
          // If user already exists, try signing in
          if (signUpError.message.includes("already registered") || signUpError.message.includes("already been registered")) {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: email.trim(),
              password,
            });
            if (signInError) {
              toast.error(signInError.message);
              setProcessing(false);
              return;
            }
            currentUser = signInData.user;
          } else {
            toast.error(signUpError.message);
            setProcessing(false);
            return;
          }
        } else {
          currentUser = signUpData.user;
        }
      }

      if (!currentUser) {
        toast.error("Authentication failed");
        setProcessing(false);
        return;
      }

      // Parse data amount for data_total
      const dataNum = parseFloat(plan.data) || 0;
      const validityDays = parseInt(plan.validity) || 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + validityDays);

      // Create order
      const { error: orderError } = await supabase.from("orders").insert({
        user_id: currentUser.id,
        country: plan.country,
        country_code: plan.countryCode,
        plan_data: plan.data,
        plan_validity: plan.validity,
        plan_speed: plan.speed,
        plan_price: plan.price,
        phone_number: phone.trim() || null,
        status: "active",
        data_used: 0,
        data_total: dataNum,
        expires_at: expiresAt.toISOString(),
      });

      if (orderError) {
        toast.error(orderError.message);
        setProcessing(false);
        return;
      }

      navigate("/installation", { state: { plan, email: email || currentUser.email } });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      setProcessing(false);
    }
  };

  const isLoggedIn = !!user;
  const canPurchase = isLoggedIn || (email.trim() && password.length >= 6 && password === confirmPassword);

  return (
    <AppLayout showBack showNav={false} title={t.checkout}>
      <div className="px-4 pt-6 pb-8 space-y-6">
        {/* Order Summary */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }} className="space-y-3">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.orderSummary}</h2>
          <div className="bg-card rounded-lg shadow-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-foreground flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold font-mono-data">{plan.countryCode}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{getCountryName(plan.countryCode, plan.country, locale)}</p>
                <p className="text-xs text-muted-foreground">{plan.data} · {plan.validity} · {plan.speed}</p>
              </div>
              <p className="text-lg font-mono-data font-bold">{formatPrice(plan.price)}</p>
            </div>
          </div>
        </motion.div>

        {/* Account Section */}
        {!isLoggedIn && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }} className="space-y-3">
            <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.createAccount}</h2>
            <div className="space-y-3">
              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all touch-target"
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 pe-12 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all touch-target"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder={t.confirmPasswordPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-12 px-4 pe-12 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all touch-target"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Phone (optional) */}
              <div>
                <div className="relative">
                  <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder={t.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 ps-10 pe-4 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all touch-target"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                  <span>📱</span> {t.phoneHint}
                </p>
              </div>

              <p className="text-[10px] text-muted-foreground text-center">{t.accountExists}</p>
            </div>
          </motion.div>
        )}

        {/* Payment */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }} className="space-y-3">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.payment}</h2>
          <button
            onClick={handlePurchase}
            disabled={!canPurchase || processing}
            className="w-full h-12 bg-foreground text-primary-foreground font-semibold rounded-lg btn-press transition-all duration-200 touch-target text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
          >
            {processing ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                {t.payWithApplePay}
              </>
            )}
          </button>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.orPayWithCard}</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <button
            onClick={handlePurchase}
            disabled={!canPurchase || processing}
            className="w-full h-12 bg-secondary text-secondary-foreground font-medium rounded-lg btn-press transition-all duration-200 touch-target text-sm disabled:opacity-40 disabled:pointer-events-none"
          >
            {processing ? t.creatingAccount : t.payWithCard(formatPrice(plan.price))}
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }} className="flex items-center justify-center gap-4 pt-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span className="text-[10px] uppercase tracking-wider">{t.securePayment}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Wifi className="w-3 h-3" />
            <span className="text-[10px] uppercase tracking-wider">{t.instantDelivery}</span>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Checkout;
