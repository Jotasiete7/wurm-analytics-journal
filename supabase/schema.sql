-- Protocol: Analytical Journal Schema
-- Author: Wurm Analytics System
create table public.articles (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone null,
    -- Core Metadata
    slug text not null,
    category text not null default 'ANALYSIS'::text,
    date date not null default CURRENT_DATE,
    author_id uuid null,
    -- Bilingual Content (Siloing Strategy)
    title_en text null,
    title_pt text null,
    excerpt_en text null,
    -- For Meta Description / Home Feed
    excerpt_pt text null,
    content_en text null,
    -- Markdown Body
    content_pt text null,
    -- Metrics
    views integer null default 0,
    constraint articles_pkey primary key (id),
    constraint articles_slug_key unique (slug)
);
-- RLS Policies (Security)
alter table public.articles enable row level security;
-- Public Read Access
create policy "Public Articles are viewable by everyone." on public.articles as permissive for
select to public using (true);
-- Authenticated Write Access (Editor Only)
create policy "Editors can insert articles" on public.articles as permissive for
insert to authenticated with check (true);
create policy "Editors can update articles" on public.articles as permissive for
update to authenticated using (true);
-- Analytics Columns
alter table public.articles
add column if not exists votes integer null default 0;
-- Atomic Increment Functions (RPC)
create or replace function increment_views(article_id uuid) returns void language sql security definer as $$
update public.articles
set views = coalesce(views, 0) + 1
where id = article_id;
$$;
create or replace function increment_votes(article_id uuid) returns void language sql security definer as $$
update public.articles
set votes = coalesce(votes, 0) + 1
where id = article_id;
$$;