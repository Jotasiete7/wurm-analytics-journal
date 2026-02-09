import { useParams, Navigate, NavLink } from 'react-router-dom';
import Markdown from 'react-markdown';
import { getLocalizedContent, type Document } from '../content';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { articleService } from '../services/articles';
import VoteControl from '../components/VoteControl';
import Spinner from '../components/Spinner';

const ResearchView = () => {
    const { slug } = useParams();
    const { lang } = useLanguage();
    const [doc, setDoc] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!slug) return;
            try {
                const data = await articleService.getBySlug(slug);
                if (data) {
                    setDoc(data);
                    // Increment view count
                    articleService.incrementView(data.id);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

    if (loading) {
        return <Spinner message="Loading analysis..." />;
    }

    if (error || !doc) {
        return <Navigate to="/" replace />;
    }

    const { title, content, excerpt } = getLocalizedContent(doc, lang);

    return <ResearchContent doc={doc} title={title} content={content} excerpt={excerpt} />;
};

const ResearchContent = ({ doc, title, content, excerpt }: { doc: Document; title: string; content: string; excerpt: string }) => {
    // SEO: Inject JSON-LD
    useEffect(() => {
        const schema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title?.substring(0, 110),
            "description": excerpt?.substring(0, 160),
            "datePublished": doc.date,
            "author": {
                "@type": "Organization",
                "name": "Wurm Analytics"
            }
        };

        const script = document.createElement('script');
        script.type = "application/ld+json";
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [doc, title, excerpt]);

    return (
        <article className="min-h-full flex flex-col animate-in fade-in duration-500">
            {/* Header */}
            <header className="mb-12 pt-8">
                <div className="flex items-center space-x-3 text-meta mb-6 opacity-60">
                    <NavLink to="/" className="hover:text-[var(--color-text-heading)] transition-colors">INDEX</NavLink>
                    <span>/</span>
                    <span className="text-[var(--color-accent)]">{doc.category}</span>
                    <span>/</span>
                    <span>{doc.date}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-heading)] leading-tight tracking-tighter mb-8">
                    {title}
                </h1>

                <div className="editorial-separator mb-8"></div>

                <div className="text-xl text-[var(--color-text-body)] font-serif italic opacity-80 leading-relaxed border-l-2 border-[var(--color-accent)] pl-6 py-1">
                    {excerpt}
                </div>
            </header>

            {/* Content Body */}
            <div className="prose prose-invert max-w-none text-[var(--color-text-body)]">
                <Markdown>{content}</Markdown>
            </div>

            {/* Vote Control */}
            <VoteControl
                docId={doc.id}
                initialVotes={doc.votes || 0}
                initialViews={doc.views || 0}
            />

            {/* Footer / Signature */}
            <div className="mt-24 pt-8 border-t border-[var(--color-border)] text-center opacity-40">
                <div className="editorial-separator mx-auto mb-4"></div>
                <p className="text-xs font-mono tracking-widest uppercase">End of Analysis</p>
            </div>
        </article>
    );
};

export default ResearchView;
