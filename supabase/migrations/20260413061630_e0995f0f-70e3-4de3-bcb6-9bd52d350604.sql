
CREATE TABLE public.terms_conditions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_en TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.terms_conditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read terms" ON public.terms_conditions FOR SELECT USING (true);

CREATE POLICY "Admins can manage terms" ON public.terms_conditions FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.update_terms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_terms_conditions_updated_at
  BEFORE UPDATE ON public.terms_conditions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_terms_updated_at();
