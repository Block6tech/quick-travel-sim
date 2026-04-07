
ALTER TABLE public.banner_slides ADD COLUMN title_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE public.banner_slides ADD COLUMN subtitle_ar TEXT NOT NULL DEFAULT '';

UPDATE public.banner_slides SET title_ar = 'ابقَ متصلاً،
أينما ذهبت', subtitle_ar = 'تفعيل فوري لشريحة eSIM. بدون رسوم تجوال.' WHERE sort_order = 1;

UPDATE public.banner_slides SET title_ar = 'تغطية عالمية
في أكثر من 120 دولة', subtitle_ar = 'إعداد بنقرة واحدة. باقات بيانات غير محدودة.' WHERE sort_order = 2;

UPDATE public.banner_slides SET title_ar = 'سافر بذكاء
مع eSIM', subtitle_ar = 'تخلّص من عناء الشرائح. اتصل فوراً.' WHERE sort_order = 3;
