
-- Referral program defaults (single-row config)
CREATE TABLE public.referral_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  default_reward_type TEXT NOT NULL DEFAULT 'percentage',
  default_reward_value NUMERIC NOT NULL DEFAULT 10,
  default_friend_discount_type TEXT NOT NULL DEFAULT 'percentage',
  default_friend_discount_value NUMERIC NOT NULL DEFAULT 10,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read referral_settings" ON public.referral_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage referral_settings" ON public.referral_settings FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Camel Tier definitions
CREATE TABLE public.camel_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  level INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '🐪',
  min_orders INTEGER NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  perks TEXT[] NOT NULL DEFAULT '{}',
  perks_ar TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.camel_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read camel_tiers" ON public.camel_tiers FOR SELECT USING (true);
CREATE POLICY "Admins can manage camel_tiers" ON public.camel_tiers FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Seed default referral settings
INSERT INTO public.referral_settings (default_reward_type, default_reward_value, default_friend_discount_type, default_friend_discount_value)
VALUES ('percentage', 10, 'percentage', 10);

-- Seed default tiers
INSERT INTO public.camel_tiers (level, name, emoji, min_orders, discount, perks, perks_ar) VALUES
(1, 'Bronze Camel', '🐪', 0, 0, ARRAY['Access to all plans', 'Email support'], ARRAY['الوصول لجميع الباقات', 'دعم بالبريد الإلكتروني']),
(2, 'Golden Camel', '🐫', 5, 5, ARRAY['5% off all plans', 'Priority support', 'Early access to deals'], ARRAY['خصم 5% على جميع الباقات', 'دعم بالأولوية', 'وصول مبكر للعروض']),
(3, 'Red Camel', '🏆🐫', 15, 10, ARRAY['10% off all plans', 'VIP WhatsApp support', 'Exclusive bundles', 'Free top-ups'], ARRAY['خصم 10% على جميع الباقات', 'دعم VIP عبر واتساب', 'باقات حصرية', 'شحن مجاني']);
