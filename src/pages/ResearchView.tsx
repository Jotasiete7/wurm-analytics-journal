import { useParams, Navigate, NavLink } from 'react-router-dom';
import Markdown from 'react-markdown';
import { getLocalizedContent, type Document } from '../content';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { articleService } from '../services/articles';
import VoteControl from '../components/VoteControl';
import Spinner from '../components/Spinner';
import SEO from '../components/SEO';
import ShareButtons from '../components/ShareButtons';
import StructuredData from '../components/StructuredData';
import ReadingProgress from '../components/ReadingProgress';
import RelatedArticles from '../components/RelatedArticles';
import Breadcrumbs from '../components/Breadcrumbs';
import { ArrowLeft } from 'lucide-react';

const ResearchView = () => {
    const { slug } = useParams();
    const { lang } = useLanguage();
    const [doc, setDoc] = useState<Document | null>(null);
    const [allArticles, setAllArticles] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (slug) {
                const [article, articles] = await Promise.all([
                    articleService.getBySlug(slug),
                    articleService.getAll()
                ]);

                setDoc(article || null);
                setAllArticles(articles || []);

                if (article) {
                    await articleService.incrementView(article.id);
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [slug]);

    if (loading) return <Spinner />;
    if (!doc) return <Navigate to="/" replace />;

    const { title, content, excerpt } = getLocalizedContent(doc, lang);
    // Defensive fix: Replace literal "\n" characters with actual newlines if they exist
    const safeContent = content.replace(/\\n/g, '\n');

    return (
        <>
            <ReadingProgress />
            <SEO
                title={title}
                description={excerpt}
                type="article"
            />
            <StructuredData article={{
                title,
                excerpt,
                date: doc.date,
                slug: doc.slug,
                category: doc.category
            }} />

            <article className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Breadcrumbs */}
                <Breadcrumbs items={[
                    { label: doc.category, href: '/' },
                    { label: title }
                ]} />
                {/* Back Link - Minimal */}
                <div className="mb-12">
                    <NavLink to="/" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-wurm-muted hover:text-wurm-accent transition-colors">
                        <ArrowLeft size={12} />
                        <span>Return to Index</span>
                    </NavLink>
                </div>

                {/* Header - Editorial Style */}
                <header className="mb-10 md:mb-16">
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

                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-wurm-text leading-[1.15] mb-6 md:mb-8 tracking-tight">
                        {title}
                    </h1>

                    <div className="text-lg md:text-2xl text-wurm-muted font-light leading-relaxed border-l-2 border-wurm-accent/30 pl-4 md:pl-6 py-1 mb-8">
                        {excerpt}
                    </div>

                    {/* Share Buttons */}
                    <ShareButtons
                        title={title}
                        url={typeof window !== 'undefined' ? window.location.href : ''}
                    />
                </header>

                {/* Content - Typographic Focus */}
                <div className="prose prose-invert prose-lg max-w-none 
                    prose-headings:font-serif prose-headings:font-bold prose-headings:text-wurm-text
                    prose-p:font-sans prose-p:text-wurm-muted prose-p:leading-relaxed
                    prose-a:text-wurm-accent prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-wurm-text prose-strong:font-semibold
                    prose-blockquote:border-l-wurm-accent prose-blockquote:text-wurm-text prose-blockquote:font-serif prose-blockquote:italic
                    marker:text-wurm-accent">
                    <Markdown>{safeContent}</Markdown>
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

            {/* Related Articles */}
            <div className="max-w-3xl mx-auto">
                <RelatedArticles
                    currentArticle={doc}
                    allArticles={allArticles}
                    limit={3}
                />
            </div>
        </>
    );
};

export default ResearchView;
