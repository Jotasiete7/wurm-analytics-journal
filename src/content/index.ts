export type Category = 'ANALYSIS' | 'STATISTICS' | 'INVESTIGATION' | 'GUIDE';

export interface Document {
    id: string;
    slug: string;
    category: Category;
    date: string;
    votes: number;
    views: number;
    author_id?: string;

    // Bilingual Content
    title_en: string;
    title_pt: string;
    excerpt_en: string;
    excerpt_pt: string;
    content_en: string;
    content_pt: string;
}

// Helper to get current language content
export const getLocalizedContent = (doc: Document, lang: 'en' | 'pt') => ({
    title: lang === 'en' ? doc.title_en : doc.title_pt,
    excerpt: lang === 'en' ? doc.excerpt_en : doc.excerpt_pt,
    content: lang === 'en' ? doc.content_en : doc.content_pt,
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

        title_en: 'Tool Quality Does Not Affect Crushing Yield',
        title_pt: 'Qualidade da Ferramenta Não Afeta o Rendimento da Britagem',

        excerpt_en: 'Tests across QL 10–90 show no statistically relevant variance in ore output. Focus on skill gain, not tool improvement.',
        excerpt_pt: 'Testes entre QL 10-90 mostram que não há variação estatística relevante na produção de minério. Foco no ganho de skill, não na ferramenta.',

        content_en: `
# Research Question
Does the quality of the crude stone tool affect the ore yield when crushing piles, or is it purely skill-dependent?

# Methodology
- **Sample Size**: 1,000 actions.
- **Tools**: QL 10, QL 50, QL 90 Crude Stone Tools.
- **Skill Level**: Fixed at 50 Stone Cutting.

# Conclusion
Tool quality has **no measurable impact**.
`,
        content_pt: `
# Pergunta de Pesquisa
A qualidade da ferramenta (crude stone tool) afeta a quantidade de minério obtida ao britar, ou depende puramente da skill?

# Metodologia
- **Tamanho da Amostra**: 1.000 ações.
- **Ferramentas**: QL 10, QL 50, QL 90.
- **Skill**: Fixada em 50 Stone Cutting.

# Conclusão
A qualidade da ferramenta **não tem impacto mensurável**.
`
    },
    {
        id: '2',
        slug: 'lockpicking-success-rates',
        category: 'STATISTICS',
        date: '2026-01-28',
        votes: 45,
        views: 1202,

        title_en: 'Lockpicking Success: The QL 50 Threshold',
        title_pt: 'Sucesso no Lockpicking: O Limiar do QL 50',

        excerpt_en: 'Preliminary results show a linear progression in difficulty up to QL 50, after which the curve becomes exponential.',
        excerpt_pt: 'Resultados preliminares mostram progressão linear na dificuldade até QL 50, após o qual a curva se torna exponencial.',

        content_en: `
# Research Question
Determine the success rate curve for lockpicking relative to Lock Quality vs. Lockpicking Skill.

# Analysis
Preliminary results show a linear progression.
`,
        content_pt: `
# Pergunta de Pesquisa
Determinar a curva de sucesso de lockpicking relativa à Qualidade da Fechadura vs Skill.

# Análise
Resultados mostram progressão linear.
`
    }
];

export const getDocumentBySlug = (slug: string) => documents.find(d => d.slug === slug);
