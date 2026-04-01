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
  { name: "United Arab Emirates", code: "AE", startingPrice: 4.5, planCount: 6 },
  { name: "Turkey", code: "TR", startingPrice: 5, planCount: 5 },
  { name: "United Kingdom", code: "GB", startingPrice: 4, planCount: 6 },
  { name: "United States", code: "US", startingPrice: 5, planCount: 6 },
  { name: "France", code: "FR", startingPrice: 4.5, planCount: 5 },
  { name: "Germany", code: "DE", startingPrice: 4.5, planCount: 5 },
  { name: "Thailand", code: "TH", startingPrice: 3.5, planCount: 5 },
  { name: "Japan", code: "JP", startingPrice: 4, planCount: 5 },
  { name: "Saudi Arabia", code: "SA", startingPrice: 5, planCount: 4 },
  { name: "Egypt", code: "EG", startingPrice: 4, planCount: 4 },
  { name: "Spain", code: "ES", startingPrice: 4.5, planCount: 5 },
  { name: "Italy", code: "IT", startingPrice: 4.5, planCount: 5 },
  { name: "Malaysia", code: "MY", startingPrice: 3, planCount: 4 },
  { name: "Singapore", code: "SG", startingPrice: 4, planCount: 4 },
  { name: "Australia", code: "AU", startingPrice: 5, planCount: 5 },
  { name: "South Korea", code: "KR", startingPrice: 4.5, planCount: 4 },
];

export const regionalBundles: EsimCountry[] = [
  { name: "Europe", code: "EU", startingPrice: 7, planCount: 8 },
  { name: "Asia", code: "AS", startingPrice: 6, planCount: 7 },
  { name: "Middle East", code: "ME", startingPrice: 8, planCount: 5 },
  { name: "Global", code: "GL", startingPrice: 15, planCount: 4 },
];

export const plansForCountry: Record<string, EsimPlan[]> = {
  GB: [
    { id: "gb-1", country: "United Kingdom", countryCode: "GB", data: "1GB", validity: "7 days", price: 4, speed: "4G/LTE", networks: ["Vodafone", "O2", "Three"], hotspot: true, conditions: [{ icon: "⏳", label: "Data expires", detail: "Unused data expires at the end of validity period" }] },
    { id: "gb-2", country: "United Kingdom", countryCode: "GB", data: "3GB", validity: "15 days", price: 8, speed: "4G/LTE", networks: ["Vodafone", "O2", "Three"], hotspot: true },
    { id: "gb-3", country: "United Kingdom", countryCode: "GB", data: "5GB", validity: "30 days", price: 12, speed: "5G", networks: ["Vodafone", "O2", "Three", "EE"], hotspot: true, isMostPopular: true, conditions: [{ icon: "📶", label: "5G where available", detail: "Falls back to 4G/LTE in areas without 5G coverage" }] },
    { id: "gb-4", country: "United Kingdom", countryCode: "GB", data: "10GB", validity: "30 days", price: 19, speed: "5G", networks: ["Vodafone", "O2", "Three", "EE"], hotspot: true, isBestValue: true },
    { id: "gb-5", country: "United Kingdom", countryCode: "GB", data: "20GB", validity: "30 days", price: 29, speed: "5G", networks: ["Vodafone", "O2", "Three", "EE"], hotspot: true, conditions: [{ icon: "🔄", label: "Top-up available", detail: "Add more data anytime before plan expires" }] },
    { id: "gb-6", country: "United Kingdom", countryCode: "GB", data: "Unlimited", validity: "30 days", price: 45, speed: "5G", networks: ["Vodafone", "O2", "Three", "EE"], hotspot: true, conditions: [{ icon: "🐢", label: "Fair usage policy", detail: "Speed reduced to 2 Mbps after 2GB/day, resets daily at midnight" }, { icon: "📵", label: "No VoIP calls", detail: "Voice-over-IP services (WhatsApp calls, FaceTime) not supported" }] },
  ],
  US: [
    { id: "us-1", country: "United States", countryCode: "US", data: "1GB", validity: "7 days", price: 5, speed: "4G/LTE", networks: ["T-Mobile", "AT&T"], hotspot: true },
    { id: "us-2", country: "United States", countryCode: "US", data: "3GB", validity: "15 days", price: 10, speed: "4G/LTE", networks: ["T-Mobile", "AT&T"], hotspot: true, conditions: [{ icon: "📍", label: "Coverage zones", detail: "Best coverage in metro areas; rural coverage may be limited" }] },
    { id: "us-3", country: "United States", countryCode: "US", data: "5GB", validity: "30 days", price: 15, speed: "5G", networks: ["T-Mobile", "AT&T"], hotspot: true, isMostPopular: true },
    { id: "us-4", country: "United States", countryCode: "US", data: "10GB", validity: "30 days", price: 24, speed: "5G", networks: ["T-Mobile", "AT&T"], hotspot: true, isBestValue: true, conditions: [{ icon: "🔄", label: "Top-up available", detail: "Add more data anytime before plan expires" }] },
    { id: "us-5", country: "United States", countryCode: "US", data: "20GB", validity: "30 days", price: 35, speed: "5G", networks: ["T-Mobile", "AT&T"], hotspot: true, conditions: [{ icon: "📡", label: "Hotspot cap", detail: "Hotspot/tethering limited to 5GB; remaining data is device-only" }] },
    { id: "us-6", country: "United States", countryCode: "US", data: "Unlimited", validity: "30 days", price: 50, speed: "5G", networks: ["T-Mobile", "AT&T"], hotspot: true, conditions: [{ icon: "🐢", label: "Fair usage policy", detail: "Speed reduced to 3 Mbps after 1.5GB/day, resets daily" }, { icon: "📡", label: "Hotspot cap", detail: "Hotspot/tethering limited to 10GB total" }] },
  ],
  AE: [
    { id: "ae-1", country: "United Arab Emirates", countryCode: "AE", data: "1GB", validity: "7 days", price: 4.5, speed: "4G/LTE", networks: ["du", "Etisalat"], hotspot: true, conditions: [{ icon: "🚫", label: "VoIP restricted", detail: "WhatsApp calls, FaceTime & Skype are blocked by local regulations" }] },
    { id: "ae-2", country: "United Arab Emirates", countryCode: "AE", data: "3GB", validity: "15 days", price: 9, speed: "5G", networks: ["du", "Etisalat"], hotspot: true, conditions: [{ icon: "🚫", label: "VoIP restricted", detail: "WhatsApp calls, FaceTime & Skype are blocked by local regulations" }] },
    { id: "ae-3", country: "United Arab Emirates", countryCode: "AE", data: "5GB", validity: "30 days", price: 14, speed: "5G", networks: ["du", "Etisalat"], hotspot: true, isMostPopular: true, conditions: [{ icon: "🚫", label: "VoIP restricted", detail: "WhatsApp calls, FaceTime & Skype are blocked by local regulations" }, { icon: "📱", label: "Social media included", detail: "WhatsApp messaging, Instagram & TikTok don't count toward data" }] },
    { id: "ae-4", country: "United Arab Emirates", countryCode: "AE", data: "10GB", validity: "30 days", price: 22, speed: "5G", networks: ["du", "Etisalat"], hotspot: true, isBestValue: true, conditions: [{ icon: "🚫", label: "VoIP restricted", detail: "WhatsApp calls, FaceTime & Skype are blocked by local regulations" }] },
    { id: "ae-5", country: "United Arab Emirates", countryCode: "AE", data: "20GB", validity: "30 days", price: 32, speed: "5G", networks: ["du", "Etisalat"], hotspot: true, conditions: [{ icon: "🚫", label: "VoIP restricted", detail: "WhatsApp calls, FaceTime & Skype are blocked by local regulations" }, { icon: "🔄", label: "Top-up available", detail: "Add more data anytime before plan expires" }] },
    { id: "ae-6", country: "United Arab Emirates", countryCode: "AE", data: "Unlimited", validity: "30 days", price: 48, speed: "5G", networks: ["du", "Etisalat"], hotspot: true, conditions: [{ icon: "🚫", label: "VoIP restricted", detail: "WhatsApp calls, FaceTime & Skype are blocked by local regulations" }, { icon: "🐢", label: "Daily speed cap", detail: "Speed drops to 2 Mbps after 1GB/day; resets at midnight local time" }, { icon: "📡", label: "No hotspot", detail: "Tethering/hotspot is disabled on this plan" }] },
  ],
  TR: [
    { id: "tr-1", country: "Turkey", countryCode: "TR", data: "1GB", validity: "7 days", price: 5, speed: "4G/LTE", networks: ["Turkcell", "Vodafone TR"], hotspot: true },
    { id: "tr-2", country: "Turkey", countryCode: "TR", data: "3GB", validity: "15 days", price: 9, speed: "4G/LTE", networks: ["Turkcell", "Vodafone TR"], hotspot: true, conditions: [{ icon: "🌙", label: "Night bonus", detail: "Unlimited data between 1 AM – 7 AM local time" }] },
    { id: "tr-3", country: "Turkey", countryCode: "TR", data: "5GB", validity: "30 days", price: 13, speed: "4G/LTE", networks: ["Turkcell", "Vodafone TR"], hotspot: true, isMostPopular: true, conditions: [{ icon: "📱", label: "Social media bonus", detail: "Extra 2GB for WhatsApp, Instagram & YouTube" }] },
    { id: "tr-4", country: "Turkey", countryCode: "TR", data: "10GB", validity: "30 days", price: 20, speed: "4G/LTE", networks: ["Turkcell", "Vodafone TR"], hotspot: true, isBestValue: true, conditions: [{ icon: "🔄", label: "Top-up available", detail: "Add more data anytime before plan expires" }] },
    { id: "tr-5", country: "Turkey", countryCode: "TR", data: "20GB", validity: "30 days", price: 30, speed: "4G/LTE", networks: ["Turkcell", "Vodafone TR"], hotspot: true, conditions: [{ icon: "🐢", label: "Fair usage", detail: "Speed throttled to 1.5 Mbps after daily 3GB limit" }] },
  ],
};

// Default plans for countries not explicitly listed
export const defaultPlans = (country: string, code: string): EsimPlan[] => [
  { id: `${code.toLowerCase()}-1`, country, countryCode: code, data: "1GB", validity: "7 days", price: 4.5, speed: "4G/LTE", networks: ["Local Network"], hotspot: true },
  { id: `${code.toLowerCase()}-2`, country, countryCode: code, data: "3GB", validity: "15 days", price: 9, speed: "4G/LTE", networks: ["Local Network"], hotspot: true },
  { id: `${code.toLowerCase()}-3`, country, countryCode: code, data: "5GB", validity: "30 days", price: 14, speed: "5G", networks: ["Local Network"], hotspot: true, isMostPopular: true, conditions: [{ icon: "📶", label: "5G where available", detail: "Falls back to 4G/LTE in areas without 5G coverage" }] },
  { id: `${code.toLowerCase()}-4`, country, countryCode: code, data: "10GB", validity: "30 days", price: 22, speed: "5G", networks: ["Local Network"], hotspot: true, isBestValue: true },
  { id: `${code.toLowerCase()}-5`, country, countryCode: code, data: "20GB", validity: "30 days", price: 32, speed: "5G", networks: ["Local Network"], hotspot: true, conditions: [{ icon: "🔄", label: "Top-up available", detail: "Add more data anytime before plan expires" }] },
];

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
    plan: "10GB • 30 days",
    dataUsed: 3.2,
    dataTotal: 10,
    expiresAt: "2026-04-15",
    status: "active",
  },
  {
    id: "active-2",
    country: "Turkey",
    countryCode: "TR",
    plan: "5GB • 30 days",
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
  { id: "ord-1", orderNumber: "CS-20260301", country: "United Kingdom", countryCode: "GB", planSize: "10GB", price: 19, date: "2026-03-01" },
  { id: "ord-2", orderNumber: "CS-20260115", country: "Turkey", countryCode: "TR", planSize: "5GB", price: 13, date: "2026-01-15" },
  { id: "ord-3", orderNumber: "CS-20251220", country: "United Arab Emirates", countryCode: "AE", planSize: "3GB", price: 9, date: "2025-12-20" },
];

export type TierLevel = 1 | 2 | 3;

export interface TierInfo {
  level: TierLevel;
  name: string;
  emoji: string;
  minOrders: number;
  discount: number; // percentage discount on plans
  perks: string[];
}

export const tiers: TierInfo[] = [
  { level: 1, name: "Bronze Camel", emoji: "🐪", minOrders: 0, discount: 0, perks: ["Access to all plans", "Email support"] },
  { level: 2, name: "Golden Camel", emoji: "🐫", minOrders: 5, discount: 5, perks: ["5% off all plans", "Priority support", "Early access to deals"] },
  { level: 3, name: "Red Camel", emoji: "🏆🐫", minOrders: 15, discount: 10, perks: ["10% off all plans", "VIP WhatsApp support", "Exclusive bundles", "Free top-ups"] },
];

export function getUserTier(orderCount: number): TierInfo {
  if (orderCount >= 15) return tiers[2];
  if (orderCount >= 5) return tiers[1];
  return tiers[0];
}

export function getNextTier(orderCount: number): { next: TierInfo | null; ordersNeeded: number; progress: number } {
  const current = getUserTier(orderCount);
  if (current.level === 3) return { next: null, ordersNeeded: 0, progress: 100 };
  const next = tiers[current.level]; // level is 1-indexed, array is 0-indexed, so tiers[level] = next
  const ordersNeeded = next.minOrders - orderCount;
  const prevMin = tiers[current.level - 1].minOrders;
  const progress = ((orderCount - prevMin) / (next.minOrders - prevMin)) * 100;
  return { next, ordersNeeded, progress: Math.min(100, Math.max(0, progress)) };
}
