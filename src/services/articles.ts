import { supabase } from '../supabaseClient';
import type { Document } from '../content';

export const articleService = {
    async getBySlug(slug: string) {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Error fetching article:', error);
            return null;
        }

        return data as Document;
    },

    async getAll() {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching articles:', error);
            return null;
        }

        return data as Document[];
    },

    async incrementView(id: string) {
        const { error } = await supabase.rpc('increment_views', { article_id: id });
        if (error) console.error('Error incrementing view:', error);
    },

    async vote(id: string) {
        const { error } = await supabase.rpc('increment_votes', { article_id: id });
        if (error) {
            console.error('Error voting:', error);
            throw error;
        }
    },

    async getStats(id: string) {
        const { data, error } = await supabase
            .from('articles')
            .select('views, votes')
            .eq('id', id)
            .single();

        if (error) return null;
        return data;
    }
};
