import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Wifi, Eye, EyeOff, Phone, X, ChevronDown, ChevronUp } from "lucide-react";

function countryFlag(code: string): string {
  if (code.length !== 2) return "";
  const offset = 0x1f1e6 - 65;
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => c.charCodeAt(0) + offset));
}
import AppLayout from "@/components/AppLayout";
import { EsimPlan } from "@/data/esim-data";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage, getCountryName } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DiscountCodeInput, { type DiscountResult } from "@/components/DiscountCodeInput";

const TERMS_CONTENT_EN = `Last updated: April 2026

1. ACCEPTANCE OF TERMS
By purchasing and using CamelSim eSIM services, you agree to these Terms & Conditions. If you do not agree, do not use our services.

2. SERVICE DESCRIPTION
CamelSim provides digital eSIM data plans for international travel. Plans are delivered electronically via QR code and activated on compatible devices.

3. ELIGIBILITY
You must have an eSIM-compatible device. You must be at least 18 years old or have parental consent.

4. PRICING & PAYMENT
All prices are displayed in your selected currency. Payment is processed securely. Prices may vary by region and are subject to change.

5. DATA PLANS
Plans provide unlimited data for the selected duration. Fair usage policies may apply. Speed may be reduced after excessive usage as outlined in plan conditions.

6. REFUND POLICY
Unused eSIMs may be refunded within 7 days of purchase. Once data has been consumed, the plan is non-refundable.

7. PRIVACY
We collect only necessary information to provide our services. Your data is protected and never sold to third parties.

8. LIABILITY
CamelSim is not liable for network outages, device compatibility issues, or service interruptions caused by local carriers.

9. CHANGES TO TERMS
We may update these terms at any time. Continued use constitutes acceptance of updated terms.

10. CONTACT
For questions, contact support@camelsim.com.`;

const TERMS_CONTENT_AR = `آخر تحديث: أبريل 2026

1. قبول الشروط
بشرائك واستخدامك لخدمات CamelSim للشرائح الإلكترونية (eSIM)، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق، يرجى عدم استخدام خدماتنا.

2. وصف الخدمة
توفر CamelSim باقات بيانات eSIM رقمية للسفر الدولي. يتم تسليم الباقات إلكترونيًا عبر رمز QR ويتم تفعيلها على الأجهزة المتوافقة.

3. الأهلية
يجب أن يكون لديك جهاز متوافق مع eSIM. يجب أن يكون عمرك 18 عامًا على الأقل أو أن تحصل على موافقة ولي الأمر.

4. الأسعار والدفع
يتم عرض جميع الأسعار بالعملة التي تختارها. تتم معالجة الدفع بشكل آمن. قد تختلف الأسعار حسب المنطقة وهي قابلة للتغيير.

5. باقات البيانات
توفر الباقات بيانات غير محدودة للمدة المحددة. قد تنطبق سياسات الاستخدام العادل. قد يتم تقليل السرعة بعد الاستخدام المفرط كما هو موضح في شروط الباقة.

6. سياسة الاسترداد
يمكن استرداد قيمة الشرائح غير المستخدمة خلال 7 أيام من الشراء. بمجرد استهلاك البيانات، لا يمكن استرداد قيمة الباقة.

7. الخصوصية
نجمع فقط المعلومات الضرورية لتقديم خدماتنا. بياناتك محمية ولا يتم بيعها لأطراف ثالثة.

8. المسؤولية
لا تتحمل CamelSim مسؤولية انقطاع الشبكة أو مشاكل توافق الأجهزة أو انقطاع الخدمة الناجم عن شركات الاتصالات المحلية.

9. تغييرات على الشروط
قد نقوم بتحديث هذه الشروط في أي وقت. يعتبر استمرار الاستخدام موافقة على الشروط المحدثة.

10. التواصل
للأسئلة، تواصل معنا عبر support@camelsim.com.`;

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
  const [discount, setDiscount] = useState<DiscountResult | null>(null);
  const [showPromo, setShowPromo] = useState(false);
  const [wantAccount, setWantAccount] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [showTerms, setShowTerms] = useState(false);

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
    if (!acceptedTerms) e.terms = t.termsRequired;
    if (!user && wantAccount) {
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

      if (!currentUser && wantAccount) {
        // Sign up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { phone: phone.trim() || null } },
        });

        if (signUpError) {
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
      } else if (!currentUser && !wantAccount) {
        // Guest: sign up silently with a random email + password
        const guestEmail = `guest_${crypto.randomUUID()}@camelsim.guest`;
        const guestPassword = crypto.randomUUID();
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: guestEmail,
          password: guestPassword,
          options: { data: { phone: phone.trim() || null, is_guest: true } },
        });

        if (signUpError) {
          toast.error(signUpError.message);
          setProcessing(false);
          return;
        }
        currentUser = signUpData.user;
      }

      if (!currentUser) {
        toast.error("Authentication failed");
        setProcessing(false);
        return;
      }

      const validityDays = plan.days || parseInt(plan.validity) || 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + validityDays);

      const discountAmt = discount
        ? discount.discount_type === "percentage"
          ? (plan.price * discount.discount_value) / 100
          : Math.min(discount.discount_value, plan.price)
        : 0;
      const finalPrice = Math.max(0, plan.price - discountAmt);

      const { data: orderData, error: orderError } = await supabase.from("orders").insert({
        user_id: currentUser.id,
        country: plan.country,
        country_code: plan.countryCode,
        plan_data: plan.data,
        plan_validity: plan.validity,
        plan_speed: plan.speed,
        plan_price: finalPrice,
        phone_number: phone.trim() || null,
        status: "active",
        data_used: 0,
        data_total: 0,
        expires_at: expiresAt.toISOString(),
        discount_code: discount?.code || null,
        discount_amount: discountAmt,
      }).select("id").single();

      if (orderError) {
        toast.error(orderError.message);
        setProcessing(false);
        return;
      }

      if (discount?.source === "referral" && orderData) {
        const { data: refCode } = await supabase
          .from("referral_codes")
          .select("id, referral_count")
          .eq("code", discount.code)
          .single();
        if (refCode) {
          await supabase.from("referral_uses").insert({
            referral_code_id: refCode.id,
            used_by: currentUser!.id,
            order_id: orderData.id,
          } as any);
          await supabase
            .from("referral_codes")
            .update({ referral_count: (refCode.referral_count || 0) + 1 } as any)
            .eq("id", refCode.id);
        }
      }

      navigate("/installation", { state: { plan, email: email || currentUser.email } });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      setProcessing(false);
    }
  };

  const isLoggedIn = !!user;
  const canPurchase = acceptedTerms && (isLoggedIn || !wantAccount || (email.trim() && password.length >= 6 && password === confirmPassword));

  return (
    <AppLayout showBack showNav={false} title={t.checkout}>
      <div className="px-4 pt-6 pb-8 space-y-6">
        {/* Order Summary */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-3">
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.orderSummary}</h2>
          <div className="bg-card rounded-lg shadow-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center">
                <span className="text-xl leading-none">{countryFlag(plan.countryCode)}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{getCountryName(plan.countryCode, plan.country, locale)}</p>
                <p className="text-xs text-muted-foreground">{plan.data === "Unlimited" ? t.unlimited : plan.data} · {t.days(plan.days)} · {plan.speed}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className={`text-lg font-mono-data font-bold ${discount ? "line-through text-muted-foreground text-sm" : ""}`}>{formatPrice(plan.price)}</p>
                {discount && (
                  <p className="text-lg font-mono-data font-bold text-foreground">
                    {formatPrice(Math.max(0, plan.price - (discount.discount_type === "percentage" ? (plan.price * discount.discount_value) / 100 : discount.discount_value)))}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Discount Code */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.03 }}>
          {!showPromo && !discount ? (
            <button
              type="button"
              onClick={() => setShowPromo(true)}
              className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
            >
              {t.havePromoCode}
            </button>
          ) : (
            <DiscountCodeInput planPrice={plan.price} onApply={setDiscount} userId={user?.id} />
          )}
        </motion.div>

        {/* Account Section — only if not logged in */}
        {!isLoggedIn && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className="space-y-3">
            {/* Phone (optional) */}
            <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t.phoneOptional}</h2>
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
              <p className="text-muted-foreground mt-1.5 flex items-center gap-1 font-medium text-sm">
                <span>💬</span> {t.phoneHint}
              </p>
            </div>

            {/* Optional account toggle */}
            <button
              onClick={() => setWantAccount(!wantAccount)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${wantAccount ? "bg-foreground border-foreground" : "border-muted-foreground/40"}`}>
                  {wantAccount && <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div className="text-start">
                  <p className="text-xs font-medium">{t.wantToCreateAccount}</p>
                  <p className="text-[10px] text-muted-foreground">{t.createAccountHint}</p>
                </div>
              </div>
              {wantAccount ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {/* Password fields — only if wants account */}
            <AnimatePresence>
              {wantAccount && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden space-y-3"
                >
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={t.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 px-4 pe-12 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all touch-target"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder={t.confirmPasswordPlaceholder}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 px-4 pe-12 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all touch-target"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Terms & Conditions */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.07 }}>
          <div className="flex items-start gap-2.5">
            <button
              onClick={() => setAcceptedTerms(!acceptedTerms)}
              className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${acceptedTerms ? "bg-foreground border-foreground" : "border-muted-foreground/40"}`}
            >
              {acceptedTerms && <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </button>
            <p className="text-xs text-muted-foreground">
              {t.acceptTerms}{" "}
              <button onClick={() => setShowTerms(true)} className="underline text-foreground font-medium hover:opacity-80">
                {t.termsAndConditions}
              </button>
            </p>
          </div>
          {errors.terms && <p className="text-xs text-destructive mt-1 ms-6">{errors.terms}</p>}
        </motion.div>

        {/* Payment */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="space-y-3">
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
            {processing ? t.creatingAccount : t.payWithCard(formatPrice(
              discount
                ? Math.max(0, plan.price - (discount.discount_type === "percentage" ? (plan.price * discount.discount_value) / 100 : discount.discount_value))
                : plan.price
            ))}
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }} className="flex items-center justify-center gap-4 pt-2">
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

      {/* T&C Modal */}
      <AnimatePresence>
        {showTerms && (
          <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowTerms(false)}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-foreground/40" />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-card rounded-t-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-sm font-bold">{t.termsTitle}</h3>
                <button onClick={() => setShowTerms(false)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">{locale === "ar" ? TERMS_CONTENT_AR : TERMS_CONTENT_EN}</pre>
              </div>
              <div className="p-4 border-t border-border">
                <button
                  onClick={() => { setAcceptedTerms(true); setShowTerms(false); }}
                  className="w-full h-10 bg-foreground text-primary-foreground font-medium rounded-lg btn-press text-sm touch-target"
                >
                  {t.acceptTerms} {t.termsAndConditions}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default Checkout;
