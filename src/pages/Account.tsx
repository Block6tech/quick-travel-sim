import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Wifi, ShoppingBag, CreditCard, HelpCircle, Settings,
  ChevronRight, ChevronLeft, LogOut, Bell, Globe, DollarSign,
  MessageCircle, BookOpen, Smartphone, Phone, Plus,
  Shield, Moon, Sun,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Switch } from "@/components/ui/switch";
import TierProgress from "@/components/TierProgress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sampleActiveEsims, sampleOrders, getUserTier, type ActiveEsim,
} from "@/data/esim-data";
import { useCurrency, currencies } from "@/contexts/CurrencyContext";
import { useLanguage, getCountryName } from "@/contexts/LanguageContext";

function flag(code: string) {
  if (code.length !== 2) return "";
  const o = 0x1f1e6 - 65;
  return String.fromCodePoint(code.charCodeAt(0) + o, code.charCodeAt(1) + o);
}

const anim = (d = 0) => ({
  initial: { opacity: 0, y: 8 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.3, delay: d, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] },
});

const Account = () => {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const { t, locale, setLocale, isRTL } = useLanguage();
  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const { currency, setCurrencyByCode, formatPrice } = useCurrency();
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const user = { name: "Ali M.", email: "ali@example.com", verified: true, phone: "" };
  const tier = getUserTier(sampleOrders.length);
  const esims = sampleActiveEsims;
  const orders = sampleOrders;

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-8 space-y-6">
        {/* Identity */}
        <motion.div {...anim(0)} className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-3xl">{tier.emoji}</div>
            {user.verified && (
              <div className="absolute -bottom-0.5 -end-0.5 w-5 h-5 rounded-full bg-foreground flex items-center justify-center">
                <Shield className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-display truncate">{user.name}</h1>
              {user.verified && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-foreground text-primary-foreground rounded-sm">{t.verified}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-secondary text-secondary-foreground">
              {tier.name} {t.tier}
            </span>
          </div>
        </motion.div>

        {/* Phone prompt */}
        {!user.phone && (
          <motion.button {...anim(0.04)} className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary text-start btn-press touch-target">
            <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium">{t.addPhoneNumber}</p>
              <p className="text-[10px] text-muted-foreground">{t.addPhoneDesc}</p>
            </div>
            <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </motion.button>
        )}

        {/* Tier Progress */}
        <motion.div {...anim(0.06)}>
          <TierProgress orderCount={orders.length} />
        </motion.div>

        {/* My eSIMs */}
        <Section title={t.myEsimsSection} icon={<Wifi className="w-4 h-4" />} delay={0.08}>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="active" className="flex-1 text-xs">{t.activeTab}</TabsTrigger>
              <TabsTrigger value="expired" className="flex-1 text-xs">{t.expiredTab}</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <EsimList esims={esims.filter(e => e.status === "active")} navigate={navigate} />
            </TabsContent>
            <TabsContent value="expired">
              <EsimList esims={esims.filter(e => e.status === "expired")} navigate={navigate} />
            </TabsContent>
          </Tabs>
        </Section>

        {/* Orders */}
        <Section title={t.purchaseHistory} icon={<ShoppingBag className="w-4 h-4" />} delay={0.12}>
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center gap-3 p-3 rounded-lg bg-card shadow-card">
                <span className="text-lg leading-none">{flag(o.countryCode)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{getCountryName(o.countryCode, o.country, locale)} — {o.planSize}</p>
                  <p className="text-[10px] text-muted-foreground font-mono-data">{o.orderNumber} · {o.date}</p>
                </div>
                <span className="text-xs font-bold font-mono-data">{formatPrice(o.price)}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Payments */}
        <Section title={t.payments} icon={<CreditCard className="w-4 h-4" />} delay={0.16}>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card shadow-card">
              <div className="w-9 h-9 rounded-md bg-foreground flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">•••• 4242</p>
                <p className="text-[10px] text-muted-foreground">{t.expiresDate}</p>
              </div>
              <button className="text-[10px] text-destructive font-medium btn-press">{t.remove}</button>
            </div>
            <button className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-dashed border-border text-xs font-medium text-muted-foreground hover:text-foreground btn-press touch-target">
              <Plus className="w-3.5 h-3.5" /> {t.addPaymentMethod}
            </button>
          </div>
        </Section>

        {/* Support */}
        <Section title={t.support} icon={<HelpCircle className="w-4 h-4" />} delay={0.2}>
          <div className="space-y-1">
            <SupportRow icon={<HelpCircle className="w-4 h-4" />} label={t.helpCenter} chevron={Chevron} />
            <SupportRow icon={<MessageCircle className="w-4 h-4" />} label={t.contactSupport} chevron={Chevron} />
            <SupportRow icon={<BookOpen className="w-4 h-4" />} label={t.installationGuide} onClick={() => navigate("/installation")} chevron={Chevron} />
            <SupportRow icon={<Smartphone className="w-4 h-4" />} label={t.deviceCompatibility} chevron={Chevron} />
          </div>
        </Section>

        {/* Settings */}
        <Section title={t.settings} icon={<Settings className="w-4 h-4" />} delay={0.24}>
          <div className="space-y-1">
            {/* Language */}
            <button
              onClick={() => setLocale(locale === "en" ? "ar" : "en")}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors btn-press touch-target"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium">{t.language}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">{t.languageValue}</span>
                <Chevron className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>

            {/* Currency */}
            <div className="relative">
              <button
                onClick={() => setShowCurrencyPicker(!showCurrencyPicker)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors btn-press touch-target"
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium">{t.currency}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">{currency.symbol} {currency.code}</span>
                  <Chevron className={`w-4 h-4 text-muted-foreground transition-transform ${showCurrencyPicker ? (isRTL ? "-rotate-90" : "rotate-90") : ""}`} />
                </div>
              </button>
              {showCurrencyPicker && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden">
                  <div className="max-h-48 overflow-y-auto rounded-lg bg-secondary/50 mx-3 mb-2">
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => { setCurrencyByCode(c.code); setShowCurrencyPicker(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-xs hover:bg-secondary transition-colors ${c.code === currency.code ? "font-bold" : ""}`}
                      >
                        <span>{c.symbol} {c.name}</span>
                        <span className="text-muted-foreground font-mono-data">{c.code}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
                <span className="text-xs font-medium">{t.darkMode}</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium">{t.notifications}</span>
              </div>
              <Switch checked={notifs} onCheckedChange={setNotifs} />
            </div>

            {/* Log out */}
            <button className="w-full flex items-center gap-3 p-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors btn-press touch-target">
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-medium">{t.logOut}</span>
            </button>
          </div>
        </Section>
      </div>
    </AppLayout>
  );
};

/* ─── Helpers ─── */

function Section({ title, icon, delay, children }: { title: string; icon: React.ReactNode; delay: number; children: React.ReactNode }) {
  return (
    <motion.div {...anim(delay)} className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h2 className="text-xs uppercase tracking-wider font-medium text-muted-foreground">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function EsimList({ esims, navigate }: { esims: ActiveEsim[]; navigate: (p: string) => void }) {
  const { t } = useLanguage();
  if (esims.length === 0) {
    return (
      <div className="text-center py-8 space-y-2">
        <p className="text-xs text-muted-foreground">{t.noEsimsHere}</p>
        <button onClick={() => navigate("/")} className="text-xs font-medium underline underline-offset-2 btn-press">{t.browsePlansLink}</button>
      </div>
    );
  }
  return (
    <div className="space-y-2 mt-2">
      {esims.map((esim) => {
        const pct = (esim.dataUsed / esim.dataTotal) * 100;
        const remaining = esim.dataTotal - esim.dataUsed;
        const daysLeft = Math.max(0, Math.ceil((new Date(esim.expiresAt).getTime() - Date.now()) / 864e5));
        return (
          <div key={esim.id} className="p-3 rounded-lg bg-card shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg leading-none">{flag(esim.countryCode)}</span>
                <div>
                  <p className="text-xs font-medium">{esim.country}</p>
                  <p className="text-[10px] text-muted-foreground font-mono-data">{esim.plan}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-sm ${
                esim.status === "active" ? "bg-foreground text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}>{esim.status === "active" ? t.active : t.expired}</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono-data">
                <span>{t.gbRemaining(remaining.toFixed(1))}</span>
                <span>{t.dRemaining(daysLeft)}</span>
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className="flex gap-2">
              {esim.status === "active" && (
                <button onClick={() => navigate("/")} className="flex-1 h-8 bg-foreground text-primary-foreground font-medium rounded-md btn-press text-[11px] touch-target">
                  {t.topUp}
                </button>
              )}
              <button className="h-8 px-3 bg-secondary text-secondary-foreground font-medium rounded-md btn-press text-[11px] touch-target">
                {t.detailsBtn}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SupportRow({ icon, label, onClick, chevron: Chevron }: { icon: React.ReactNode; label: string; onClick?: () => void; chevron: typeof ChevronRight }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors btn-press touch-target">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <Chevron className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}

export default Account;
