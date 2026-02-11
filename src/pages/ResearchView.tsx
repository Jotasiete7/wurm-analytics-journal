import { useParams, Navigate, NavLink } from 'react-router-dom';
import Markdown from 'react-markdown';
import { getLocalizedContent, type Document } from '../content';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { articleService } from '../services/articles';
import VoteControl from '../components/VoteControl';
import Spinner from '../components/Spinner';
import SEO from '../components/SEO';
import { ArrowLeft } from 'lucide-react';

const ResearchView = () => {
    const { slug } = useParams();
    const { lang } = useLanguage();
    const [doc, setDoc] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoc = async () => {
            if (slug) {
                const data = await articleService.getBySlug(slug);
                setDoc(data || null);
                if (data) {
                    await articleService.incrementView(data.id);
                }
            }
            setLoading(false);
        };
        fetchDoc();
    }, [slug]);

    if (loading) return <Spinner />;
    if (!doc) return <Navigate to="/" replace />;

    const { title, content, excerpt } = getLocalizedContent(doc, lang);

    return (
        <>
            <SEO
                title={title}
                description={excerpt}
                type="article"
            />

            <article className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Back Link - Minimal */}
                <div className="mb-12">
                    <NavLink to="/" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-wurm-muted hover:text-wurm-accent transition-colors">
                        <ArrowLeft size={12} />
                        <span>Return to Index</span>
                    </NavLink>
                </div>

                {/* Header - Editorial Style */}
                <header className="mb-16">
                    {/* Article Seal */}
                    <div className="mb-6 opacity-80">
                        <img src="/logo-sm.webp" alt="" className="h-5 w-auto object-contain" />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-6 text-[10px] font-mono uppercase tracking-widest text-wurm-muted">
                        <span className="px-2 py-1 border border-wurm-border rounded bg-wurm-panel text-wurm-accent">
                            {doc.category}
                        </span>
                        <span>•</span>
                        <span>{doc.date}</span>
                        <span>•</span>
                        <span>{doc.views} Reads</span>
                        <span>•</span>
                        <span>{doc.readingTime}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-wurm-text leading-[1.15] mb-8 tracking-tight">
                        {title}
                    </h1>

                    <div className="text-xl md:text-2xl text-wurm-muted font-light leading-relaxed border-l-2 border-wurm-accent/30 pl-6 py-1">
                        {excerpt}
                    </div>
                </header>

                {/* Content - Typographic Focus */}
                <div className="prose prose-invert prose-lg max-w-none 
                    prose-headings:font-serif prose-headings:font-bold prose-headings:text-wurm-text
                    prose-p:font-sans prose-p:text-wurm-muted prose-p:leading-relaxed
                    prose-a:text-wurm-accent prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-wurm-text prose-strong:font-semibold
                    prose-blockquote:border-l-wurm-accent prose-blockquote:text-wurm-text prose-blockquote:font-serif prose-blockquote:italic
                    marker:text-wurm-accent">
                    <Markdown>{content}</Markdown>
                </div>

                {/* Footer / Interaction */}
                <div className="mt-24 pt-12 border-t border-wurm-border/30">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-sm font-mono text-wurm-muted">
                            Did you find this analysis useful?
                        </div>
                        <VoteControl
                            docId={doc.id}
                            initialVotes={doc.votes}
                            initialViews={doc.views}
                        />
                    </div>
                </div>
            </article>
        </>
    );
};

export default ResearchView;
