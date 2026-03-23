
-- Admin emails whitelist table
CREATE TABLE public.admin_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_emails ae
    JOIN auth.users u ON u.email = ae.email
    WHERE u.id = _user_id
  )
$$;

-- Admin can read the whitelist
CREATE POLICY "Admins can read admin_emails"
ON public.admin_emails FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin policies on orders: admins can see all orders
CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin policies on referral_codes: admins can see all
CREATE POLICY "Admins can view all referral_codes"
ON public.referral_codes FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin policies on referral_uses: admins can see all
CREATE POLICY "Admins can view all referral_uses"
ON public.referral_uses FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin policies on discount_codes: full CRUD
CREATE POLICY "Admins can manage discount_codes"
ON public.discount_codes FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Create a view for admin user listing (since we can't query auth.users directly)
CREATE OR REPLACE FUNCTION public.admin_get_users()
RETURNS TABLE(
  id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id, u.email, u.created_at, u.last_sign_in_at
  FROM auth.users u
  WHERE public.is_admin(auth.uid())
  ORDER BY u.created_at DESC
$$;

-- Admin stats function
CREATE OR REPLACE FUNCTION public.admin_get_stats()
RETURNS TABLE(
  total_orders bigint,
  total_revenue numeric,
  total_users bigint,
  active_orders bigint,
  total_referrals bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*) FROM public.orders),
    (SELECT coalesce(sum(plan_price - coalesce(discount_amount, 0)), 0) FROM public.orders),
    (SELECT count(*) FROM auth.users),
    (SELECT count(*) FROM public.orders WHERE status = 'active'),
    (SELECT coalesce(sum(referral_count), 0) FROM public.referral_codes)
  WHERE public.is_admin(auth.uid())
$$;
