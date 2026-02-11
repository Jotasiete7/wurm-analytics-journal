import { useParams, Navigate, NavLink } from 'react-router-dom';
import Markdown from 'react-markdown';
import { getLocalizedContent, type Document } from '../content';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { articleService } from '../services/articles';
import VoteControl from '../components/VoteControl';
import Spinner from '../components/Spinner';
import SEO from '../components/SEO';
import { Calendar, ArrowLeft } from 'lucide-react';

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

    return (
        <>
            <SEO
                title={title}
                description={excerpt}
                type="article"
            />
            <ResearchContent doc={doc} title={title} content={content} excerpt={excerpt} />
        </>
    );
};

const ResearchContent = ({ doc, title, content, excerpt }: { doc: Document; title: string; content: string; excerpt: string }) => {
    // SEO: Inject JSON-LD (Schema.org)
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
        <article className="min-h-full flex flex-col animate-in fade-in duration-500 max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-12 pt-8">
                <div className="flex items-center space-x-3 text-xs font-mono mb-8 opacity-60">
                    <NavLink to="/" className="hover:text-wurm-accent transition-colors flex items-center gap-1">
                        <ArrowLeft size={12} /> INDEX
                    </NavLink>
                    <span className="text-wurm-border">/</span>
                    <span className="text-wurm-accent bg-wurm-accent/10 px-1.5 py-0.5 rounded">{doc.category}</span>
                    <span className="text-wurm-border">/</span>
                    <span className="flex items-center gap-1">
                        <Calendar size={12} /> {doc.date}
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight tracking-tight mb-8 drop-shadow-sm">
                    {title}
                </h1>

                <div className="w-20 h-1 bg-wurm-accent/30 rounded-full mb-8"></div>

                <div className="text-xl text-wurm-text/90 font-serif italic leading-relaxed border-l-4 border-wurm-accent/50 pl-6 py-2 bg-wurm-panel/30 rounded-r-lg">
                    {excerpt}
                </div>
            </header>

            {/* Content Body */}
            <div className="prose prose-invert prose-lg max-w-none 
                prose-headings:font-serif prose-headings:text-wurm-text 
                prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h2:text-wurm-accent 
                prose-p:text-wurm-muted prose-p:leading-relaxed 
                prose-strong:text-white prose-strong:font-semibold
                prose-blockquote:border-l-wurm-accent prose-blockquote:bg-wurm-panel/50 prose-blockquote:py-1 prose-blockquote:pr-2
                prose-a:text-wurm-accent prose-a:no-underline hover:prose-a:underline
                prose-code:text-wurm-accent prose-code:bg-wurm-panel prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                ">
                <Markdown>{content}</Markdown>
            </div>

            {/* Vote Control */}
            <div className="my-16 flex justify-center">
                <VoteControl
                    docId={doc.id}
                    initialVotes={doc.votes || 0}
                    initialViews={doc.views || 0}
                />
            </div>

            {/* Footer / Signature */}
            <div className="mt-12 pt-12 border-t border-wurm-border text-center opacity-40">
                <div className="w-2 h-2 bg-wurm-accent rounded-full mx-auto mb-4"></div>
                <p className="text-xs font-mono tracking-widest uppercase text-wurm-muted">End of Analysis</p>
            </div>
        </article>
    );
};

export default ResearchView;
