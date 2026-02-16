import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { articleService } from '../../services/articles';
import { ChevronLeft, Save, Loader2, Eye, Check } from 'lucide-react';

const Editor = () => {
    const { user, role, loading } = useAuth();
    const navigate = useNavigate();
    const { slug: routeSlug } = useParams();

    // Editor State
    const [slug, setSlug] = useState('');
    const [category, setCategory] = useState('ANALYSIS');
    const [tagsInput, setTagsInput] = useState(''); // Comma separated
    const [originalSlug, setOriginalSlug] = useState('');

    // Bilingual Content State
    const [lang, setLang] = useState<'en' | 'pt'>('en');

    const [titleEn, setTitleEn] = useState('');
    const [excerptEn, setExcerptEn] = useState('');
    const [contentEn, setContentEn] = useState('');

    const [titlePt, setTitlePt] = useState('');
    const [excerptPt, setExcerptPt] = useState('');
    const [contentPt, setContentPt] = useState('');

    const [status, setStatus] = useState<any>('draft');
    const [uiStatus, setUiStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('idle');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Redirect if not authorized
    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate('/admin');
            } else if (role !== 'admin' && role !== 'editor') {
                console.warn('⚠️ Unauthorized access. Role:', role);
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

                    // Load Bilingual Fields
                    setTitleEn(doc.title_en);
                    setExcerptEn(doc.excerpt_en);
                    setContentEn(doc.content_en);

                    setTitlePt(doc.title_pt || '');
                    setExcerptPt(doc.excerpt_pt || '');
                    setContentPt(doc.content_pt || '');

                    // We need to fetch raw data for tags/status if not in Document interface
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
        // Validation: At least English title/content required? Or just one?
        // Let's require EN as primary, PT optional.
        if (!slug || !titleEn || !contentEn) {
            alert('Please fill in Slug, English Title, and English Content at minimum.');
            setLang('en');
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
            const readingTime = calculateReadingTime(contentEn); // Base reading time on EN

            const payload: any = {
                slug: slug.toLowerCase().replace(/\s+/g, '-'),

                // Save Bilingual Fields
                title_en: titleEn,
                excerpt_en: excerptEn,
                content_en: contentEn,

                title_pt: titlePt || null,
                excerpt_pt: excerptPt || null,
                content_pt: contentPt || null,

                category,
                tags: tagsArray,
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
            setHasUnsavedChanges(false);
            setLastSaved(new Date());
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

    // Auto-save every 30 seconds if there are unsaved changes
    useEffect(() => {
        if (!hasUnsavedChanges || uiStatus === 'saving') return;

        const autoSaveTimer = setTimeout(() => {
            console.log('🔄 Auto-saving...');
            handleSave();
        }, 30000); // 30 seconds

        return () => clearTimeout(autoSaveTimer);
    }, [hasUnsavedChanges, titleEn, contentEn, titlePt, contentPt, excerptEn, excerptPt, slug, category, tagsInput, status]);

    // Track changes to mark as unsaved
    useEffect(() => {
        if (uiStatus === 'loading') return; // Don't mark as unsaved during initial load
        setHasUnsavedChanges(true);
    }, [titleEn, contentEn, titlePt, contentPt, excerptEn, excerptPt, slug, category, tagsInput, status]);

    // Warn before leaving with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    if (loading || uiStatus === 'loading') {
        return (
            <div className="min-h-screen bg-[var(--color-bg-body)] flex flex-col items-center justify-center text-[var(--color-text-muted)] font-mono text-xs gap-4">
                <div className="flex items-center">
                    <Loader2 className="animate-spin mr-2" />
                    <span>Initializing Editor...</span>
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
                    <span className="text-[var(--color-text-heading)] font-bold hidden md:inline">
                        {originalSlug ? 'EDITING MODE' : 'CREATION MODE'}
                    </span>

                    {/* Language Switcher in Toolbar */}
                    <div className="flex bg-[var(--color-bg-subtle)] rounded border border-[var(--color-border)] p-1 ml-4">
                        <button
                            onClick={() => setLang('en')}
                            className={`px-3 py-1 text-[10px] uppercase font-bold rounded transition-colors ${lang === 'en' ? 'bg-[var(--color-text-heading)] text-[var(--color-bg-body)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]'}`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setLang('pt')}
                            className={`px-3 py-1 text-[10px] uppercase font-bold rounded transition-colors ${lang === 'pt' ? 'bg-[var(--color-text-heading)] text-[var(--color-bg-body)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]'}`}
                        >
                            Português
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Unsaved Changes Indicator */}
                        {hasUnsavedChanges && uiStatus !== 'saving' && (
                            <span className="px-2 py-0.5 text-[10px] uppercase border border-yellow-500/50 text-yellow-500 rounded animate-pulse">
                                Unsaved
                            </span>
                        )}

                        {/* Last Saved Time */}
                        {lastSaved && !hasUnsavedChanges && uiStatus === 'idle' && (
                            <span className="text-[10px] text-gray-500">
                                Saved {new Date(lastSaved).toLocaleTimeString()}
                            </span>
                        )}

                        {/* Status Badge */}
                        <span className={`px-2 py-0.5 text-[10px] uppercase border rounded ${uiStatus === 'saved' ? 'border-green-500 text-green-500' : uiStatus === 'saving' ? 'border-blue-500 text-blue-500' : 'border-[var(--color-border)] text-gray-500'}`}>
                            {uiStatus}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    {/* View Live Button - Only show if published */}
                    {status === 'published' && slug && (
                        <a
                            href={`/research/${slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:bg-[var(--color-accent)] hover:text-black transition-colors uppercase tracking-wider bg-transparent border border-[var(--color-border)] text-[var(--color-text-heading)] px-4 py-2 font-bold flex items-center gap-2"
                        >
                            <Eye size={16} />
                            <span className="hidden md:inline">View Live</span>
                        </a>
                    )}

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="bg-transparent border border-[var(--color-border)] text-xs uppercase px-3 outline-none focus:border-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
                        title="Status"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>

                    <button
                        onClick={handleSave}
                        disabled={uiStatus === 'saving'}
                        className="hover:bg-[var(--color-accent)] hover:text-black transition-colors uppercase tracking-wider bg-[var(--color-text-heading)] text-[var(--color-bg-body)] px-6 py-2 font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uiStatus === 'saving' ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : uiStatus === 'saved' ? (
                            <Check size={16} className="text-green-400" />
                        ) : (
                            <Save size={16} />
                        )}
                        <span>{uiStatus === 'saving' ? 'Saving...' : uiStatus === 'saved' ? 'Saved!' : 'Save'}</span>
                    </button>
                </div>
            </div>

            <div className="pt-24 pb-32 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">

                {/* Meta Panel (Shared) */}
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
                            title="Category"
                        >
                            <option>ANALYSIS</option>
                            <option>STATISTICS</option>
                            <option>INVESTIGATION</option>
                            <option>GUIDE</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-meta)]">Tags</label>
                        <input
                            value={tagsInput}
                            onChange={e => setTagsInput(e.target.value)}
                            className="w-full bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none py-2 text-xs"
                            placeholder="Market, Solo, PvP"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-meta)] flex justify-between">
                            <span>Excerpt ({lang.toUpperCase()})</span>
                            <span className="text-gray-500">
                                {(lang === 'en' ? excerptEn : excerptPt).length} chars
                            </span>
                        </label>
                        <textarea
                            value={lang === 'en' ? excerptEn : excerptPt}
                            onChange={e => lang === 'en' ? setExcerptEn(e.target.value) : setExcerptPt(e.target.value)}
                            className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-3 text-xs outline-none focus:border-[var(--color-accent)] h-32 resize-none"
                            placeholder={lang === 'en' ? "Short description..." : "Breve descrição..."}
                        />
                    </div>
                </div>

                {/* Main Content Panel (Localized) */}
                <div className="md:col-span-8 space-y-8">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] uppercase tracking-widest text-[var(--color-text-meta)]">
                                Title ({lang.toUpperCase()})
                            </label>
                            <span className="text-[10px] text-gray-500">
                                {(lang === 'en' ? titleEn : titlePt).length} chars
                            </span>
                        </div>
                        <input
                            value={lang === 'en' ? titleEn : titlePt}
                            onChange={e => lang === 'en' ? setTitleEn(e.target.value) : setTitlePt(e.target.value)}
                            placeholder={lang === 'en' ? "Article Title" : "Título do Artigo"}
                            className="w-full bg-transparent text-3xl md:text-4xl font-serif font-bold text-[var(--color-text-heading)] placeholder-opacity-20 placeholder-[var(--color-text-muted)] outline-none"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute top-0 right-0 text-[10px] text-[var(--color-text-meta)] bg-[var(--color-bg-body)] px-2 flex gap-3">
                            <span>Markdown ({lang.toUpperCase()})</span>
                            <span className="text-gray-500">
                                {(lang === 'en' ? contentEn : contentPt).trim().split(/\s+/).filter(w => w.length > 0).length} words
                            </span>
                        </div>
                        <textarea
                            value={lang === 'en' ? contentEn : contentPt}
                            onChange={e => lang === 'en' ? setContentEn(e.target.value) : setContentPt(e.target.value)}
                            placeholder={lang === 'en' ? "# Write your analysis here..." : "# Escreva sua análise aqui..."}
                            className="w-full h-[600px] bg-[var(--color-bg-paper)] p-6 outline-none font-mono text-sm leading-relaxed text-[var(--color-text-body)] resize-y border border-[var(--color-border)] focus:border-[var(--color-accent)] transition-colors"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;
