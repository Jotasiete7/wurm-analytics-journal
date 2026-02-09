import { NavLink } from 'react-router-dom';
import { getLocalizedContent, type Document } from '../content';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { articleService } from '../services/articles';
import Spinner from '../components/Spinner';

const Home = () => {
    const { lang } = useLanguage();
    const [docs, setDocs] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocs = async () => {
            const data = await articleService.getAll();
            if (data) {
                setDocs(data);
            }
            setLoading(false);
        };
        fetchDocs();
    }, []);

    if (loading) {
        return <Spinner message="Loading journal..." />;
    }

    if (docs.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-[var(--color-text-body)] opacity-50">
                <div className="text-6xl mb-4 opacity-30">📊</div>
                <span className="font-mono text-sm uppercase tracking-wider">Archive Empty</span>
                <p className="text-xs mt-2 opacity-60">No research published yet.</p>
            </div>
        );
    }

    // Sort by date (already sorted by Supabase but good to be safe)
    const sortedDocs = [...docs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Feature the latest, list the rest
    const featured = sortedDocs[0];
    const feed = sortedDocs.slice(1);

    const featuredContent = getLocalizedContent(featured, lang);

    return (
        <section>
            {/* FEATURED STORY */}
            <div className="mb-24 pt-8 text-center animate-in fade-in duration-700 relative">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent)]/5 via-transparent to-transparent rounded-lg blur-3xl -z-10"></div>

                <div className="flex items-center justify-center space-x-3 text-meta mb-6 opacity-80">
                    <span className="text-[var(--color-accent)]">New Arrival</span>
                    <span>/</span>
                    <span>{featured.category}</span>
                </div>

                <NavLink to={`/research/${featured.slug}`} className="block group">
                    <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-text-heading)] leading-[1.1] mb-6 tracking-tighter hover:text-[var(--color-accent)] transition-colors">
                        {featuredContent.title}
                    </h1>
                </NavLink>

                <p className="text-xl text-[var(--color-text-body)] leading-relaxed max-w-2xl mx-auto mb-8 font-serif italic opacity-90">
                    {featuredContent.excerpt}
                </p>

                <NavLink to={`/research/${featured.slug}`} className="inline-block text-sm text-[var(--color-accent)] hover:text-white border-b border-[var(--color-accent)] hover:border-white transition-all pb-0.5 tracking-widest uppercase font-mono">
                    {lang === 'en' ? 'Read Analysis' : 'Ler Análise'}
                </NavLink>

                <div className="editorial-separator mt-16"></div>
            </div>

            {/* CHRONOLOGICAL FEED */}
            <div className="space-y-20 layout-reading">
                {feed.map(doc => {
                    const content = getLocalizedContent(doc, lang);
                    return (
                        <article key={doc.id} className="group flex flex-col md:flex-row md:items-baseline md:space-x-8 hover:translate-x-2 transition-all duration-300">
                            <div className="text-meta opacity-50 mb-2 md:mb-0 w-32 shrink-0">
                                {doc.date}
                            </div>

                            <div>
                                <NavLink to={`/research/${doc.slug}`} className="block">
                                    <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-3 group-hover:underline decoration-[var(--color-border)] underline-offset-4 decoration-1">
                                        {content.title}
                                    </h2>
                                </NavLink>
                                <p className="text-[var(--color-text-meta)] leading-relaxed text-base mb-3 max-w-xl">
                                    {content.excerpt}
                                </p>
                                <div className="flex items-center space-x-3 text-xs font-mono text-[var(--color-text-meta)] opacity-60">
                                    <span>{doc.category}</span>
                                    <span>•</span>
                                    <span>{doc.views} {lang === 'en' ? 'READS' : 'LEITURAS'}</span>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {feed.length === 0 && (
                <div className="text-center text-meta opacity-30 mt-12">
                    {lang === 'en' ? 'End of Journal Index' : 'Fim do Índice'}
                </div>
            )}
        </section>
    );
};

export default Home;
