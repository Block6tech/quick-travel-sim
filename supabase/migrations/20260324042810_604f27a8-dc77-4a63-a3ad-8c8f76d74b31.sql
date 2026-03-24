
-- eSIM lifecycle action log
CREATE TABLE public.esim_actions_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  action text NOT NULL, -- freeze, unfreeze, expire, extend, suspend, reactivate
  performed_by uuid NOT NULL, -- admin user id
  notes text,
  previous_status text,
  new_status text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.esim_actions_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write
CREATE POLICY "Admins can manage esim_actions_log"
  ON public.esim_actions_log
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Allow admins to update orders (for status changes)
CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));
