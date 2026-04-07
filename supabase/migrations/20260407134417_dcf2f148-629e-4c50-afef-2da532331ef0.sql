
-- Create banner_slides table
CREATE TABLE public.banner_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.banner_slides ENABLE ROW LEVEL SECURITY;

-- Anyone can read active slides
CREATE POLICY "Anyone can read active banner slides"
ON public.banner_slides
FOR SELECT
TO public
USING (active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage banner slides"
ON public.banner_slides
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Create storage bucket for banner images
INSERT INTO storage.buckets (id, name, public) VALUES ('banner-images', 'banner-images', true);

-- Anyone can view banner images
CREATE POLICY "Anyone can view banner images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'banner-images');

-- Admins can upload banner images
CREATE POLICY "Admins can upload banner images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'banner-images' AND public.is_admin(auth.uid()));

-- Admins can update banner images
CREATE POLICY "Admins can update banner images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'banner-images' AND public.is_admin(auth.uid()));

-- Admins can delete banner images
CREATE POLICY "Admins can delete banner images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'banner-images' AND public.is_admin(auth.uid()));

-- Seed with 3 default slides
INSERT INTO public.banner_slides (title, subtitle, image_url, sort_order) VALUES
('Stay connected,
anywhere you go', 'Instant eSIM activation. No roaming fees.', '', 1),
('Global coverage
in 120+ countries', 'One tap setup. Unlimited data plans.', '', 2),
('Travel smarter
with eSIM', 'Skip the SIM card hassle. Connect instantly.', '', 3);
