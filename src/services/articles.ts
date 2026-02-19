import { supabase } from '../supabaseClient';
import type { Document, Category } from '../content';

// DB Interface matching Supabase Schema
interface DbArticle {
    id: string;
    slug: string;

    // Bilingual Columns
    title_en: string;
    excerpt_en: string;
    content_en: string;

    title_pt?: string;
    excerpt_pt?: string;
    content_pt?: string;

    // Legacy/Migration support (optional, can be removed if strictly migrated)
    title?: string;
    excerpt?: string;
    content?: string;

    category: Category;
    tags: string[];
    author_id: string;
    status: 'draft' | 'published' | 'archived';
    reading_time: string;
    views: number;
    created_at: string;
    published_at: string | null;
}

export const articleService = {
    async getAll(status: 'published' | 'draft' = 'published') {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('status', status)
            .order('published_at', { ascending: false });

        if (error) {
            console.error('Error fetching articles:', error);
            return [];
        }

        return (data as DbArticle[]).map(this.mapToDocument);
    },

    async getAllForAdmin() {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching articles:', error);
            return [];
        }

        return (data as DbArticle[]).map(this.mapToDocument);
    },

    async getBySlug(slug: string) {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) return null;
        return this.mapToDocument(data as DbArticle);
    },

    async incrementView(id: string) {
        // Simple increment for now. RPC is better but this works for MVP.
        const { data } = await supabase.from('articles').select('views').eq('id', id).single();
        if (data) {
            await supabase.from('articles').update({ views: (data.views || 0) + 1 }).eq('id', id);
        }
    },

    async vote(id: string) {
        try {
            const { error } = await supabase
                .from('article_likes')
                .insert([{ article_id: id }]);

            if (error) {
                // Ignore unique violation (23505) - user already voted
                if (error.code === '23505') {
                    console.log('User already voted (db constraint)');
                    return;
                }
                throw error;
            }
        } catch (err) {
            console.error('Error voting:', err);
            throw err;
        }
    },

    // Map DB structure to our frontend Document interface
    mapToDocument(dbArticle: DbArticle): Document {
        // Fallback logic: If _en columns are missing, check if legacy columns exist (during migration)
        const t_en = dbArticle.title_en || dbArticle.title || 'Untitled';
        const e_en = dbArticle.excerpt_en || dbArticle.excerpt || '';
        const c_en = dbArticle.content_en || dbArticle.content || '';

        return {
            id: dbArticle.id,
            slug: dbArticle.slug,
            category: dbArticle.category,
            date: dbArticle.published_at
                ? new Date(dbArticle.published_at).toISOString().split('T')[0]
                : new Date(dbArticle.created_at).toISOString().split('T')[0],
            votes: 0, // This is loaded separately via getStats usually, or could be joined
            views: dbArticle.views,
            readingTime: dbArticle.reading_time || '5 min read',

            // Map Fields
            title_en: t_en,
            title_pt: dbArticle.title_pt,
            excerpt_en: e_en,
            excerpt_pt: dbArticle.excerpt_pt,
            content_en: c_en,
            content_pt: dbArticle.content_pt,

            // Computed Defaults (Default to PT if available for this specific user base, or EN)
            title: dbArticle.title_pt || t_en,
            excerpt: dbArticle.excerpt_pt || e_en,
            content: dbArticle.content_pt || c_en,
        };
    },

    async getStats(id: string) {
        // Fetch views
        const { data: viewsData } = await supabase
            .from('articles')
            .select('views')
            .eq('id', id)
            .single();

        // Fetch likes count
        const { count } = await supabase
            .from('article_likes')
            .select('*', { count: 'exact', head: true })
            .eq('article_id', id);

        return {
            views: viewsData?.views || 0,
            votes: count || 0
        };
    }
};
