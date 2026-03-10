-- ──────────────────────────────────────────────────────────
-- LUMIÈRE STUDIO — DATABASE SCHEMA
-- ──────────────────────────────────────────────────────────

-- 1. TABLES
-- ──────────────────────────────────────────────────────────

-- LEADS TABLE
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    session_type TEXT CHECK (session_type IN ('Wedding', 'Portrait', 'Corporate', 'Other')),
    budget INTEGER CHECK (budget >= 0),
    preferred_date DATE,
    message TEXT,
    ai_score INTEGER CHECK (ai_score >= 1 AND ai_score <= 10),
    ai_tier TEXT CHECK (ai_tier IN ('hot', 'warm', 'cold')),
    ai_summary TEXT,
    ai_reply TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'booked', 'lost')),
    submitted_at TIMESTAMPTZ
);

-- SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    category TEXT
);

-- ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    last_login TIMESTAMPTZ
);

-- 2. FUNCTIONS & TRIGGERS
-- ──────────────────────────────────────────────────────────

-- Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to site_settings
CREATE TRIGGER tr_site_settings_updated_at
BEFORE UPDATE ON site_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- 3. SECURITY (RLS)
-- ──────────────────────────────────────────────────────────

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- LEADS POLICIES
-- Service role has full access (default)
-- Public has no access (default)
CREATE POLICY "Admins can view leads" ON leads FOR SELECT USING (true);
CREATE POLICY "Admins can update leads" ON leads FOR UPDATE USING (true);

-- SITE SETTINGS POLICIES
CREATE POLICY "Admins can view settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON site_settings FOR UPDATE USING (true);

-- ADMIN USERS POLICIES
CREATE POLICY "Admins can view own record" ON admin_users FOR SELECT USING (auth.uid() = id);

-- 4. SEED DATA
-- ──────────────────────────────────────────────────────────

-- Seed Site Settings
INSERT INTO site_settings (key, value, description, category) VALUES
('studio_name', 'Lumière Studio', 'The name of your photography studio', 'branding'),
('tagline', 'The Art of Observation', 'Main tagline displayed on the hero section', 'branding'),
('hero_text', 'Lagos-based editorial photography studio documenting legacies.', 'Description text for the hero section', 'branding'),
('about_text', 'Lumière is an editorial photography studio based in Lagos, dedicated to capturing the raw, intentional beauty of life''s most significant moments.', 'The story text for the about section', 'branding'),
('wedding_start_price', '450000', 'Starting price for wedding sessions (₦)', 'services'),
('portrait_start_price', '85000', 'Starting price for portrait sessions (₦)', 'services'),
('corporate_start_price', '200000', 'Starting price for corporate sessions (₦)', 'services'),
('hot_threshold_budget', '450000', 'Budget threshold for a lead to be considered "Hot"', 'thresholds'),
('hot_threshold_score', '8', 'AI score threshold for a lead to be considered "Hot"', 'thresholds'),
('cold_reply_template', 'Thank you for your inquiry. We have received your message and will get back to you if we are available for your requested date.', 'Default reply template for cold leads', 'templates');

-- 5. VIEWS & INDEXES
-- ──────────────────────────────────────────────────────────

-- View for Hot Leads Today
CREATE OR REPLACE VIEW hot_leads_today AS
SELECT 
    id, 
    name, 
    email, 
    session_type, 
    budget, 
    ai_score, 
    ai_summary, 
    created_at
FROM leads
WHERE ai_tier = 'hot' 
AND created_at >= CURRENT_DATE
ORDER BY ai_score DESC;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_ai_tier ON leads(ai_tier);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_settings_key ON site_settings(key);
