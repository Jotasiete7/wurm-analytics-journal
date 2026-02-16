import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2, LogOut, Eye } from 'lucide-react';
import { articleService } from '../../services/articles';
import type { Document } from '../../content';

const Dashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [articles, setArticles] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchArticles = async () => {
        setLoading(true);
        const data = await articleService.getAllForAdmin();
        if (data) {
            setArticles(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleLogout = async () => {
        await signOut();
        navigate('/admin');
    };

    const handleDelete = async (id: string, slug: string) => {
        if (!window.confirm(`Are you sure you want to delete "${slug}"? This cannot be undone.`)) {
            return;
        }

        setDeleting(id);
        const { error } = await supabase
            .from('articles')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting article:', error);
            alert('Failed to delete article');
        } else {
            setArticles(articles.filter(a => a.id !== id));
        }
        setDeleting(null);
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-body)] text-[var(--color-text-body)] font-mono text-sm">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full bg-[var(--color-bg-body)] border-b border-[var(--color-border)] p-4 flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    <span className="text-[var(--color-text-heading)] font-bold">WURM OPS // DASHBOARD</span>
                    <span className="text-xs text-[var(--color-text-meta)] uppercase">{user?.email}</span>
                </div>
                <div className="flex gap-4">
                    <NavLink to="/" className="flex items-center gap-2 hover:text-[var(--color-accent)] uppercase tracking-wider">
                        <Eye size={14} />
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/admin/editor" className="flex items-center gap-2 hover:text-[var(--color-accent)] uppercase tracking-wider">
                        <Plus size={14} />
                        <span>New Record</span>
                    </NavLink>
                    <button onClick={handleLogout} className="flex items-center gap-2 hover:text-red-400 uppercase tracking-wider">
                        <LogOut size={14} />
                        <span>Exit</span>
                    </button>
                </div>
            </div>

            <div className="pt-24 pb-32 px-8 max-w-[1200px] mx-auto">
                <h1 className="text-2xl font-bold text-[var(--color-text-heading)] mb-8 uppercase tracking-widest">
                    Transmission Log
                </h1>

                {loading ? (
                    <div className="opacity-50 animate-pulse">Scanning records...</div>
                ) : (
                    <div className="border border-[var(--color-border)]">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] uppercase text-xs tracking-wider opacity-70">
                            <div className="col-span-4">Title / Slug</div>
                            <div className="col-span-2">Category</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-2">Metrics</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        {/* Table Body */}
                        {articles.length === 0 ? (
                            <div className="p-8 text-center opacity-50">No records found.</div>
                        ) : (
                            articles.map(article => (
                                <div key={article.id} className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)] transition-colors items-center group">
                                    <div className="col-span-4">
                                        <div className="font-bold text-[var(--color-text-heading)] truncate" title={article.title}>
                                            {article.title}
                                        </div>
                                        <div className="text-xs text-[var(--color-text-meta)] truncate font-mono opacity-60">
                                            /{article.slug}
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-xs uppercase text-[var(--color-accent)]">
                                        [{article.category}]
                                    </div>
                                    <div className="col-span-2 text-xs opacity-70">
                                        {article.date}
                                    </div>
                                    <div className="col-span-2 text-xs opacity-70 flex gap-3">
                                        <span title="Views">{article.views}v</span>
                                        <span title="Votes">{article.votes}★</span>
                                    </div>
                                    <div className="col-span-2 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href={`/research/${article.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[var(--color-text-meta)] hover:text-[var(--color-text-primary)]"
                                            title="View Live"
                                        >
                                            <Eye size={16} />
                                        </a>
                                        <NavLink
                                            to={`/admin/editor/${article.slug}`}
                                            className="text-[var(--color-text-meta)] hover:text-[var(--color-text-primary)]"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </NavLink>
                                        <button
                                            onClick={() => handleDelete(article.id, article.slug)}
                                            disabled={deleting === article.id}
                                            className="text-[var(--color-text-meta)] hover:text-red-500 disabled:opacity-30"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
