
-- Discount/promo codes table
CREATE TABLE public.discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL,
  max_uses integer DEFAULT NULL,
  times_used integer NOT NULL DEFAULT 0,
  min_order_amount numeric DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  expires_at timestamp with time zone DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Referral codes table (one per user)
CREATE TABLE public.referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  referral_count integer NOT NULL DEFAULT 0,
  reward_type text NOT NULL DEFAULT 'percentage' CHECK (reward_type IN ('percentage', 'fixed')),
  reward_value numeric NOT NULL DEFAULT 10,
  friend_discount_type text NOT NULL DEFAULT 'percentage' CHECK (friend_discount_type IN ('percentage', 'fixed')),
  friend_discount_value numeric NOT NULL DEFAULT 10,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Track referral usage
CREATE TABLE public.referral_uses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code_id uuid NOT NULL REFERENCES public.referral_codes(id) ON DELETE CASCADE,
  used_by uuid NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(referral_code_id, used_by)
);

-- Add discount fields to orders
ALTER TABLE public.orders
  ADD COLUMN discount_code text DEFAULT NULL,
  ADD COLUMN discount_amount numeric DEFAULT 0;

-- RLS for discount_codes (public read for active codes)
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active discount codes" ON public.discount_codes FOR SELECT USING (active = true);

-- RLS for referral_codes
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read any referral code" ON public.referral_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own referral code" ON public.referral_codes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own referral code" ON public.referral_codes FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- RLS for referral_uses
ALTER TABLE public.referral_uses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own referral uses" ON public.referral_uses FOR SELECT TO authenticated USING (
  used_by = auth.uid() OR 
  referral_code_id IN (SELECT id FROM public.referral_codes WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert referral uses" ON public.referral_uses FOR INSERT TO authenticated WITH CHECK (auth.uid() = used_by);

-- Function to auto-generate referral code for new users
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.referral_codes (user_id, code)
  VALUES (NEW.id, 'CAMEL' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger on auth.users is not allowed, so we'll handle it in app code
