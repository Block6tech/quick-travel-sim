import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type Locale = "en" | "ar";

const translations = {
  en: {
    // App
    appName: "CamelSim",

    // Nav
    navExplore: "Explore",
    navMyEsims: "My eSIMs",
    navAccount: "Account",

    // Index
    heroTitle: "Stay connected,\nanywhere you go.",
    heroSubtitle: "Instant eSIM activation. No roaming fees.",
    searchPlaceholder: "Where are you going?",
    resultCount: (n: number) => `${n} result${n !== 1 ? "s" : ""}`,
    noResults: "No destinations found. Try a different search.",
    popularDestinations: "Popular destinations",
    regionalBundles: "Regional bundles",
    globalBundles: "Global bundles",
    allDestinations: "All destinations",
    from: "from",
    plans: (n: number) => `${n} plans`,

    // CountryPlans
    dataFor: (name: string) => `Data for ${name}`,
    instantActivation: "Instant activation · No roaming fees",
    notFound: "Not Found",
    destinationNotFound: "Destination not found.",

    // PlanCard
    bestValue: "Best Value",
    popular: "Popular",
    hotspot: "Hotspot",
    noHotspot: "No hotspot",

    // PlanDetails
    plan: "Plan",
    planNotFound: "Plan not found.",
    details: "Details",
    speed: "Speed",
    hotspotLabel: "Hotspot",
    supported: "Supported",
    notSupported: "Not supported",
    type: "Type",
    esimDigital: "eSIM (Digital)",
    worksOn: "Works on",
    worksInstantly: "Works instantly when you land",
    worksInstantlyDesc: "Turn on data roaming and you're connected. No physical SIM swap needed.",
    commonQuestions: "Common questions",
    faqQ1: "Will it work when I land?",
    faqA1: "Yes. Your eSIM activates instantly once connected to a local network. Just turn on data roaming in your settings.",
    faqQ2: "Can I share data via hotspot?",
    faqA2Yes: "Yes, hotspot / tethering is fully supported with this plan.",
    faqA2No: "No, this plan does not support hotspot.",
    faqQ3: "What if I run out of data?",
    faqA3: "You can buy a top-up at any time from your dashboard. Your number stays the same.",
    buyNow: "Buy Now",

    // Checkout
    checkout: "Checkout",
    noPlanSelected: "No plan selected.",
    orderSummary: "Order summary",
    emailForReceipt: "Email for receipt",
    emailPlaceholder: "you@example.com",
    payment: "Payment",
    payWithApplePay: "Pay with Apple Pay",
    orPayWithCard: "or pay with card",
    payWithCard: (price: string) => `Pay ${price} with Card`,
    securePayment: "Secure payment",
    instantDelivery: "Instant delivery",

    // Installation
    purchaseComplete: "Purchase complete!",
    esimReady: (country: string) => `Your eSIM for ${country} is ready to install.\nIt takes about 2 minutes.`,
    scanWithCamera: "Scan with your phone camera",
    orEnterManually: "Or enter manually",
    smdpAddress: "SM-DP+ Address",
    activationCode: "Activation Code",
    installIn2Min: "Install in 2 minutes",
    step1Title: "Open Settings",
    step1Desc: "Go to Settings → Cellular → Add eSIM",
    step2Title: "Scan QR Code",
    step2Desc: "Point your camera at the QR code below",
    step3Title: "Confirm & Activate",
    step3Desc: "Tap 'Add Cellular Plan' when prompted",
    step4Title: "Turn on Data Roaming",
    step4Desc: "Settings → Cellular → your new plan → Data Roaming → On",
    watchHowToInstall: "Watch how to install",
    goToMyEsims: "Go to My eSIMs",

    // Dashboard
    myEsims: "My eSIMs",
    noEsimsYet: "No eSIMs yet",
    buyFirstEsim: "Buy your first eSIM and it will appear here.",
    browsePlans: "Browse Plans",
    gbLeft: "GB left",
    daysRemaining: (n: number) => `${n} days remaining`,
    gbUsed: (used: string, total: number) => `${used} GB of ${total} GB used`,
    topUp: "Top Up",
    detailsBtn: "Details",
    active: "active",
    expired: "expired",

    // Account
    verified: "Verified",
    tier: "Tier",
    addPhoneNumber: "Add phone number",
    addPhoneDesc: "Receive eSIM notifications via WhatsApp",
    myEsimsSection: "My eSIMs",
    activeTab: "Active",
    expiredTab: "Expired",
    noEsimsHere: "No eSIMs here.",
    browsePlansLink: "Browse plans",
    purchaseHistory: "Purchase History",
    payments: "Payments",
    expiresDate: "Expires 12/27",
    remove: "Remove",
    addPaymentMethod: "Add payment method",
    support: "Support",
    helpCenter: "Help Center",
    contactSupport: "Contact Support (WhatsApp)",
    installationGuide: "Installation Guide",
    deviceCompatibility: "Device Compatibility",
    settings: "Settings",
    language: "Language",
    languageValue: "English",
    currency: "Currency",
    darkMode: "Dark Mode",
    notifications: "Notifications",
    logOut: "Log out",

    // TierProgress
    tierName: (name: string) => `${name} Tier`,
    ordersTo: (n: number, name: string) => `${n} order${n !== 1 ? "s" : ""} to ${name}`,
    maxTier: "Max tier reached — enjoy all perks!",
    unlockAt: (name: string) => `Unlock at ${name}`,
    yourPerks: "Your perks",
    orders: (n: number) => `${n}+ orders`,
    off: (n: number) => `${n}% off`,

    // NotFound
    notFoundTitle: "404",
    notFoundMsg: "Oops! Page not found",
    returnHome: "Return to Home",

    // Data labels
    gbRemaining: (n: string) => `${n} GB left`,
    dRemaining: (n: number) => `${n}d remaining`,
  },

  ar: {
    appName: "كاميل سيم",

    navExplore: "استكشف",
    navMyEsims: "شرائحي",
    navAccount: "حسابي",

    heroTitle: "ابقَ متصلاً،\nأينما ذهبت.",
    heroSubtitle: "تفعيل فوري لشريحة eSIM. بدون رسوم تجوال.",
    searchPlaceholder: "إلى أين أنت ذاهب؟",
    resultCount: (n: number) => `${n} نتيجة`,
    noResults: "لم يتم العثور على وجهات. جرّب بحثاً مختلفاً.",
    popularDestinations: "الوجهات الشائعة",
    regionalBundles: "الباقات الإقليمية",
    globalBundles: "الباقات العالمية",
    allDestinations: "جميع الوجهات",
    from: "من",
    plans: (n: number) => `${n} باقات`,

    dataFor: (name: string) => `بيانات ${name}`,
    instantActivation: "تفعيل فوري · بدون رسوم تجوال",
    notFound: "غير موجود",
    destinationNotFound: "الوجهة غير موجودة.",

    bestValue: "أفضل قيمة",
    popular: "الأكثر شيوعاً",
    hotspot: "نقطة اتصال",
    noHotspot: "بدون نقطة اتصال",

    plan: "الباقة",
    planNotFound: "الباقة غير موجودة.",
    details: "التفاصيل",
    speed: "السرعة",
    hotspotLabel: "نقطة اتصال",
    supported: "مدعومة",
    notSupported: "غير مدعومة",
    type: "النوع",
    esimDigital: "eSIM (رقمية)",
    worksOn: "تعمل على",
    worksInstantly: "تعمل فوراً عند وصولك",
    worksInstantlyDesc: "فعّل التجوال وستكون متصلاً. لا حاجة لتبديل شريحة فعلية.",
    commonQuestions: "أسئلة شائعة",
    faqQ1: "هل ستعمل عند وصولي؟",
    faqA1: "نعم. تُفعّل شريحتك فوراً عند الاتصال بشبكة محلية. فقط فعّل التجوال في إعداداتك.",
    faqQ2: "هل يمكنني مشاركة البيانات عبر نقطة الاتصال؟",
    faqA2Yes: "نعم، نقطة الاتصال مدعومة بالكامل مع هذه الباقة.",
    faqA2No: "لا، هذه الباقة لا تدعم نقطة الاتصال.",
    faqQ3: "ماذا لو نفدت بياناتي؟",
    faqA3: "يمكنك شراء رصيد إضافي في أي وقت من لوحة التحكم. رقمك يبقى كما هو.",
    buyNow: "اشترِ الآن",

    checkout: "الدفع",
    noPlanSelected: "لم يتم اختيار باقة.",
    orderSummary: "ملخص الطلب",
    emailForReceipt: "البريد الإلكتروني للإيصال",
    emailPlaceholder: "you@example.com",
    payment: "الدفع",
    payWithApplePay: "ادفع بـ Apple Pay",
    orPayWithCard: "أو ادفع بالبطاقة",
    payWithCard: (price: string) => `ادفع ${price} بالبطاقة`,
    securePayment: "دفع آمن",
    instantDelivery: "توصيل فوري",

    purchaseComplete: "تمت عملية الشراء!",
    esimReady: (country: string) => `شريحة eSIM لـ ${country} جاهزة للتثبيت.\nيستغرق الأمر حوالي دقيقتين.`,
    scanWithCamera: "امسح بكاميرا هاتفك",
    orEnterManually: "أو أدخل يدوياً",
    smdpAddress: "عنوان SM-DP+",
    activationCode: "رمز التفعيل",
    installIn2Min: "ثبّت في دقيقتين",
    step1Title: "افتح الإعدادات",
    step1Desc: "اذهب إلى الإعدادات ← الخلوي ← إضافة eSIM",
    step2Title: "امسح رمز QR",
    step2Desc: "وجّه كاميرتك نحو رمز QR أدناه",
    step3Title: "تأكيد وتفعيل",
    step3Desc: "اضغط 'إضافة خطة خلوية' عند المطالبة",
    step4Title: "فعّل تجوال البيانات",
    step4Desc: "الإعدادات ← الخلوي ← خطتك الجديدة ← تجوال البيانات ← تشغيل",
    watchHowToInstall: "شاهد طريقة التثبيت",
    goToMyEsims: "اذهب إلى شرائحي",

    myEsims: "شرائحي",
    noEsimsYet: "لا توجد شرائح بعد",
    buyFirstEsim: "اشترِ أول شريحة eSIM وستظهر هنا.",
    browsePlans: "تصفح الباقات",
    gbLeft: "جيجابايت متبقية",
    daysRemaining: (n: number) => `${n} يوم متبقي`,
    gbUsed: (used: string, total: number) => `${used} جيجابايت من ${total} جيجابايت مستخدمة`,
    topUp: "شحن رصيد",
    detailsBtn: "التفاصيل",
    active: "نشطة",
    expired: "منتهية",

    verified: "موثّق",
    tier: "المستوى",
    addPhoneNumber: "أضف رقم هاتف",
    addPhoneDesc: "استقبل إشعارات eSIM عبر واتساب",
    myEsimsSection: "شرائحي",
    activeTab: "نشطة",
    expiredTab: "منتهية",
    noEsimsHere: "لا توجد شرائح هنا.",
    browsePlansLink: "تصفح الباقات",
    purchaseHistory: "سجل المشتريات",
    payments: "المدفوعات",
    expiresDate: "تنتهي 12/27",
    remove: "حذف",
    addPaymentMethod: "أضف طريقة دفع",
    support: "الدعم",
    helpCenter: "مركز المساعدة",
    contactSupport: "تواصل مع الدعم (واتساب)",
    installationGuide: "دليل التثبيت",
    deviceCompatibility: "توافق الأجهزة",
    settings: "الإعدادات",
    language: "اللغة",
    languageValue: "العربية",
    currency: "العملة",
    darkMode: "الوضع الداكن",
    notifications: "الإشعارات",
    logOut: "تسجيل الخروج",

    tierName: (name: string) => `مستوى ${name}`,
    ordersTo: (n: number, name: string) => `${n} طلب للوصول إلى ${name}`,
    maxTier: "أعلى مستوى — استمتع بجميع المزايا!",
    unlockAt: (name: string) => `افتح عند ${name}`,
    yourPerks: "مزاياك",
    orders: (n: number) => `${n}+ طلب`,
    off: (n: number) => `خصم ${n}%`,

    notFoundTitle: "404",
    notFoundMsg: "عذراً! الصفحة غير موجودة",
    returnHome: "العودة للرئيسية",

    gbRemaining: (n: string) => `${n} جيجابايت متبقية`,
    dRemaining: (n: number) => `${n} يوم`,
  },
} as const;

export type Translations = typeof translations.en;

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
  dir: "ltr" | "rtl";
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

function detectLocale(): Locale {
  const saved = localStorage.getItem("locale");
  if (saved === "ar" || saved === "en") return saved;
  const browserLang = navigator.language || (navigator as any).userLanguage || "";
  if (browserLang.startsWith("ar")) return "ar";
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const t = translations[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir, isRTL: locale === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
