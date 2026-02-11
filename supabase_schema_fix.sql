-- 1. INSPECT & FIX PROFILES (Shared Table)
-- We do NOT drop this table as it is shared. We ensure columns exist.
-- Create table if it doesn't exist
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique,
    role text default 'reader' check (role in ('reader', 'editor', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- 2. RESET ARTICLES (Since you authorized deleting data)
drop table if exists public.article_likes;
drop table if exists public.articles;
-- 3. RECREATE ARTICLES with all columns
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
-- Profiles
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
create policy "Admins can view all" on articles for
select using (
        auth.uid() in (
            select id
            from profiles
            where role = 'admin'
        )
    );
create policy "Admins can insert" on articles for
insert with check (
        auth.uid() in (
            select id
            from profiles
            where role = 'admin'
        )
    );
create policy "Admins can update" on articles for
update using (
        auth.uid() in (
            select id
            from profiles
            where role = 'admin'
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
-- 7. HELPER: Check my Role
-- Run this query in Supabase SQL editor to see who you are
-- select * from profiles where id = auth.uid();