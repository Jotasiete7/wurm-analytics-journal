-- 1. Profiles (Shared ecosystem table)
-- We use "if not exists" because this might already be created by the "Recipes" app
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique,
    role text default 'reader' check (role in ('reader', 'editor', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Enable RLS on profiles
alter table public.profiles enable row level security;
-- Policies for profiles
create policy "Public profiles are viewable by everyone." on profiles for
select using (true);
create policy "Users can insert their own profile." on profiles for
insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for
update using (auth.uid() = id);
-- 2. Articles Table
create table if not exists public.articles (
    id uuid default gen_random_uuid() primary key,
    slug text unique not null,
    title text not null,
    excerpt text,
    content text not null,
    category text not null check (
        category in (
            'ANALYSIS',
            'STATISTICS',
            'INVESTIGATION',
            'GUIDE'
        )
    ),
    tags text [] default '{}',
    -- For subcategories/mixtures (e.g. ['Market', 'Skills'])
    author_id uuid references public.profiles(id),
    status text default 'draft' check (status in ('draft', 'published', 'archived')),
    reading_time text,
    -- Stores "5 min read"
    views integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    published_at timestamp with time zone,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Enable RLS
alter table public.articles enable row level security;
-- 3. Article Likes (Engagement)
create table if not exists public.article_likes (
    user_id uuid references public.profiles(id) on delete cascade,
    article_id uuid references public.articles(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (user_id, article_id)
);
alter table public.article_likes enable row level security;
-- 4. Storage Bucket for Article Images
-- Note: Buckets are usually created via UI, but here is the policy logic
-- (You must create a bucket named 'article-images' in the Storage dashboard)
-- RLS POLICIES FOR ARTICLES
-- READ: Everyone can see published articles
create policy "Public can view published articles" on articles for
select using (status = 'published');
-- READ: Editors/Admins can see everything (including drafts)
create policy "Editors can view all articles" on articles for
select using (
        auth.uid() in (
            select id
            from profiles
            where role in ('editor', 'admin')
        )
    );
-- INSERT: Only Editors/Admins
create policy "Editors can insert articles" on articles for
insert with check (
        auth.uid() in (
            select id
            from profiles
            where role in ('editor', 'admin')
        )
    );
-- UPDATE: Editors/Admins
create policy "Editors can update articles" on articles for
update using (
        auth.uid() in (
            select id
            from profiles
            where role in ('editor', 'admin')
        )
    );
-- DELETE: Admins only
create policy "Admins can delete articles" on articles for delete using (
    auth.uid() in (
        select id
        from profiles
        where role = 'admin'
    )
);
-- RLS POLICIES FOR LIKES
create policy "Anyone can read likes" on article_likes for
select using (true);
create policy "Authenticated users can toggle likes" on article_likes for
insert with check (auth.uid() = user_id);
create policy "Users can remove their own likes" on article_likes for delete using (auth.uid() = user_id);
-- 5. Helpful Views (Optional)
create or replace view article_stats as
select a.id,
    count(l.user_id) as likes_count
from articles a
    left join article_likes l on l.article_id = a.id
group by a.id;