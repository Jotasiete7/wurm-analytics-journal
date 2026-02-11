import { NavLink } from 'react-router-dom';
import { getLocalizedContent, type Document } from '../content';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { articleService } from '../services/articles';
import Spinner from '../components/Spinner';
import { Calendar, BarChart2, ArrowRight } from 'lucide-react';

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
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-wurm-muted opacity-50">
                <BarChart2 size={48} className="mb-4 opacity-30" />
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
        <section className="animate-in fade-in duration-700">
            {/* FEATURED STORY HERO */}
            <div className="mb-24 relative group cursor-pointer">
                <NavLink to={`/research/${featured.slug}`} className="block">
                    <div className="absolute inset-0 bg-gradient-to-b from-wurm-accent/5 via-transparent to-transparent rounded-3xl blur-3xl -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="text-center py-12 md:py-20 border-b border-wurm-border/50">
                        <div className="flex items-center justify-center gap-3 text-xs font-mono tracking-widest text-wurm-accent mb-6 uppercase">
                            <span className="bg-wurm-accent/10 px-2 py-1 rounded">{featured.category}</span>
                            <span className="text-wurm-muted">•</span>
                            <span>New Arrival</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight mb-8 max-w-4xl mx-auto group-hover:text-wurm-accent transition-colors duration-300">
                            {featuredContent.title}
                        </h1>

                        <p className="text-lg md:text-xl text-wurm-text/80 leading-relaxed max-w-2xl mx-auto mb-10 font-serif italic">
                            {featuredContent.excerpt}
                        </p>

                        <div className="inline-flex items-center gap-2 text-sm font-mono text-wurm-accent border border-wurm-accent/30 rounded-full px-6 py-2 group-hover:bg-wurm-accent group-hover:text-black transition-all duration-300">
                            {lang === 'en' ? 'Read Analysis' : 'Ler Análise'} <ArrowRight size={14} />
                        </div>
                    </div>
                </NavLink>
            </div>

            {/* RESEARCH GRID */}
            {feed.length > 0 && (
                <div className="space-y-12">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-serif font-bold text-white">
                            {lang === 'en' ? 'Recent Findings' : 'Descobertas Recentes'}
                        </h2>
                        <div className="h-px bg-wurm-border flex-grow"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {feed.map(doc => {
                            const content = getLocalizedContent(doc, lang);
                            return (
                                <NavLink
                                    key={doc.id}
                                    to={`/research/${doc.slug}`}
                                    className="group flex flex-col bg-wurm-panel border border-wurm-border rounded-xl overflow-hidden hover:border-wurm-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-wurm-accent/5 hover:-translate-y-1"
                                >
                                    <div className="p-6 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-mono uppercase tracking-widest text-wurm-accent bg-wurm-accent/5 px-2 py-1 rounded border border-wurm-accent/10">
                                                {doc.category}
                                            </span>
                                            <div className="flex items-center gap-1 text-[10px] font-mono text-wurm-muted">
                                                <Calendar size={12} />
                                                {doc.date}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-serif font-bold text-wurm-text group-hover:text-wurm-accent transition-colors mb-3 line-clamp-2">
                                            {content.title}
                                        </h3>

                                        <p className="text-sm text-wurm-muted leading-relaxed mb-6 line-clamp-3 flex-grow">
                                            {content.excerpt}
                                        </p>

                                        <div className="pt-4 border-t border-wurm-border/50 flex justify-between items-center mt-auto">
                                            <div className="flex items-center gap-1.5 text-xs text-wurm-muted">
                                                <BarChart2 size={14} />
                                                <span>{doc.views} {lang === 'en' ? 'reads' : 'leituras'}</span>
                                            </div>
                                            <div className="text-wurm-accent opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Home;
