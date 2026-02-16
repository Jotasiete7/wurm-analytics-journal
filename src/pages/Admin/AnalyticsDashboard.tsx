import { useEffect, useState } from 'react';
import { articleService } from '../../services/articles';
import { TrendingUp, Eye, ThumbsUp, FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { getLocalizedContent, type Document } from '../../content';
import { useLanguage } from '../../contexts/LanguageContext';

interface DashboardStats {
    totalViews: number;
    totalVotes: number;
    totalArticles: number;
    topArticles: Document[];
}

export default function AnalyticsDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalViews: 0,
        totalVotes: 0,
        totalArticles: 0,
        topArticles: []
    });
    const [loading, setLoading] = useState(true);
    const { lang } = useLanguage();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const articles = await articleService.getAll();

                const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
                const totalVotes = articles.reduce((sum, a) => sum + (a.votes || 0), 0);

                // Sort by views descending
                const topArticles = [...articles]
                    .sort((a, b) => (b.views || 0) - (a.views || 0))
                    .slice(0, 5);

                setStats({
                    totalViews,
                    totalVotes,
                    totalArticles: articles.length,
                    topArticles
                });
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-wurm-panel w-48"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-wurm-panel"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-serif font-bold text-wurm-text mb-2">Analytics Dashboard</h1>
                <p className="text-sm text-wurm-muted">Overview of your content performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Views */}
                <div className="p-6 border border-wurm-border bg-wurm-panel/50">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs uppercase tracking-widest text-wurm-muted font-mono">Total Views</span>
                        <Eye size={20} className="text-wurm-accent" />
                    </div>
                    <div className="text-3xl font-bold text-wurm-text">{stats.totalViews.toLocaleString()}</div>
                </div>

                {/* Total Votes */}
                <div className="p-6 border border-wurm-border bg-wurm-panel/50">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs uppercase tracking-widest text-wurm-muted font-mono">Total Votes</span>
                        <ThumbsUp size={20} className="text-wurm-accent" />
                    </div>
                    <div className="text-3xl font-bold text-wurm-text">{stats.totalVotes.toLocaleString()}</div>
                </div>

                {/* Total Articles */}
                <div className="p-6 border border-wurm-border bg-wurm-panel/50">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs uppercase tracking-widest text-wurm-muted font-mono">Total Articles</span>
                        <FileText size={20} className="text-wurm-accent" />
                    </div>
                    <div className="text-3xl font-bold text-wurm-text">{stats.totalArticles}</div>
                </div>
            </div>

            {/* Top Articles */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp size={20} className="text-wurm-accent" />
                    <h2 className="text-xl font-serif font-bold text-wurm-text">Top Articles</h2>
                </div>

                <div className="border border-wurm-border overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 bg-wurm-panel border-b border-wurm-border text-xs uppercase tracking-widest text-wurm-muted font-mono">
                        <div className="col-span-6 md:col-span-7">Article</div>
                        <div className="col-span-3 md:col-span-2 text-right">Views</div>
                        <div className="col-span-3 md:col-span-2 text-right">Votes</div>
                        <div className="hidden md:block md:col-span-1 text-right">Action</div>
                    </div>

                    {/* Table Body */}
                    {stats.topArticles.map((article, index) => {
                        const { title } = getLocalizedContent(article, lang);
                        return (
                            <div
                                key={article.id}
                                className="grid grid-cols-12 gap-4 p-4 border-b border-wurm-border last:border-b-0 hover:bg-wurm-panel/30 transition-colors"
                            >
                                <div className="col-span-6 md:col-span-7 flex items-center gap-3">
                                    <span className="text-2xl font-serif font-bold text-wurm-border/50">
                                        {index + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <div className="text-sm text-wurm-text truncate">{title}</div>
                                        <div className="text-xs text-wurm-muted uppercase tracking-wider font-mono">
                                            {article.category}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-3 md:col-span-2 flex items-center justify-end">
                                    <span className="text-sm font-mono text-wurm-text">
                                        {(article.views || 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="col-span-3 md:col-span-2 flex items-center justify-end">
                                    <span className="text-sm font-mono text-wurm-text">
                                        {article.votes || 0}
                                    </span>
                                </div>
                                <div className="hidden md:flex md:col-span-1 items-center justify-end">
                                    <NavLink
                                        to={`/research/${article.slug}`}
                                        className="text-xs text-wurm-accent hover:underline"
                                    >
                                        View
                                    </NavLink>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
