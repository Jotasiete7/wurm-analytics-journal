import { NavLink } from 'react-router-dom';
import { getLocalizedContent, type Document } from '../content';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { articleService } from '../services/articles';
import { ArrowRight } from 'lucide-react';

const Home = () => {
    const { lang } = useLanguage();
    const [docs, setDocs] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocs = async () => {
            const data = await articleService.getAll();
            if (data) setDocs(data);
            setLoading(false);
        };
        fetchDocs();
    }, []);

    if (loading) return null;

    const featuredDoc = docs[0];
    const recentDocs = docs.slice(1);

    return (
        <div className="max-w-[var(--spacing-measure-wide)] mx-auto animate-in fade-in duration-700 relative">

            {/* HERO SECTION - Featured Article */}
            {featuredDoc && (
                <section className="mb-16 md:mb-32 relative">

                    {/* GHOST LOGO BACKGROUND */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vh] h-[120vh] opacity-[0.03] pointer-events-none select-none z-0 flex items-center justify-center overflow-hidden">
                        <img src="/logo.webp" alt="" className="w-full h-full object-contain scale-150 grayscale" />
                    </div>

                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto relative z-10 px-4">
                        <span className="mb-6 px-3 py-1 border border-wurm-accent/30 rounded-full text-[10px] font-mono uppercase tracking-widest text-wurm-accent">
                            Featured {featuredDoc.category}
                        </span>

                        <h1 className="text-3xl md:text-6xl font-serif font-bold text-wurm-text leading-[1.1] mb-6 md:mb-8 tracking-tight">
                            <NavLink to={`/research/${featuredDoc.slug}`} className="hover:text-wurm-accent transition-colors">
                                {getLocalizedContent(featuredDoc, lang).title}
                            </NavLink>
                        </h1>

                        <p className="text-base md:text-xl text-wurm-muted mb-8 md:mb-10 leading-relaxed font-light max-w-2xl">
                            {getLocalizedContent(featuredDoc, lang).excerpt}
                        </p>

                        <NavLink
                            to={`/research/${featuredDoc.slug}`}
                            className="group flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-wurm-text hover:text-wurm-accent transition-colors"
                        >
                            <span>Read Analysis</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </NavLink>
                    </div>
                </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">

                {/* LEFT COLUMN - Latest Research */}
                <div className="md:col-span-8">
                    <div className="flex items-center gap-4 mb-12">
                        <h2 className="text-xs font-mono uppercase tracking-widest text-wurm-muted">Latest Research</h2>
                        <div className="h-px bg-wurm-border flex-grow opacity-50"></div>
                    </div>

                    <div className="space-y-12">
                        {recentDocs.length > 0 ? (
                            recentDocs.map((doc) => {
                                const { title, excerpt } = getLocalizedContent(doc, lang);
                                return (
                                    <article key={doc.id} className="group flex flex-col items-start">
                                        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-wurm-muted mb-3">
                                            <span className="text-wurm-accent">{doc.category}</span>
                                            <span>•</span>
                                            <span>{doc.date}</span>
                                            <span>•</span>
                                            <span>{doc.readingTime}</span>
                                        </div>

                                        <h3 className="text-2xl font-serif font-bold text-wurm-text mb-3 leading-tight group-hover:text-wurm-accent transition-colors">
                                            <NavLink to={`/research/${doc.slug}`}>
                                                {title}
                                            </NavLink>
                                        </h3>

                                        <p className="text-wurm-muted mb-4 leading-relaxed line-clamp-2 max-w-xl">
                                            {excerpt}
                                        </p>

                                        <NavLink to={`/research/${doc.slug}`} className="text-xs text-wurm-text opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                            Read more <ArrowRight size={10} />
                                        </NavLink>
                                    </article>
                                );
                            })
                        ) : (
                            <div className="text-wurm-muted italic">No other articles found.</div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN - Trending & Topics */}
                <div className="md:col-span-4 space-y-16">

                    {/* Trending */}
                    <section>
                        <div className="flex items-center gap-4 mb-12">
                            <h2 className="text-xs font-mono uppercase tracking-widest text-wurm-muted">Trending</h2>
                            <div className="h-px bg-wurm-border flex-grow opacity-50"></div>
                        </div>

                        <div className="space-y-6">
                            {/* Mock Trending Data - In real app, sort by views */}
                            {docs.slice(0, 5).map((doc, i) => (
                                <div key={doc.id} className="flex gap-4 items-baseline group">
                                    <span className="text-3xl font-serif font-bold text-wurm-border/50 group-hover:text-wurm-accent/50 transition-colors">0{i + 1}</span>
                                    <div className="flex flex-col">
                                        <NavLink to={`/research/${doc.slug}`} className="font-medium text-wurm-text hover:text-wurm-accent transition-colors leading-snug">
                                            {getLocalizedContent(doc, lang).title}
                                        </NavLink>
                                        <span className="text-[10px] text-wurm-muted mt-1 uppercase tracking-wide">
                                            {doc.views} Reads
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Home;
