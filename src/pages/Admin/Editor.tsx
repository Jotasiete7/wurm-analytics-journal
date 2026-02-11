import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { articleService } from '../../services/articles';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';

const Editor = () => {
    const { user, role, loading } = useAuth();
    const navigate = useNavigate();
    const { slug: routeSlug } = useParams();

    // Editor State
    const [slug, setSlug] = useState('');
    const [category, setCategory] = useState('ANALYSIS');
    const [tagsInput, setTagsInput] = useState(''); // Comma separated
    const [originalSlug, setOriginalSlug] = useState('');

    // Content State (Monolingual as per Schema)
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<any>('draft');

    const [uiStatus, setUiStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('idle');

    // Redirect if not authorized
    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate('/admin');
            } else if (role !== 'admin' && role !== 'editor') {
                alert('Unauthorized access');
                navigate('/');
            }
        }
    }, [user, role, loading, navigate]);

    // Load existing article
    useEffect(() => {
        const loadArticle = async () => {
            if (routeSlug) {
                setUiStatus('loading');
                const doc = await articleService.getBySlug(routeSlug);

                if (doc) {
                    setSlug(doc.slug);
                    setOriginalSlug(doc.slug);
                    setCategory(doc.category);
                    setTitle(doc.title_en); // Mapped from DB title
                    setExcerpt(doc.excerpt_en);
                    setContent(doc.content_en);

                    // We need to fetch raw data for tags/status if not in Document interface
                    // Or update Document interface. For now, let's fetch raw to get tags.
                    const { data } = await supabase.from('articles').select('tags, status').eq('slug', routeSlug).single();
                    if (data) {
                        setTagsInput((data.tags || []).join(', '));
                        setStatus(data.status);
                    }

                    setUiStatus('idle');
                } else {
                    setUiStatus('error');
                }
            }
        };
        loadArticle();
    }, [routeSlug]);

    const calculateReadingTime = (text: string) => {
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    const handleSave = async () => {
        if (!slug || !title || !content) {
            alert('Please fill in Slug, Title, and Content.');
            return;
        }

        setUiStatus('saving');
        try {
            // Check for ID if updating
            let idToUpdate = undefined;
            if (originalSlug) {
                const doc = await articleService.getBySlug(originalSlug);
                if (doc) idToUpdate = doc.id;
            }

            const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
            const readingTime = calculateReadingTime(content);

            const payload: any = {
                slug: slug.toLowerCase().replace(/\s+/g, '-'),
                title,
                category,
                tags: tagsArray,
                excerpt,
                content,
                status,
                reading_time: readingTime,
                author_id: user?.id,
                updated_at: new Date().toISOString(),
            };

            if (idToUpdate) {
                payload.id = idToUpdate;
            }

            const { error } = await supabase
                .from('articles')
                .upsert(payload);

            if (error) throw error;

            setUiStatus('saved');
            setTimeout(() => setUiStatus('idle'), 2000);

            // Navigation handling
            if (slug !== originalSlug) {
                navigate(`/admin/editor/${payload.slug}`, { replace: true });
            }

        } catch (e: any) {
            console.error(e);
            alert(`Error saving: ${e.message}`);
            setUiStatus('error');
        }
    };

    if (loading || uiStatus === 'loading') {
        return (
            <div className="min-h-screen bg-[var(--color-bg-body)] flex flex-col items-center justify-center text-[var(--color-text-muted)] font-mono text-xs gap-4">
                <div className="flex items-center">
                    <Loader2 className="animate-spin mr-2" />
                    <span>Initializing Editor...</span>
                </div>
                <div className="p-4 border border-[var(--color-border)] bg-[#111] opacity-50 text-[10px] text-left">
                    <p>DEBUG STATUS:</p>
                    <p>Auth Loading: {loading ? 'YES' : 'NO'}</p>
                    <p>UI Status: {uiStatus}</p>
                    <p>User: {user ? user.email : 'NULL'}</p>
                    <p>Role: {role || 'NULL'}</p>
                    <p>Slug: {routeSlug || 'NULL'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-body)] text-[var(--color-text-body)] font-mono text-sm selection:bg-[var(--color-accent)] selection:text-black">
            {/* Toolbar */}
            <div className="fixed top-0 left-0 w-full bg-[var(--color-bg-body)]/90 backdrop-blur border-b border-[var(--color-border)] p-4 flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/dashboard')} className="hover:text-[var(--color-accent)] flex items-center gap-2 transition-colors">
                        <ChevronLeft size={16} />
                        <span className="uppercase tracking-wider font-bold">Back</span>
                    </button>
                    <div className="h-4 w-px bg-[var(--color-border)]"></div>
                    <span className="text-[var(--color-text-heading)] font-bold">
                        {originalSlug ? 'EDITING MODE' : 'CREATION MODE'}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] uppercase border rounded ${uiStatus === 'saved' ? 'border-green-500 text-green-500' : 'border-[var(--color-border)] text-gray-500'}`}>
                        {uiStatus}
                    </span>
                </div>
                <div className="flex gap-4">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="bg-transparent border border-[var(--color-border)] text-xs uppercase px-2 outline-none focus:border-[var(--color-accent)]"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>

                    <button
                        onClick={handleSave}
                        disabled={uiStatus === 'saving'}
                        className="hover:bg-[var(--color-accent)] hover:text-black transition-colors uppercase tracking-wider bg-[var(--color-text-heading)] text-[var(--color-bg-body)] px-6 py-2 font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        {uiStatus === 'saving' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save
                    </button>
                </div>
            </div>

            <div className="pt-24 pb-32 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">

                {/* Meta Panel */}
                <div className="md:col-span-4 space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-meta)]">Slug / URL</label>
                        <input
                            value={slug}
                            onChange={e => setSlug(e.target.value)}
                            className="w-full bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none py-2 font-bold transition-colors"
                            placeholder="my-article-slug"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-meta)]">Category</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-2 text-xs outline-none focus:border-[var(--color-accent)]"
                        >
                            <option>ANALYSIS</option>
                            <option>STATISTICS</option>
                            <option>INVESTIGATION</option>
                            <option>GUIDE</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-meta)]">Tags (comma separated)</label>
                        <input
                            value={tagsInput}
                            onChange={e => setTagsInput(e.target.value)}
                            className="w-full bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none py-2 text-xs"
                            placeholder="Market, Solo, PvP"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-meta)]">Excerpt</label>
                        <textarea
                            value={excerpt}
                            onChange={e => setExcerpt(e.target.value)}
                            className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-3 text-xs outline-none focus:border-[var(--color-accent)] h-32 resize-none"
                            placeholder="Short description for cards..."
                        />
                    </div>
                </div>

                {/* Main Content Panel */}
                <div className="md:col-span-8 space-y-8">
                    <div className="space-y-2">
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Article Title"
                            className="w-full bg-transparent text-3xl md:text-4xl font-serif font-bold text-[var(--color-text-heading)] placeholder-opacity-20 placeholder-[var(--color-text-muted)] outline-none"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute top-0 right-0 text-[10px] text-[var(--color-text-meta)] bg-[var(--color-bg-body)] px-2">Markdown</div>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="# Write your analysis here..."
                            className="w-full h-[600px] bg-[var(--color-bg-paper)] p-6 outline-none font-mono text-sm leading-relaxed text-[var(--color-text-body)] resize-y border border-[var(--color-border)] focus:border-[var(--color-accent)] transition-colors"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;
