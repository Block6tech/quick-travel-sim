
-- Orders table to store purchased eSIM plans
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  plan_data TEXT NOT NULL,
  plan_validity TEXT NOT NULL,
  plan_speed TEXT NOT NULL,
  plan_price NUMERIC NOT NULL,
  phone_number TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  data_used NUMERIC NOT NULL DEFAULT 0,
  data_total NUMERIC NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can only read their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
