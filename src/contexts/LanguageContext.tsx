import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type Locale = "en" | "ar";

const translations: Record<Locale, Record<string, any>> = {
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
    continents: {
      middleEast: "Middle East & Africa",
      europe: "Europe",
      asiaPacific: "Asia Pacific",
      americas: "Americas",
    },
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
    activateWarning: "Activate the plan before landing in the desired country",
    conditions: "Conditions",
    conditionLabels: {} as Record<string, string>,
    conditionDetails: {} as Record<string, string>,
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
    createAccount: "Create your account",
    password: "Password",
    passwordPlaceholder: "Create a password",
    confirmPassword: "Confirm password",
    confirmPasswordPlaceholder: "Re-enter your password",
    phoneOptional: "Phone number (optional)",
    phonePlaceholder: "+965 XXXX XXXX",
    phoneHint: "Receive your eSIM QR code via WhatsApp (Optional)",
    passwordMismatch: "Passwords don't match",
    passwordTooShort: "Password must be at least 6 characters",
    accountExists: "Account already exists? We'll log you in.",
    creatingAccount: "Creating account...",
    payment: "Payment",
    payWithApplePay: "Pay with Apple Pay",
    orPayWithCard: "or pay with card",
    payWithCard: (price: string) => `Pay ${price} with Card`,
    securePayment: "Secure payment",
    instantDelivery: "Instant delivery",
    createAccountOptional: "Create account (optional)",
    createAccountHint: "Save your eSIMs and manage them anytime",
    wantToCreateAccount: "I want to create an account",
    acceptTerms: "I accept the",
    termsAndConditions: "Terms & Conditions",
    termsRequired: "You must accept the Terms & Conditions",
    termsTitle: "Terms & Conditions",
    termsClose: "Close",
    guestCheckout: "Continue as guest",

    // Installation
    purchaseComplete: "Purchase complete!",
    esimReady: (country: string) => `Your eSIM for ${country} is ready to install.\nIt takes about 2 minutes.`,
    scanWithCamera: "Scan with your phone camera",
    installEsim: "Install eSIM",
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
    beforeFlightTitle: "Set up before your flight",
    beforeFlightDesc: "Install your eSIM while connected to Wi-Fi before departing. Once you land, simply turn on data roaming and you're connected instantly — no searching for local SIM shops.",
    howItWorksTitle: "How it works",
    howItWorksSteps: [
      { icon: "download", label: "Install eSIM", desc: "Scan QR or enter manually" },
      { icon: "plane", label: "Board your flight", desc: "eSIM stays dormant until arrival" },
      { icon: "signal", label: "Land & connect", desc: "Enable data roaming & go online" },
    ],

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
    unlimited: "Unlimited",
    daysLeft: "days left",
    dayLeft: "day left",
    extendPlan: "Extend Plan",
    rebuy: "Rebuy",
    expiredSection: "Expired",
    status: "Status",
    planDuration: "Plan Duration",
    activated: "Activated",
    expires: "Expires",
    day: "day",
    days: (n: number) => `${n} ${n === 1 ? "day" : "days"}`,

    // Account
    startJourney: "Unlock your Camel Tier rewards",
    startJourneyDesc: "Buy eSIM plans to climb from Bronze → Golden → الاحمر",
    tierBronzeLabel: "Bronze",
    tierGoldenLabel: "Golden",
    tierRedLabel: "الاحمر",
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
    compatibleDevices: [
      { brand: "Apple", models: "iPhone XS, XR, 11, 12, 13, 14, 15, 16 series & iPad Pro/Air (2018+)" },
      { brand: "Samsung", models: "Galaxy S20–S25, Z Flip/Fold series, Note 20, A54 5G" },
      { brand: "Google", models: "Pixel 3, 4, 5, 6, 7, 8, 9 series" },
      { brand: "Others", models: "Motorola Razr, Xiaomi 13 series, OPPO Find X5+" },
    ],
    contactWhatsApp: "Chat on WhatsApp",
    contactEmail: "Email support@camelsim.com",
    faqCategories: [
      {
        title: "Getting Started",
        items: [
          { q: "What is an eSIM?", a: "An eSIM is a digital SIM embedded in your device. It lets you activate a cellular plan without a physical SIM card — just scan a QR code and you're connected." },
          { q: "Which devices support eSIM?", a: "Most recent iPhones (XS and newer), Samsung Galaxy S20+, Google Pixel 3+, and many other modern smartphones support eSIM. Check your device settings for 'Add eSIM' or 'Add Cellular Plan'." },
          { q: "How do I install my eSIM?", a: "After purchase you'll receive a QR code. Go to Settings → Cellular → Add eSIM, scan the QR code, and confirm. It takes about 2 minutes." },
        ],
      },
      {
        title: "Plans & Data",
        items: [
          { q: "Will my eSIM work when I land?", a: "Yes! Your eSIM activates instantly once connected to a local network. Just make sure Data Roaming is turned on in your settings." },
          { q: "Can I share data via hotspot?", a: "It depends on the plan. Plans with the 'Hotspot' badge support tethering. Check the plan details page before purchasing." },
          { q: "What happens when I run out of data?", a: "You can buy a top-up anytime from your dashboard. Your eSIM stays active and your number remains the same." },
          { q: "Can I use multiple eSIMs?", a: "Yes, most devices support multiple eSIM profiles. You can switch between them in your device settings." },
        ],
      },
      {
        title: "Billing & Account",
        items: [
          { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards, as well as Apple Pay." },
          { q: "Can I get a refund?", a: "Unused eSIMs can be refunded within 7 days of purchase. Once data has been consumed, the plan is non-refundable." },
          { q: "How do I reset my password?", a: "Go to the sign-in page and tap 'Forgot password?' — we'll send you a reset link via email." },
        ],
      },
      {
        title: "Troubleshooting",
        items: [
          { q: "My eSIM isn't connecting", a: "Make sure Data Roaming is enabled: Settings → Cellular → your eSIM plan → Data Roaming → On. If the issue persists, try restarting your device." },
          { q: "I can't scan the QR code", a: "You can enter the activation details manually. On the installation page, tap 'Or enter manually' to see the SM-DP+ address and activation code." },
          { q: "How do I contact support?", a: "Tap 'Contact Support (WhatsApp)' in the Account page, or email us at support@camelsim.com. We typically respond within a few hours." },
        ],
      },
    ],
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

    // Onboarding
    onboardTitle1: "Travel eSIMs, simplified",
    onboardDesc1: "Browse 100+ destinations and find the perfect data plan for your trip.",
    onboardTitle2: "Instant activation",
    onboardDesc2: "No SIM swaps, no store visits. Get connected in under 60 seconds.",
    onboardTitle3: "Manage on the go",
    onboardDesc3: "Track your data usage, top up anytime, and manage all your eSIMs in one place.",
    onboardSkip: "Skip",
    onboardNext: "Next",
    onboardGetStarted: "Get Started",

    // NotFound
    notFoundTitle: "404",
    notFoundMsg: "Oops! Page not found",
    returnHome: "Return to Home",

    // Data labels
    gbRemaining: (n: string) => `${n} GB left`,
    dRemaining: (n: number) => `${n}d remaining`,

    // Auth
    authLogin: "Welcome back",
    authRegister: "Create account",
    authForgot: "Reset password",
    authLoginSub: "Sign in to manage your eSIMs",
    authRegisterSub: "Get started with CamelSim",
    authForgotSub: "We'll send you a reset link",
    authGoogle: "Continue with Google",
    authOr: "or",
    authForgotLink: "Forgot password?",
    authLoginBtn: "Sign in",
    authRegisterBtn: "Create account",
    authResetBtn: "Send reset link",
    authNoAccount: "Don't have an account?",
    authHaveAccount: "Already have an account?",
    authBackToLogin: "Back to sign in",
    authResetSent: "Password reset link sent! Check your email.",
    authCheckEmail: "Check your email to verify your account.",
    authNewPassword: "Set new password",
    authNewPasswordSub: "Enter your new password below",
    authNewPasswordLabel: "New password",
    authUpdatePassword: "Update password",
    authPasswordUpdated: "Password updated!",
    authRedirecting: "Redirecting...",
    authSignIn: "Sign in",

    // Discount / Referral
    havePromoCode: "I have a promo code",
    discountCode: "Discount / Referral Code",
    discountPlaceholder: "Enter code",
    discountApply: "Apply",
    discountApplied: "applied",
    discountInvalid: "Invalid or expired code",
    discountRemove: "Remove",
    yourReferralCode: "Your Referral Code",
    referralDesc: "Share your code — friends get 10% off, you earn rewards!",
    referralCopied: "Copied!",
    referralCopy: "Copy code",
    referralShare: "Share",
    referralCount: (n: number) => `${n} referral${n !== 1 ? "s" : ""}`,
    referralReward: "10% off for friends",
    referralEarnings: "Your Earnings",
    referralEarningsDesc: (val: string, type: string) => `${val}${type === "percentage" ? "%" : "$"} reward per referral`,
    referralTotalEarned: (n: number) => `${n} reward${n !== 1 ? "s" : ""} earned`,
    earned: "earned",
    referralEarnedLabel: "from referrals",
    referralPotentialLabel: "Earn $5 per referral",
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
    continents: {
      middleEast: "الشرق الأوسط وأفريقيا",
      europe: "أوروبا",
      asiaPacific: "آسيا والمحيط الهادئ",
      americas: "الأمريكتين",
    },
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
    activateWarning: "قم بتفعيل الباقة قبل الوصول إلى البلد المطلوب",
    conditions: "الشروط",
    conditionLabels: {
      "Data expires": "انتهاء البيانات",
      "5G where available": "5G حيثما توفر",
      "Top-up available": "إعادة الشحن متاحة",
      "Fair usage policy": "سياسة الاستخدام العادل",
      "No VoIP calls": "بدون مكالمات VoIP",
      "Coverage zones": "مناطق التغطية",
      "Hotspot cap": "حد نقطة الاتصال",
      "VoIP restricted": "مكالمات VoIP محظورة",
      "Social media included": "شبكات التواصل مشمولة",
      "Daily speed cap": "حد السرعة اليومي",
      "No hotspot": "بدون نقطة اتصال",
      "Night bonus": "بونص ليلي",
      "Social media bonus": "بونص التواصل الاجتماعي",
      "Fair usage": "الاستخدام العادل",
    } as Record<string, string>,
    conditionDetails: {
      "Unused data expires at the end of validity period": "البيانات غير المستخدمة تنتهي مع انتهاء فترة الصلاحية",
      "Falls back to 4G/LTE in areas without 5G coverage": "تعود إلى 4G/LTE في المناطق بدون تغطية 5G",
      "Add more data anytime before plan expires": "أضف بيانات إضافية في أي وقت قبل انتهاء الباقة",
      "Speed reduced to 2 Mbps after 2GB/day, resets daily at midnight": "تنخفض السرعة إلى 2 ميغابت بعد 2 جيجا/يوم، تُعاد يومياً عند منتصف الليل",
      "Voice-over-IP services (WhatsApp calls, FaceTime) not supported": "خدمات المكالمات عبر الإنترنت (واتساب، فيس تايم) غير مدعومة",
      "Best coverage in metro areas; rural coverage may be limited": "أفضل تغطية في المدن الكبرى؛ التغطية الريفية قد تكون محدودة",
      "Hotspot/tethering limited to 5GB; remaining data is device-only": "نقطة الاتصال محدودة بـ 5 جيجا؛ البيانات المتبقية للجهاز فقط",
      "Speed reduced to 3 Mbps after 1.5GB/day, resets daily": "تنخفض السرعة إلى 3 ميغابت بعد 1.5 جيجا/يوم، تُعاد يومياً",
      "Hotspot/tethering limited to 10GB total": "نقطة الاتصال محدودة بـ 10 جيجا إجمالاً",
      "WhatsApp calls, FaceTime & Skype are blocked by local regulations": "مكالمات واتساب وفيس تايم وسكايب محظورة بموجب اللوائح المحلية",
      "WhatsApp messaging, Instagram & TikTok don't count toward data": "رسائل واتساب وإنستغرام وتيك توك لا تُحسب من البيانات",
      "Speed drops to 2 Mbps after 1GB/day; resets at midnight local time": "تنخفض السرعة إلى 2 ميغابت بعد 1 جيجا/يوم؛ تُعاد عند منتصف الليل",
      "Tethering/hotspot is disabled on this plan": "نقطة الاتصال/المشاركة معطّلة في هذه الباقة",
      "Unlimited data between 1 AM – 7 AM local time": "بيانات غير محدودة بين 1 صباحاً – 7 صباحاً بالتوقيت المحلي",
      "Extra 2GB for WhatsApp, Instagram & YouTube": "2 جيجا إضافية لواتساب وإنستغرام ويوتيوب",
      "Speed throttled to 1.5 Mbps after daily 3GB limit": "تُخفّض السرعة إلى 1.5 ميغابت بعد حد 3 جيجا يومياً",
    } as Record<string, string>,
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
    emailForReceipt: "البريد الإلكتروني",
    emailPlaceholder: "you@example.com",
    createAccount: "أنشئ حسابك",
    password: "كلمة المرور",
    passwordPlaceholder: "أنشئ كلمة مرور",
    confirmPassword: "تأكيد كلمة المرور",
    confirmPasswordPlaceholder: "أعد إدخال كلمة المرور",
    phoneOptional: "رقم الهاتف (اختياري)",
    phonePlaceholder: "+965 XXXX XXXX",
    phoneHint: "استقبل رمز QR لشريحتك عبر واتساب (اختياري)",
    passwordMismatch: "كلمتا المرور غير متطابقتين",
    passwordTooShort: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
    accountExists: "لديك حساب بالفعل؟ سنسجل دخولك.",
    creatingAccount: "جاري إنشاء الحساب...",
    payment: "الدفع",
    payWithApplePay: "ادفع بـ Apple Pay",
    orPayWithCard: "أو ادفع بالبطاقة",
    payWithCard: (price: string) => `ادفع ${price} بالبطاقة`,
    securePayment: "دفع آمن",
    instantDelivery: "توصيل فوري",
    createAccountOptional: "إنشاء حساب (اختياري)",
    createAccountHint: "احفظ شرائحك وأدرها في أي وقت",
    wantToCreateAccount: "أريد إنشاء حساب",
    acceptTerms: "أوافق على",
    termsAndConditions: "الشروط والأحكام",
    termsRequired: "يجب الموافقة على الشروط والأحكام",
    termsTitle: "الشروط والأحكام",
    termsClose: "إغلاق",
    guestCheckout: "المتابعة كزائر",

    purchaseComplete: "تمت عملية الشراء!",
    esimReady: (country: string) => `شريحة eSIM لـ ${country} جاهزة للتثبيت.\nيستغرق الأمر حوالي دقيقتين.`,
    scanWithCamera: "امسح بكاميرا هاتفك",
    installEsim: "تثبيت الشريحة",
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
    beforeFlightTitle: "جهّز قبل رحلتك",
    beforeFlightDesc: "ثبّت شريحة eSIM وأنت متصل بالواي فاي قبل السفر. بمجرد وصولك، فعّل تجوال البيانات واتصل فوراً — بدون البحث عن محلات شرائح محلية.",
    howItWorksTitle: "كيف تعمل",
    howItWorksSteps: [
      { icon: "download", label: "ثبّت الشريحة", desc: "امسح QR أو أدخل يدوياً" },
      { icon: "plane", label: "اركب طائرتك", desc: "الشريحة تبقى خاملة حتى الوصول" },
      { icon: "signal", label: "حطّ واتصل", desc: "فعّل تجوال البيانات وابدأ التصفح" },
    ],

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
    unlimited: "غير محدود",
    daysLeft: "يوم متبقي",
    dayLeft: "يوم متبقي",
    extendPlan: "تمديد الباقة",
    rebuy: "إعادة شراء",
    expiredSection: "منتهية",
    status: "الحالة",
    planDuration: "مدة الباقة",
    activated: "تم التفعيل",
    expires: "تنتهي",
    day: "يوم",
    days: (n: number) => `${n} يوم`,

    startJourney: "افتح مكافآت مستوى الجمل",
    startJourneyDesc: "اشترِ باقات eSIM وارتقِ من البرونزي ← الذهبي ← الاحمر",
    tierBronzeLabel: "برونزي",
    tierGoldenLabel: "ذهبي",
    tierRedLabel: "الاحمر",
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
    compatibleDevices: [
      { brand: "Apple", models: "iPhone XS, XR, 11, 12, 13, 14, 15, 16 و iPad Pro/Air (2018+)" },
      { brand: "Samsung", models: "Galaxy S20–S25, Z Flip/Fold, Note 20, A54 5G" },
      { brand: "Google", models: "Pixel 3, 4, 5, 6, 7, 8, 9" },
      { brand: "أخرى", models: "Motorola Razr, Xiaomi 13, OPPO Find X5+" },
    ],
    contactWhatsApp: "تواصل عبر واتساب",
    contactEmail: "راسلنا على support@camelsim.com",
    faqCategories: [
      {
        title: "البداية",
        items: [
          { q: "ما هي شريحة eSIM؟", a: "شريحة eSIM هي شريحة رقمية مدمجة في جهازك. تتيح لك تفعيل خطة خلوية بدون شريحة فعلية — فقط امسح رمز QR وستكون متصلاً." },
          { q: "ما الأجهزة التي تدعم eSIM؟", a: "معظم أجهزة iPhone الحديثة (XS وأحدث)، Samsung Galaxy S20+، Google Pixel 3+ والعديد من الهواتف الحديثة تدعم eSIM." },
          { q: "كيف أثبّت شريحة eSIM؟", a: "بعد الشراء ستحصل على رمز QR. اذهب إلى الإعدادات ← الخلوي ← إضافة eSIM، امسح الرمز وأكّد. يستغرق الأمر دقيقتين تقريباً." },
        ],
      },
      {
        title: "الباقات والبيانات",
        items: [
          { q: "هل ستعمل شريحتي عند وصولي؟", a: "نعم! تُفعّل شريحتك فوراً عند الاتصال بشبكة محلية. تأكد من تفعيل تجوال البيانات في إعداداتك." },
          { q: "هل يمكنني مشاركة البيانات عبر نقطة اتصال؟", a: "يعتمد على الباقة. الباقات التي تحمل شارة 'نقطة اتصال' تدعم المشاركة. تحقق من تفاصيل الباقة قبل الشراء." },
          { q: "ماذا يحدث عند نفاد بياناتي؟", a: "يمكنك شراء رصيد إضافي في أي وقت من لوحة التحكم. شريحتك تبقى نشطة ورقمك لا يتغير." },
          { q: "هل يمكنني استخدام عدة شرائح eSIM؟", a: "نعم، معظم الأجهزة تدعم عدة ملفات eSIM. يمكنك التبديل بينها في إعدادات جهازك." },
        ],
      },
      {
        title: "الفواتير والحساب",
        items: [
          { q: "ما طرق الدفع المتاحة؟", a: "نقبل جميع بطاقات الائتمان والخصم الرئيسية، بالإضافة إلى Apple Pay." },
          { q: "هل يمكنني استرداد المبلغ؟", a: "يمكن استرداد الشرائح غير المستخدمة خلال 7 أيام من الشراء. بمجرد استهلاك البيانات، لا يمكن الاسترداد." },
          { q: "كيف أعيد تعيين كلمة المرور؟", a: "اذهب إلى صفحة تسجيل الدخول واضغط 'نسيت كلمة المرور؟' — سنرسل لك رابط إعادة التعيين عبر البريد." },
        ],
      },
      {
        title: "استكشاف الأخطاء",
        items: [
          { q: "شريحتي لا تتصل", a: "تأكد من تفعيل تجوال البيانات: الإعدادات ← الخلوي ← خطة eSIM ← تجوال البيانات ← تشغيل. إذا استمرت المشكلة، أعد تشغيل جهازك." },
          { q: "لا أستطيع مسح رمز QR", a: "يمكنك إدخال تفاصيل التفعيل يدوياً. في صفحة التثبيت، اضغط 'أو أدخل يدوياً' لرؤية عنوان SM-DP+ ورمز التفعيل." },
          { q: "كيف أتواصل مع الدعم؟", a: "اضغط 'تواصل مع الدعم (واتساب)' في صفحة الحساب، أو راسلنا على support@camelsim.com. نرد عادةً خلال ساعات قليلة." },
        ],
      },
    ],
    settings: "الإعدادات",
    language: "اللغة",
    languageValue: "العربية",
    currency: "العملة",
    darkMode: "الوضع الداكن",
    notifications: "الإشعارات",
    logOut: "تسجيل الخروج",

    tierName: (name: string) => {
      if (name === "Bronze Camel") return "مستوى الحالي: البرونزي";
      if (name === "Golden Camel") return "مستوى الحالي: الذهبي";
      if (name === "Red Camel") return "مستوى الحالي: الأحمر";
      return `مستوى ${name}`;
    },
    ordersTo: (n: number, name: string) => {
      const translatedName = name === "Golden Camel" ? "المستوى الذهبي" : name === "Red Camel" ? "المستوى الأحمر" : name;
      const unit = n >= 3 && n <= 10 ? "طلبات" : "طلب";
      return `${n} ${unit} متبقيه للوصول إلى ${translatedName}`;
    },
    maxTier: "أعلى مستوى — استمتع بجميع المزايا!",
    unlockAt: (name: string) => `افتح عند ${name}`,
    yourPerks: "مزاياك",
    orders: (n: number) => `${n}+ طلب`,
    off: (n: number) => `خصم ${n}%`,

    // Onboarding
    onboardTitle1: "شرائح eSIM للسفر، ببساطة",
    onboardDesc1: "تصفح أكثر من 100 وجهة واعثر على باقة البيانات المثالية لرحلتك.",
    onboardTitle2: "تفعيل فوري",
    onboardDesc2: "بدون تبديل شرائح أو زيارة متاجر. اتصل في أقل من 60 ثانية.",
    onboardTitle3: "تحكّم أثناء التنقل",
    onboardDesc3: "تتبع استهلاك بياناتك، اشحن في أي وقت، وأدر جميع شرائحك من مكان واحد.",
    onboardSkip: "تخطي",
    onboardNext: "التالي",
    onboardGetStarted: "ابدأ الآن",

    notFoundTitle: "404",
    notFoundMsg: "عذراً! الصفحة غير موجودة",
    returnHome: "العودة للرئيسية",

    gbRemaining: (n: string) => `${n} جيجابايت متبقية`,
    dRemaining: (n: number) => `${n} يوم`,

    // Auth
    authLogin: "مرحباً بعودتك",
    authRegister: "إنشاء حساب",
    authForgot: "استعادة كلمة المرور",
    authLoginSub: "سجّل دخولك لإدارة شرائحك",
    authRegisterSub: "ابدأ مع كاميل سيم",
    authForgotSub: "سنرسل لك رابط الاستعادة",
    authGoogle: "المتابعة بحساب Google",
    authOr: "أو",
    authForgotLink: "نسيت كلمة المرور؟",
    authLoginBtn: "تسجيل الدخول",
    authRegisterBtn: "إنشاء حساب",
    authResetBtn: "إرسال رابط الاستعادة",
    authNoAccount: "ليس لديك حساب؟",
    authHaveAccount: "لديك حساب بالفعل؟",
    authBackToLogin: "العودة لتسجيل الدخول",
    authResetSent: "تم إرسال رابط الاستعادة! تحقق من بريدك.",
    authCheckEmail: "تحقق من بريدك الإلكتروني لتفعيل حسابك.",
    authNewPassword: "تعيين كلمة مرور جديدة",
    authNewPasswordSub: "أدخل كلمة المرور الجديدة أدناه",
    authNewPasswordLabel: "كلمة المرور الجديدة",
    authUpdatePassword: "تحديث كلمة المرور",
    authPasswordUpdated: "تم تحديث كلمة المرور!",
    authRedirecting: "جاري التوجيه...",
    authSignIn: "تسجيل الدخول",

    // Discount / Referral
    havePromoCode: "لدي كود خصم",
    discountCode: "كود خصم / إحالة",
    discountPlaceholder: "أدخل الكود",
    discountApply: "تطبيق",
    discountApplied: "مُطبّق",
    discountInvalid: "كود غير صالح أو منتهي",
    discountRemove: "إزالة",
    yourReferralCode: "كود الإحالة الخاص بك",
    referralDesc: "شارك كودك — أصدقاؤك يحصلون على خصم 10%، وأنت تكسب مكافآت!",
    referralCopied: "تم النسخ!",
    referralCopy: "نسخ الكود",
    referralShare: "مشاركة",
    referralCount: (n: number) => `${n} إحالة`,
    referralReward: "خصم 10% للأصدقاء",
    referralEarnings: "أرباحك",
    referralEarningsDesc: (val: string, type: string) => `${val}${type === "percentage" ? "%" : "$"} مكافأة لكل إحالة`,
    referralTotalEarned: (n: number) => `${n} مكافأة مكتسبة`,
    earned: "مكتسب",
    referralEarnedLabel: "من الإحالات",
    referralPotentialLabel: "اكسب $5 لكل إحالة",
  },
} as const;

/** Country/region name translations keyed by ISO code */
const countryNames: Record<Locale, Record<string, string>> = {
  en: {},
  ar: {
    // Countries
    AE: "الإمارات العربية المتحدة",
    TR: "تركيا",
    GB: "المملكة المتحدة",
    US: "الولايات المتحدة",
    FR: "فرنسا",
    DE: "ألمانيا",
    TH: "تايلاند",
    JP: "اليابان",
    SA: "المملكة العربية السعودية",
    EG: "مصر",
    ES: "إسبانيا",
    IT: "إيطاليا",
    MY: "ماليزيا",
    SG: "سنغافورة",
    AU: "أستراليا",
    KR: "كوريا الجنوبية",
    // Americas
    CA: "كندا",
    MX: "المكسيك",
    BR: "البرازيل",
    CO: "كولومبيا",
    AR: "الأرجنتين",
    CL: "تشيلي",
    PE: "بيرو",
    // More Europe
    NL: "هولندا",
    CH: "سويسرا",
    PT: "البرتغال",
    GR: "اليونان",
    PL: "بولندا",
    SE: "السويد",
    AT: "النمسا",
    // More Asia Pacific
    ID: "إندونيسيا",
    IN: "الهند",
    VN: "فيتنام",
    PH: "الفلبين",
    NZ: "نيوزيلندا",
    // More Middle East & Africa
    QA: "قطر",
    KW: "الكويت",
    BH: "البحرين",
    JO: "الأردن",
    MA: "المغرب",
    ZA: "جنوب أفريقيا",
    // Regional / Global bundles
    EU: "أوروبا",
    AS: "آسيا",
    ME: "الشرق الأوسط",
    GL: "عالمية",
    GP: "عالمية بلس",
  },
};

/**
 * Returns the translated country name for the current locale.
 * Falls back to the original English name.
 */
export function getCountryName(code: string, englishName: string, locale: Locale): string {
  return countryNames[locale]?.[code] || englishName;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Translations = Record<string, any>;

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
