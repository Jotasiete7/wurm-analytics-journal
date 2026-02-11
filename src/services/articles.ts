import { supabase } from '../supabaseClient';
import type { Document, Category } from '../content';

// DB Interface matching Supabase Schema
interface DbArticle {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
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
        // Placeholder for Likes implementation
        console.log('Vote/Like logic to be implemented with proper Auth', id);
    },

    // Map DB structure to our frontend Document interface
    mapToDocument(dbArticle: DbArticle): Document {
        return {
            id: dbArticle.id,
            slug: dbArticle.slug,
            category: dbArticle.category,
            date: dbArticle.published_at
                ? new Date(dbArticle.published_at).toISOString().split('T')[0]
                : new Date(dbArticle.created_at).toISOString().split('T')[0],
            votes: 0, // Likes count to be fetched separately or joined
            views: dbArticle.views,
            readingTime: dbArticle.reading_time || '5 min read',
            title_en: dbArticle.title,
            title_pt: dbArticle.title,
            excerpt_en: dbArticle.excerpt || '',
            excerpt_pt: dbArticle.excerpt || '',
            content_en: dbArticle.content,
            content_pt: dbArticle.content,
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
