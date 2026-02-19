-- setup_likes.sql (CORRIGIDO)
-- Remove referências a Sequences, já que usamos UUID
-- 1. Create table
CREATE TABLE IF NOT EXISTS article_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT DEFAULT NULL,
    -- Populated by trigger
    CONSTRAINT unique_like_per_ip UNIQUE (article_id, ip_address)
);
-- 2. IP Extraction Function (Robust for Cloudflare/Supabase)
CREATE OR REPLACE FUNCTION get_request_ip() RETURNS TEXT AS $$
DECLARE headers json;
BEGIN -- Safely get headers. If null, return 'unknown'
BEGIN headers := current_setting('request.headers', true)::json;
EXCEPTION
WHEN OTHERS THEN RETURN 'unknown';
END;
RETURN COALESCE(
    headers->>'cf-connecting-ip',
    headers->>'x-forwarded-for',
    'unknown'
);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- SECURITY DEFINER allows accessing headers even if user has restricted permissions
-- 3. Trigger Function
CREATE OR REPLACE FUNCTION set_vote_ip() RETURNS TRIGGER AS $$ BEGIN NEW.ip_address := get_request_ip();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- 4. Apply Trigger
DROP TRIGGER IF EXISTS trigger_set_vote_ip ON article_likes;
CREATE TRIGGER trigger_set_vote_ip BEFORE
INSERT ON article_likes FOR EACH ROW EXECUTE FUNCTION set_vote_ip();
-- 5. Enable RLS
ALTER TABLE article_likes ENABLE ROW LEVEL SECURITY;
-- 6. Policies
DROP POLICY IF EXISTS "Public can read likes" ON article_likes;
CREATE POLICY "Public can read likes" ON article_likes FOR
SELECT USING (true);
DROP POLICY IF EXISTS "Public can vote" ON article_likes;
CREATE POLICY "Public can vote" ON article_likes FOR
INSERT WITH CHECK (true);
-- 7. Grant Permissions (Corrected: No Sequence)
GRANT SELECT,
    INSERT ON article_likes TO anon,
    authenticated;
SELECT 'Tabela article_likes criada com sucesso!' as status;