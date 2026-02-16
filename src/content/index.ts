export type Category = 'ANALYSIS' | 'STATISTICS' | 'INVESTIGATION' | 'GUIDE';

export interface Document {
    id: string;
    slug: string;
    category: Category;
    date: string;
    votes: number;
    views: number;
    readingTime: string; // e.g. "5 min read"
    author_id?: string;
    status?: 'draft' | 'published'; // For filtering published articles
    tags?: string[]; // For filtering and related articles

    // Bilingual Content
    title_en: string;
    title_pt?: string;

    excerpt_en: string;
    excerpt_pt?: string;

    content_en: string;
    content_pt?: string;

    // Computed/Fallback helpers (for backward compatibility or unified display)
    title: string;
    excerpt: string;
    content: string;
}

// Helper to get content based on user locale (simple fallback for now)
export const getLocalizedContent = (doc: Document, lang: 'en' | 'pt' = 'pt') => {
    if (lang === 'pt' && doc.title_pt) {
        return {
            title: doc.title_pt,
            excerpt: doc.excerpt_pt || doc.excerpt_en,
            content: doc.content_pt || doc.content_en
        };
    }

    return {
        title: doc.title_en,
        excerpt: doc.excerpt_en,
        content: doc.content_en
    };
};

// Initial Mock Content
export const documents: Document[] = [
    {
        id: '1',
        slug: 'market-analysis-2024',
        category: 'ANALYSIS',
        date: '2024-03-10',
        votes: 42,
        views: 1205,
        readingTime: '8 min read',

        title_en: 'Wurm Online Market Analysis 2024',
        excerpt_en: 'A deep dive into the cross-server economy changes.',
        content_en: '# Market Analysis 2024\nThis is a comprehensive analysis of the market trends...',

        title: 'Wurm Online Market Analysis 2024',
        excerpt: 'A deep dive into the cross-server economy changes.',
        content: '# Market Analysis 2024\nThis is a comprehensive analysis of the market trends...',
    },
    {
        id: '2',
        slug: 'lockpicking-success-rates',
        category: 'STATISTICS',
        date: '2026-01-28',
        votes: 45,
        views: 1202,
        readingTime: '7 min read',

        title_en: 'Lockpicking Success: The QL 50 Threshold',
        excerpt_en: 'Preliminary results show a linear progression up to QL 50.',
        content_en: '# Research Question\nDoes lock quality affect success chance linearly?\n\n# Conclusion\nYes, up to QL 50.',

        title: 'Lockpicking Success: The QL 50 Threshold',
        excerpt: 'Preliminary results show a linear progression up to QL 50.',
        content: '# Research Question\nDoes lock quality affect success chance linearly?\n\n# Conclusion\nYes, up to QL 50.',
    }
];

export const getDocumentBySlug = (slug: string) => documents.find(d => d.slug === slug);
