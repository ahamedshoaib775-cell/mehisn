-- Supabase PostgreSQL Initial Migration for Instagram Comment-to-DM Automation Platform
-- Created: 2026-09-23

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. instagram_accounts
CREATE TABLE IF NOT EXISTS public.instagram_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    instagram_user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    profile_picture_url TEXT,
    account_type TEXT DEFAULT 'BUSINESS',
    followers_count INTEGER DEFAULT 0,
    access_token_reference TEXT,
    token_expires_at TIMESTAMPTZ,
    is_connected BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. instagram_posts
CREATE TABLE IF NOT EXISTS public.instagram_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.instagram_accounts(id) ON DELETE CASCADE,
    instagram_media_id TEXT NOT NULL,
    media_type TEXT DEFAULT 'REEL',
    caption TEXT,
    thumbnail_url TEXT,
    permalink TEXT,
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup by media_id
CREATE INDEX IF NOT EXISTS idx_instagram_posts_media_id ON public.instagram_posts(instagram_media_id);

-- 3. automations
CREATE TABLE IF NOT EXISTS public.automations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.instagram_accounts(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.instagram_posts(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    match_type TEXT DEFAULT 'exact', -- 'exact' or 'contains'
    public_reply TEXT NOT NULL DEFAULT 'Sent it to your DMs 📩✨',
    dm_message TEXT NOT NULL,
    location_name TEXT,
    location_url TEXT,
    active BOOLEAN DEFAULT true,
    trigger_count INTEGER DEFAULT 0,
    dm_sent_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for active automations lookup
CREATE INDEX IF NOT EXISTS idx_automations_post_active ON public.automations(post_id, active);

-- 4. automation_keywords
CREATE TABLE IF NOT EXISTS public.automation_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_id UUID REFERENCES public.automations(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_automation_keywords_auto_id ON public.automation_keywords(automation_id);

-- 5. automation_events (Log & Duplicate Prevention)
CREATE TABLE IF NOT EXISTS public.automation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_id UUID REFERENCES public.automations(id) ON DELETE SET NULL,
    instagram_comment_id TEXT UNIQUE NOT NULL, -- Strict duplicate prevention
    instagram_media_id TEXT NOT NULL,
    commenter_instagram_id TEXT NOT NULL,
    commenter_username TEXT,
    comment_text TEXT NOT NULL,
    public_reply_sent BOOLEAN DEFAULT false,
    dm_sent BOOLEAN DEFAULT false,
    status TEXT NOT NULL, -- 'sent', 'failed', 'duplicate', 'ignored'
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for searching events by created_at & status
CREATE INDEX IF NOT EXISTS idx_automation_events_created_at ON public.automation_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_automation_events_comment_id ON public.automation_events(instagram_comment_id);

-- ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.instagram_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_events ENABLE ROW LEVEL SECURITY;

-- instagram_accounts RLS
CREATE POLICY "Users can manage their own instagram_accounts" ON public.instagram_accounts
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- instagram_posts RLS
CREATE POLICY "Users can view and manage posts of their instagram accounts" ON public.instagram_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.instagram_accounts
            WHERE instagram_accounts.id = instagram_posts.account_id
            AND instagram_accounts.user_id = auth.uid()
        )
    );

-- automations RLS
CREATE POLICY "Users can view and manage their own automations" ON public.automations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.instagram_accounts
            WHERE instagram_accounts.id = automations.account_id
            AND instagram_accounts.user_id = auth.uid()
        )
    );

-- automation_keywords RLS
CREATE POLICY "Users can view and manage their automation_keywords" ON public.automation_keywords
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.automations
            JOIN public.instagram_accounts ON instagram_accounts.id = automations.account_id
            WHERE automations.id = automation_keywords.automation_id
            AND instagram_accounts.user_id = auth.uid()
        )
    );

-- automation_events RLS
CREATE POLICY "Users can view their automation_events" ON public.automation_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.automations
            JOIN public.instagram_accounts ON instagram_accounts.id = automations.account_id
            WHERE automations.id = automation_events.automation_id
            AND instagram_accounts.user_id = auth.uid()
        )
    );

-- Allow Service Role full access to all tables for Edge Functions
CREATE POLICY "Service role full access on instagram_accounts" ON public.instagram_accounts FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on instagram_posts" ON public.instagram_posts FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on automations" ON public.automations FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on automation_keywords" ON public.automation_keywords FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on automation_events" ON public.automation_events FOR ALL TO service_role USING (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_instagram_accounts_updated_at BEFORE UPDATE ON public.instagram_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON public.automations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
