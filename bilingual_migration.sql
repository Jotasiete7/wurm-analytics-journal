-- Migration: Enable Bilingual (EN/PT) Support for Articles
-- 1. Rename existing columns to English (assuming current content is EN or primary)
ALTER TABLE public.articles
    RENAME COLUMN title TO title_en;
ALTER TABLE public.articles
    RENAME COLUMN excerpt TO excerpt_en;
ALTER TABLE public.articles
    RENAME COLUMN content TO content_en;
-- 2. Add Portuguese columns (nullable, as older articles might not have them immediately)
ALTER TABLE public.articles
ADD COLUMN title_pt text;
ALTER TABLE public.articles
ADD COLUMN excerpt_pt text;
ALTER TABLE public.articles
ADD COLUMN content_pt text;
-- 3. Update RLS policies if necessary (standard policies usually ignore column names, so mostly fine)
-- Policies typically check 'auth.uid()', 'status', etc., not content columns.
-- 4. Verify
-- select * from public.articles limit 1;