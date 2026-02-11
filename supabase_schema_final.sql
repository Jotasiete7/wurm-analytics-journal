-- 1. FIX PROFILES (Add role if missing)
-- This command is safe to run even if the column exists
alter table public.profiles
add column if not exists role text default 'reader' check (role in ('reader', 'editor', 'admin'));
-- 2. RESET ARTICLES (Fresh Start)
drop table if exists public.article_likes;
drop table if exists public.articles;
-- 3. RECREATE ARTICLES
create table public.articles (
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
    author_id uuid references public.profiles(id),
    status text default 'draft' check (status in ('draft', 'published', 'archived')),
    reading_time text,
    views integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    published_at timestamp with time zone,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- 4. RECREATE ENGAGEMENT
create table public.article_likes (
    user_id uuid references public.profiles(id) on delete cascade,
    article_id uuid references public.articles(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (user_id, article_id)
);
-- 5. ENABLE RLS
alter table public.profiles enable row level security;
alter table public.articles enable row level security;
alter table public.article_likes enable row level security;
-- 6. POLICIES
-- Profiles (Update existing or create new)
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles for
select using (true);
drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles for
insert with check (auth.uid() = id);
drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles for
update using (auth.uid() = id);
-- Articles
create policy "Public can view published articles" on articles for
select using (status = 'published');
create policy "Admins/Editors can view all" on articles for
select using (
        auth.uid() in (
            select id
            from profiles
            where role in ('admin', 'editor')
        )
    );
create policy "Admins/Editors can insert" on articles for
insert with check (
        auth.uid() in (
            select id
            from profiles
            where role in ('admin', 'editor')
        )
    );
create policy "Admins/Editors can update" on articles for
update using (
        auth.uid() in (
            select id
            from profiles
            where role in ('admin', 'editor')
        )
    );
create policy "Admins can delete" on articles for delete using (
    auth.uid() in (
        select id
        from profiles
        where role = 'admin'
    )
);
-- Likes
create policy "Anyone can read likes" on article_likes for
select using (true);
create policy "Authenticated users can toggle likes" on article_likes for
insert with check (auth.uid() = user_id);
create policy "Users can remove their own likes" on article_likes for delete using (auth.uid() = user_id);
-- 7. HELPER VIEW (Optional)
create or replace view article_stats as
select a.id,
    count(l.user_id) as likes_count
from articles a
    left join article_likes l on l.article_id = a.id
group by a.id;