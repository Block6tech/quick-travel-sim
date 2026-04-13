export interface PlanCondition {
  icon: string;
  label: string;
  detail: string;
}

export interface EsimPlan {
  id: string;
  country: string;
  countryCode: string;
  data: string;
  validity: string;
  days: number;
  price: number;
  speed: string;
  networks: string[];
  hotspot: boolean;
  isBestValue?: boolean;
  isMostPopular?: boolean;
  conditions?: PlanCondition[];
}

export interface EsimCountry {
  name: string;
  code: string;
  startingPrice: number;
  planCount: number;
}

export interface ActiveEsim {
  id: string;
  country: string;
  countryCode: string;
  plan: string;
  dataUsed: number;
  dataTotal: number;
  expiresAt: string;
  status: "active" | "expired" | "pending";
}

export const countries: EsimCountry[] = [
  { name: "United Arab Emirates", code: "AE", startingPrice: 4.5, planCount: 8 },
  { name: "Turkey", code: "TR", startingPrice: 5, planCount: 8 },
  { name: "United Kingdom", code: "GB", startingPrice: 4, planCount: 8 },
  { name: "United States", code: "US", startingPrice: 5, planCount: 8 },
  { name: "France", code: "FR", startingPrice: 4.5, planCount: 8 },
  { name: "Germany", code: "DE", startingPrice: 4.5, planCount: 8 },
  { name: "Thailand", code: "TH", startingPrice: 3.5, planCount: 8 },
  { name: "Japan", code: "JP", startingPrice: 4, planCount: 8 },
  { name: "Saudi Arabia", code: "SA", startingPrice: 5, planCount: 8 },
  { name: "Egypt", code: "EG", startingPrice: 4, planCount: 8 },
  { name: "Spain", code: "ES", startingPrice: 4.5, planCount: 8 },
  { name: "Italy", code: "IT", startingPrice: 4.5, planCount: 8 },
  { name: "Malaysia", code: "MY", startingPrice: 3, planCount: 8 },
  { name: "Singapore", code: "SG", startingPrice: 4, planCount: 8 },
  { name: "Australia", code: "AU", startingPrice: 5, planCount: 8 },
  { name: "South Korea", code: "KR", startingPrice: 4.5, planCount: 8 },
  // Americas
  { name: "Canada", code: "CA", startingPrice: 5, planCount: 8 },
  { name: "Mexico", code: "MX", startingPrice: 4, planCount: 8 },
  { name: "Brazil", code: "BR", startingPrice: 4.5, planCount: 8 },
  { name: "Colombia", code: "CO", startingPrice: 4, planCount: 8 },
  { name: "Argentina", code: "AR", startingPrice: 4, planCount: 8 },
  { name: "Chile", code: "CL", startingPrice: 4.5, planCount: 8 },
  { name: "Peru", code: "PE", startingPrice: 4, planCount: 8 },
  // More Europe
  { name: "Netherlands", code: "NL", startingPrice: 4.5, planCount: 8 },
  { name: "Switzerland", code: "CH", startingPrice: 5.5, planCount: 8 },
  { name: "Portugal", code: "PT", startingPrice: 4, planCount: 8 },
  { name: "Greece", code: "GR", startingPrice: 4, planCount: 8 },
  { name: "Poland", code: "PL", startingPrice: 3.5, planCount: 8 },
  { name: "Sweden", code: "SE", startingPrice: 4.5, planCount: 8 },
  { name: "Austria", code: "AT", startingPrice: 4.5, planCount: 8 },
  // More Asia Pacific
  { name: "Indonesia", code: "ID", startingPrice: 3, planCount: 8 },
  { name: "India", code: "IN", startingPrice: 3, planCount: 8 },
  { name: "Vietnam", code: "VN", startingPrice: 3, planCount: 8 },
  { name: "Philippines", code: "PH", startingPrice: 3.5, planCount: 8 },
  { name: "New Zealand", code: "NZ", startingPrice: 5, planCount: 8 },
  // More Middle East & Africa
  { name: "Qatar", code: "QA", startingPrice: 5, planCount: 8 },
  { name: "Kuwait", code: "KW", startingPrice: 5, planCount: 8 },
  { name: "Bahrain", code: "BH", startingPrice: 4.5, planCount: 8 },
  { name: "Jordan", code: "JO", startingPrice: 4, planCount: 8 },
  { name: "Morocco", code: "MA", startingPrice: 4, planCount: 8 },
  { name: "South Africa", code: "ZA", startingPrice: 4, planCount: 8 },
];

export const regionalBundles: EsimCountry[] = [
  { name: "Europe", code: "EU", startingPrice: 7, planCount: 8 },
  { name: "Asia", code: "AS", startingPrice: 6, planCount: 8 },
  { name: "Middle East", code: "ME", startingPrice: 8, planCount: 8 },
  { name: "Global", code: "GL", startingPrice: 15, planCount: 8 },
];

const DAY_OPTIONS = [1, 3, 5, 7, 10, 16, 24, 30] as const;

function generateUnlimitedPlans(country: string, code: string, basePrice: number, speed: string, networks: string[], conditions?: PlanCondition[]): EsimPlan[] {
  const priceMultipliers: Record<number, number> = {
    1: 1,
    3: 2.4,
    5: 3.5,
    7: 4.5,
    10: 5.8,
    16: 8,
    24: 10.5,
    30: 12,
  };

  return DAY_OPTIONS.map((days, i) => {
    const price = Math.round(basePrice * priceMultipliers[days] * 10) / 10;
    return {
      id: `${code.toLowerCase()}-${days}d`,
      country,
      countryCode: code,
      data: "Unlimited",
      validity: `${days} ${days === 1 ? "day" : "days"}`,
      days,
      price,
      speed,
      networks,
      hotspot: true,
      isMostPopular: days === 7,
      isBestValue: days === 30,
      conditions,
    };
  });
}

export const plansForCountry: Record<string, EsimPlan[]> = {
  GB: generateUnlimitedPlans("United Kingdom", "GB", 4, "5G", ["Vodafone", "O2", "Three", "EE"], [
    { icon: "🐢", label: "Fair usage policy", detail: "Speed reduced to 2 Mbps after 2GB/day, resets daily at midnight" },
  ]),
  US: generateUnlimitedPlans("United States", "US", 5, "5G", ["T-Mobile", "AT&T"], [
    { icon: "📍", label: "Coverage zones", detail: "Best coverage in metro areas; rural coverage may be limited" },
  ]),
  AE: generateUnlimitedPlans("United Arab Emirates", "AE", 4.5, "5G", ["du", "Etisalat"], [
    { icon: "🚫", label: "VoIP restricted", detail: "WhatsApp calls, FaceTime & Skype are blocked by local regulations" },
  ]),
  TR: generateUnlimitedPlans("Turkey", "TR", 5, "4G/LTE", ["Turkcell", "Vodafone TR"], [
    { icon: "📱", label: "Social media bonus", detail: "WhatsApp messaging, Instagram & YouTube don't count toward fair usage" },
  ]),
};

// Default plans for countries not explicitly listed
export const defaultPlans = (country: string, code: string): EsimPlan[] =>
  generateUnlimitedPlans(country, code, 4.5, "5G", ["Local Network"], [
    { icon: "📶", label: "5G where available", detail: "Falls back to 4G/LTE in areas without 5G coverage" },
  ]);

export const getPlansForCountry = (code: string): EsimPlan[] => {
  if (plansForCountry[code]) return plansForCountry[code];
  const country = countries.find(c => c.code === code) || regionalBundles.find(c => c.code === code);
  return defaultPlans(country?.name || code, code);
};

export const sampleActiveEsims: ActiveEsim[] = [
  {
    id: "active-1",
    country: "United Kingdom",
    countryCode: "GB",
    plan: "Unlimited • 30 days",
    dataUsed: 3.2,
    dataTotal: 10,
    expiresAt: "2026-04-15",
    status: "active",
  },
  {
    id: "active-2",
    country: "Turkey",
    countryCode: "TR",
    plan: "Unlimited • 7 days",
    dataUsed: 5,
    dataTotal: 5,
    expiresAt: "2026-02-10",
    status: "expired",
  },
];

export interface OrderHistory {
  id: string;
  orderNumber: string;
  country: string;
  countryCode: string;
  planSize: string;
  price: number;
  date: string;
}

export const sampleOrders: OrderHistory[] = [
  { id: "ord-1", orderNumber: "CS-20260301", country: "United Kingdom", countryCode: "GB", planSize: "Unlimited", price: 19, date: "2026-03-01" },
  { id: "ord-2", orderNumber: "CS-20260115", country: "Turkey", countryCode: "TR", planSize: "Unlimited", price: 13, date: "2026-01-15" },
  { id: "ord-3", orderNumber: "CS-20251220", country: "United Arab Emirates", countryCode: "AE", planSize: "Unlimited", price: 9, date: "2025-12-20" },
];

export type TierLevel = 1 | 2 | 3;

export interface TierInfo {
  level: TierLevel;
  name: string;
  emoji: string;
  minOrders: number;
  discount: number;
  perks: string[];
}

export const tiers: TierInfo[] = [
  { level: 1, name: "الجمل البرونزي", emoji: "🐪", minOrders: 0, discount: 0, perks: ["Access to all plans", "Email support"] },
  { level: 2, name: "الذهبي", emoji: "🐫", minOrders: 5, discount: 5, perks: ["5% off all plans", "Priority support", "Early access to deals"] },
  { level: 3, name: "الاحمر", emoji: "🏆🐫", minOrders: 15, discount: 10, perks: ["10% off all plans", "VIP WhatsApp support", "Exclusive bundles", "Free top-ups"] },
];

export function getUserTier(orderCount: number): TierInfo {
  if (orderCount >= 15) return tiers[2];
  if (orderCount >= 5) return tiers[1];
  return tiers[0];
}

export function getNextTier(orderCount: number): { next: TierInfo | null; ordersNeeded: number; progress: number } {
  const current = getUserTier(orderCount);
  if (current.level === 3) return { next: null, ordersNeeded: 0, progress: 100 };
  const next = tiers[current.level];
  const ordersNeeded = next.minOrders - orderCount;
  const prevMin = tiers[current.level - 1].minOrders;
  const progress = ((orderCount - prevMin) / (next.minOrders - prevMin)) * 100;
  return { next, ordersNeeded, progress: Math.min(100, Math.max(0, progress)) };
}
