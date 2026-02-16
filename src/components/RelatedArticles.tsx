import { NavLink } from 'react-router-dom';
import { getLocalizedContent, type Document } from '../content';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';

interface RelatedArticlesProps {
    currentArticle: Document;
    allArticles: Document[];
    limit?: number;
}

function getRelatedArticles(currentArticle: Document, allArticles: Document[], limit = 3): Document[] {
    return allArticles
        .filter(a => a.id !== currentArticle.id && a.status === 'published')
        .map(article => {
            let score = 0;

            // Same category: +10 points
            if (article.category === currentArticle.category) {
                score += 10;
            }

            // Shared tags: +5 points each
            const currentTags = currentArticle.tags || [];
            const articleTags = article.tags || [];
            const sharedTags = articleTags.filter(tag => currentTags.includes(tag)).length;
            score += sharedTags * 5;

            return { article, score };
        })
        .filter(item => item.score > 0) // Only include if there's some relation
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.article);
}

export default function RelatedArticles({ currentArticle, allArticles, limit = 3 }: RelatedArticlesProps) {
    const { lang } = useLanguage();
    const related = getRelatedArticles(currentArticle, allArticles, limit);

    if (related.length === 0) return null;

    return (
        <section className="mt-16 pt-16 border-t border-wurm-border">
            <h2 className="text-2xl font-serif font-bold text-wurm-text mb-8">
                Related Research
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
                {related.map(article => {
                    const { title, excerpt } = getLocalizedContent(article, lang);
                    return (
                        <NavLink
                            key={article.id}
                            to={`/research/${article.slug}`}
                            className="group flex flex-col"
                        >
                            <div className="flex items-center gap-2 mb-2 text-[10px] font-mono uppercase tracking-widest text-wurm-muted">
                                <span className="px-2 py-1 border border-wurm-border rounded bg-wurm-panel text-wurm-accent">
                                    {article.category}
                                </span>
                                <span>•</span>
                                <span>{article.readingTime}</span>
                            </div>

                            <h3 className="text-lg font-serif font-bold text-wurm-text group-hover:text-wurm-accent transition-colors mb-2 line-clamp-2">
                                {title}
                            </h3>

                            <p className="text-sm text-wurm-muted leading-relaxed mb-3 line-clamp-2">
                                {excerpt}
                            </p>

                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-wurm-accent font-mono mt-auto">
                                <span className="group-hover:underline">Read more</span>
                                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </NavLink>
                    );
                })}
            </div>
        </section>
    );
}
