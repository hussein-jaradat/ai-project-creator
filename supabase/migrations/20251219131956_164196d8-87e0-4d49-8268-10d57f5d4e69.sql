-- =============================================
-- OBRAIN PRODUCTION DATABASE SCHEMA
-- Phase 1: Core Data Model (without vector embeddings)
-- =============================================

-- 1. WORKSPACES (Multi-tenant foundation)
CREATE TABLE public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    owner_id UUID NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. WORKSPACE MEMBERS (Team collaboration)
CREATE TABLE public.workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
    invited_by UUID,
    invited_at TIMESTAMPTZ DEFAULT now(),
    joined_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(workspace_id, user_id)
);

-- 3. BRAND KITS (Brand identity management)
CREATE TABLE public.brand_kits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    logo_urls JSONB DEFAULT '[]',
    color_palette JSONB DEFAULT '[]',
    typography JSONB DEFAULT '{}',
    tone_of_voice TEXT,
    keywords TEXT[],
    words_to_avoid TEXT[],
    reference_examples JSONB DEFAULT '[]',
    additional_guidelines TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. PROJECTS (Campaign containers)
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    brand_kit_id UUID REFERENCES public.brand_kits(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
    cover_image_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. CAMPAIGNS (Marketing campaigns within projects)
CREATE TABLE public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    objective TEXT CHECK (objective IN ('awareness', 'engagement', 'sales', 'launch', 'other')),
    target_audience TEXT,
    platforms TEXT[] DEFAULT '{}',
    brief JSONB DEFAULT '{}',
    selected_strategy JSONB,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'review', 'approved', 'published', 'archived')),
    workflow_stage TEXT NOT NULL DEFAULT 'brief' CHECK (workflow_stage IN ('brief', 'strategy', 'concept', 'generate', 'iterate', 'export')),
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. CREATIVE STRATEGIES (AI-proposed directions)
CREATE TABLE public.creative_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    visual_style TEXT,
    hook_idea TEXT,
    content_angle TEXT,
    example_headline TEXT,
    mood TEXT,
    energy_level TEXT CHECK (energy_level IN ('calm', 'moderate', 'energetic', 'intense')),
    is_selected BOOLEAN DEFAULT false,
    ai_reasoning TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. GENERATION JOBS (Async job queue)
CREATE TABLE public.generation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    job_type TEXT NOT NULL CHECK (job_type IN ('image', 'video', 'caption')),
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
    priority INTEGER DEFAULT 0,
    prompt TEXT NOT NULL,
    model TEXT NOT NULL,
    parameters JSONB DEFAULT '{}',
    seed TEXT,
    result_url TEXT,
    result_metadata JSONB,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    progress INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. ASSETS (Generated content storage)
CREATE TABLE public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    generation_job_id UUID REFERENCES public.generation_jobs(id) ON DELETE SET NULL,
    asset_type TEXT NOT NULL CHECK (asset_type IN ('image', 'video', 'caption')),
    name TEXT,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_size INTEGER,
    mime_type TEXT,
    dimensions JSONB,
    duration_seconds NUMERIC,
    quality_score NUMERIC,
    quality_issues JSONB DEFAULT '[]',
    is_approved BOOLEAN DEFAULT false,
    is_favorite BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. CAPTIONS (Text content for assets)
CREATE TABLE public.captions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    platform TEXT CHECK (platform IN ('instagram', 'tiktok', 'facebook', 'youtube', 'twitter', 'linkedin', 'general')),
    caption_text TEXT NOT NULL,
    hashtags TEXT[],
    call_to_action TEXT,
    tone TEXT,
    is_selected BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. EXPORT PACKAGES (Platform-specific exports)
CREATE TABLE public.export_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    platform TEXT NOT NULL,
    format_preset JSONB NOT NULL,
    assets JSONB DEFAULT '[]',
    download_url TEXT,
    expires_at TIMESTAMPTZ,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. PROJECT MEMORY (AI context persistence - without vector for now)
CREATE TABLE public.project_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    memory_type TEXT NOT NULL CHECK (memory_type IN ('summary', 'style_preference', 'successful_prompt', 'feedback')),
    content TEXT NOT NULL,
    relevance_score NUMERIC DEFAULT 1.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. AUDIT LOGS (Activity tracking)
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace ON public.workspace_members(workspace_id);
CREATE INDEX idx_projects_workspace ON public.projects(workspace_id);
CREATE INDEX idx_campaigns_project ON public.campaigns(project_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_generation_jobs_status ON public.generation_jobs(status);
CREATE INDEX idx_generation_jobs_workspace ON public.generation_jobs(workspace_id);
CREATE INDEX idx_assets_workspace ON public.assets(workspace_id);
CREATE INDEX idx_assets_campaign ON public.assets(campaign_id);
CREATE INDEX idx_audit_logs_workspace ON public.audit_logs(workspace_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Check if user is member of workspace with specific role
CREATE OR REPLACE FUNCTION public.is_workspace_member(_user_id UUID, _workspace_id UUID, _roles TEXT[] DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE user_id = _user_id
          AND workspace_id = _workspace_id
          AND (_roles IS NULL OR role = ANY(_roles))
    )
$$;

-- Get user's workspaces
CREATE OR REPLACE FUNCTION public.get_user_workspace_ids(_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT workspace_id FROM public.workspace_members WHERE user_id = _user_id
$$;

-- =============================================
-- RLS POLICIES
-- =============================================

-- WORKSPACES
CREATE POLICY "Users can view their workspaces"
ON public.workspaces FOR SELECT
USING (id IN (SELECT public.get_user_workspace_ids(auth.uid())));

CREATE POLICY "Users can create workspaces"
ON public.workspaces FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners and admins can update workspaces"
ON public.workspaces FOR UPDATE
USING (public.is_workspace_member(auth.uid(), id, ARRAY['owner', 'admin']));

CREATE POLICY "Owners can delete workspaces"
ON public.workspaces FOR DELETE
USING (owner_id = auth.uid());

-- WORKSPACE MEMBERS
CREATE POLICY "Members can view workspace members"
ON public.workspace_members FOR SELECT
USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE POLICY "Admins can manage members"
ON public.workspace_members FOR INSERT
WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id, ARRAY['owner', 'admin']));

CREATE POLICY "Admins can update members"
ON public.workspace_members FOR UPDATE
USING (public.is_workspace_member(auth.uid(), workspace_id, ARRAY['owner', 'admin']));

CREATE POLICY "Admins can remove members"
ON public.workspace_members FOR DELETE
USING (public.is_workspace_member(auth.uid(), workspace_id, ARRAY['owner', 'admin']));

-- BRAND KITS
CREATE POLICY "Members can view brand kits"
ON public.brand_kits FOR SELECT
USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE POLICY "Editors can manage brand kits"
ON public.brand_kits FOR INSERT
WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id, ARRAY['owner', 'admin', 'editor']));

CREATE POLICY "Editors can update brand kits"
ON public.brand_kits FOR UPDATE
USING (public.is_workspace_member(auth.uid(), workspace_id, ARRAY['owner', 'admin', 'editor']));

CREATE POLICY "Admins can delete brand kits"
ON public.brand_kits FOR DELETE
USING (public.is_workspace_member(auth.uid(), workspace_id, ARRAY['owner', 'admin']));

-- PROJECTS
CREATE POLICY "Members can view projects"
ON public.projects FOR SELECT
USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE POLICY "Editors can create projects"
ON public.projects FOR INSERT
WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id, ARRAY['owner', 'admin', 'editor']));

CREATE POLICY "Editors can update projects"
ON public.projects FOR UPDATE
USING (public.is_workspace_member(auth.uid(), workspace_id, ARRAY['owner', 'admin', 'editor']));

CREATE POLICY "Admins can delete projects"
ON public.projects FOR DELETE
USING (public.is_workspace_member(auth.uid(), workspace_id, ARRAY['owner', 'admin']));

-- CAMPAIGNS
CREATE POLICY "Members can view campaigns"
ON public.campaigns FOR SELECT
USING (
    project_id IN (
        SELECT id FROM public.projects 
        WHERE workspace_id IN (SELECT public.get_user_workspace_ids(auth.uid()))
    )
);

CREATE POLICY "Editors can create campaigns"
ON public.campaigns FOR INSERT
WITH CHECK (
    project_id IN (
        SELECT id FROM public.projects p
        WHERE public.is_workspace_member(auth.uid(), p.workspace_id, ARRAY['owner', 'admin', 'editor'])
    )
);

CREATE POLICY "Editors can update campaigns"
ON public.campaigns FOR UPDATE
USING (
    project_id IN (
        SELECT id FROM public.projects p
        WHERE public.is_workspace_member(auth.uid(), p.workspace_id, ARRAY['owner', 'admin', 'editor'])
    )
);

CREATE POLICY "Admins can delete campaigns"
ON public.campaigns FOR DELETE
USING (
    project_id IN (
        SELECT id FROM public.projects p
        WHERE public.is_workspace_member(auth.uid(), p.workspace_id, ARRAY['owner', 'admin'])
    )
);

-- CREATIVE STRATEGIES
CREATE POLICY "Members can view strategies"
ON public.creative_strategies FOR SELECT
USING (
    campaign_id IN (
        SELECT c.id FROM public.campaigns c
        JOIN public.projects p ON c.project_id = p.id
        WHERE p.workspace_id IN (SELECT public.get_user_workspace_ids(auth.uid()))
    )
);

CREATE POLICY "Editors can manage strategies"
ON public.creative_strategies FOR ALL
USING (
    campaign_id IN (
        SELECT c.id FROM public.campaigns c
        JOIN public.projects p ON c.project_id = p.id
        WHERE public.is_workspace_member(auth.uid(), p.workspace_id, ARRAY['owner', 'admin', 'editor'])
    )
);

-- GENERATION JOBS
CREATE POLICY "Members can view generation jobs"
ON public.generation_jobs FOR SELECT
USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE POLICY "Editors can create jobs"
ON public.generation_jobs FOR INSERT
WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id, ARRAY['owner', 'admin', 'editor']));

CREATE POLICY "System can update jobs"
ON public.generation_jobs FOR UPDATE
USING (public.is_workspace_member(auth.uid(), workspace_id, ARRAY['owner', 'admin', 'editor']));

-- ASSETS
CREATE POLICY "Members can view assets"
ON public.assets FOR SELECT
USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE POLICY "Editors can manage assets"
ON public.assets FOR INSERT
WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id, ARRAY['owner', 'admin', 'editor']));

CREATE POLICY "Editors can update assets"
ON public.assets FOR UPDATE
USING (public.is_workspace_member(auth.uid(), workspace_id, ARRAY['owner', 'admin', 'editor']));

CREATE POLICY "Admins can delete assets"
ON public.assets FOR DELETE
USING (public.is_workspace_member(auth.uid(), workspace_id, ARRAY['owner', 'admin']));

-- CAPTIONS
CREATE POLICY "Members can view captions"
ON public.captions FOR SELECT
USING (
    asset_id IN (
        SELECT id FROM public.assets 
        WHERE workspace_id IN (SELECT public.get_user_workspace_ids(auth.uid()))
    )
    OR campaign_id IN (
        SELECT c.id FROM public.campaigns c
        JOIN public.projects p ON c.project_id = p.id
        WHERE p.workspace_id IN (SELECT public.get_user_workspace_ids(auth.uid()))
    )
);

CREATE POLICY "Editors can manage captions"
ON public.captions FOR ALL
USING (
    asset_id IN (
        SELECT id FROM public.assets a
        WHERE public.is_workspace_member(auth.uid(), a.workspace_id, ARRAY['owner', 'admin', 'editor'])
    )
    OR campaign_id IN (
        SELECT c.id FROM public.campaigns c
        JOIN public.projects p ON c.project_id = p.id
        WHERE public.is_workspace_member(auth.uid(), p.workspace_id, ARRAY['owner', 'admin', 'editor'])
    )
);

-- EXPORT PACKAGES
CREATE POLICY "Members can view exports"
ON public.export_packages FOR SELECT
USING (
    campaign_id IN (
        SELECT c.id FROM public.campaigns c
        JOIN public.projects p ON c.project_id = p.id
        WHERE p.workspace_id IN (SELECT public.get_user_workspace_ids(auth.uid()))
    )
);

CREATE POLICY "Editors can manage exports"
ON public.export_packages FOR ALL
USING (
    campaign_id IN (
        SELECT c.id FROM public.campaigns c
        JOIN public.projects p ON c.project_id = p.id
        WHERE public.is_workspace_member(auth.uid(), p.workspace_id, ARRAY['owner', 'admin', 'editor'])
    )
);

-- PROJECT MEMORY
CREATE POLICY "Members can view memory"
ON public.project_memory FOR SELECT
USING (
    project_id IN (
        SELECT id FROM public.projects 
        WHERE workspace_id IN (SELECT public.get_user_workspace_ids(auth.uid()))
    )
);

CREATE POLICY "System can manage memory"
ON public.project_memory FOR ALL
USING (
    project_id IN (
        SELECT id FROM public.projects p
        WHERE public.is_workspace_member(auth.uid(), p.workspace_id, ARRAY['owner', 'admin', 'editor'])
    )
);

-- AUDIT LOGS (Read-only for members, insert via system)
CREATE POLICY "Members can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.is_workspace_member(auth.uid(), workspace_id));

CREATE POLICY "System can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (public.is_workspace_member(auth.uid(), workspace_id));

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON public.workspaces
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brand_kits_updated_at BEFORE UPDATE ON public.brand_kits
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- AUTO-CREATE WORKSPACE MEMBER ON WORKSPACE CREATE
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_workspace()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.workspace_members (workspace_id, user_id, role, joined_at)
    VALUES (NEW.id, NEW.owner_id, 'owner', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_workspace_created
    AFTER INSERT ON public.workspaces
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_workspace();