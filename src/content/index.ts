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

    // Single Language Content (Unified)
    title: string;
    excerpt: string;
    content: string;
}

// Helper to get current language content
// ADAPTER: Returns the same content for both languages as we migrated to single-language storage
export const getLocalizedContent = (doc: Document, _lang: 'en' | 'pt') => ({
    title: doc.title,
    excerpt: doc.excerpt,
    content: doc.content,
});

// Initial Mock Content
export const documents: Document[] = [
    {
        id: '1',
        slug: 'crushing-mechanics-deep-dive',
        category: 'ANALYSIS',
        date: '2026-02-01',
        votes: 12,
        views: 345,
        readingTime: '4 min read',

        title: 'Tool Quality Does Not Affect Crushing Yield',
        excerpt: 'Tests across QL 10–90 show no statistically relevant variance in ore output. Focus on skill gain, not tool improvement.',
        content: `
# Research Question
Does the quality of the crude stone tool affect the ore yield when crushing piles, or is purely skill-dependent?

# Methodology
- **Sample Size**: 1,000 actions.
- **Tools**: QL 10, QL 50, QL 90 Crude Stone Tools.
- **Skill Level**: Fixed at 50 Stone Cutting.

# Conclusion
Tool quality has **no measurable impact**.
`
    },
    {
        id: '2',
        slug: 'lockpicking-success-rates',
        category: 'STATISTICS',
        date: '2026-01-28',
        votes: 45,
        views: 1202,
        readingTime: '7 min read',

        title: 'Lockpicking Success: The QL 50 Threshold',
        excerpt: 'Preliminary results show a linear progression in difficulty up to QL 50, after which the curve becomes exponential.',
        content: `
# Research Question
Determine the success rate curve for lockpicking relative to Lock Quality vs. Lockpicking Skill.

# Analysis
Preliminary results show a linear progression.
`
    }
];

export const getDocumentBySlug = (slug: string) => documents.find(d => d.slug === slug);
