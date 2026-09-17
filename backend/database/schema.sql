-- 1. Pastikan kolom koordinat ada pada fishing_spots
ALTER TABLE IF EXISTS public.fishing_spots
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION DEFAULT -6.200000,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION DEFAULT 106.816666;

UPDATE public.fishing_spots SET latitude = -6.136000, longitude = 106.877000 WHERE name ILIKE '%Sunter%';
UPDATE public.fishing_spots SET latitude = -6.168000, longitude = 106.758000 WHERE name ILIKE '%Galatama%';
UPDATE public.fishing_spots SET latitude = -6.597000, longitude = 106.799000 WHERE name ILIKE '%Saung Desa%';
UPDATE public.fishing_spots SET latitude = -6.524000, longitude = 107.387000 WHERE name ILIKE '%Jatiluhur%';

-- 2. Tabel Reviews (Ulasan & Rating)
CREATE TABLE IF NOT EXISTS public.reviews (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  spot_id BIGINT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_spot_id ON public.reviews(spot_id);

-- Aktifkan RLS dan berikan izin akses publik
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- 3. Tabel Bookmarks (Spot Favorit)
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_email TEXT NOT NULL,
  spot_id BIGINT NOT NULL,
  UNIQUE(user_email, spot_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_email);

-- Aktifkan RLS dan berikan izin akses publik
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow public read bookmarks" ON public.bookmarks FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public insert bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow public delete bookmarks" ON public.bookmarks FOR DELETE USING (true);
