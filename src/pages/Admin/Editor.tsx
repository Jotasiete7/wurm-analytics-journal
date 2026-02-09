import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { articleService } from '../../services/articles';
import { ChevronLeft } from 'lucide-react';

const Editor = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const { slug: routeSlug } = useParams();

    // Editor State
    const [slug, setSlug] = useState('');
    const [category, setCategory] = useState('ANALYSIS');
    const [originalSlug, setOriginalSlug] = useState(''); // To track if we're creating or updating

    // Bilingual Content
    const [titleEn, setTitleEn] = useState('');
    const [titlePt, setTitlePt] = useState('');
    const [excerptEn, setExcerptEn] = useState('');
    const [excerptPt, setExcerptPt] = useState('');
    const [contentEn, setContentEn] = useState('');
    const [contentPt, setContentPt] = useState('');

    const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('idle');

    useEffect(() => {
        if (!loading && !user) {
            navigate('/admin');
        }
    }, [user, loading, navigate]);

    // Load existing article if editing
    useEffect(() => {
        const loadArticle = async () => {
            if (routeSlug) {
                setStatus('loading');
                const doc = await articleService.getBySlug(routeSlug);
                if (doc) {
                    setSlug(doc.slug);
                    setOriginalSlug(doc.slug);
                    setCategory(doc.category);
                    setTitleEn(doc.title_en || '');
                    setTitlePt(doc.title_pt || '');
                    setExcerptEn(doc.excerpt_en || '');
                    setExcerptPt(doc.excerpt_pt || '');
                    setContentEn(doc.content_en || '');
                    setContentPt(doc.content_pt || '');
                    setStatus('idle');
                } else {
                    setStatus('error');
                }
            }
        };
        loadArticle();
    }, [routeSlug]);

    const handleSave = async () => {
        setStatus('saving');
        try {
            // If updating and slug changed, we might need to handle ID persistence
            // But upsert matching on ID is safer. However, we don't have ID in state here yet unless we fetch it.
            // Simplified: We'll assume slug editing is rare or we rely on the fact that if it exists, Supabase upserts.
            // WARNING: Changing slug without ID match creates a NEW record.
            // Ideally we should track ID. Let's fetch ID in loadArticle.

            // For now, let's keep it simple: MATCH ON SLUG.
            // If user changes slug of existing article, it creates a new one.
            // FIX: We need the ID to update properly if we allow slug changes.
            // Let's rely on the routeSlug (original) to find the ID if needed, OR just match by slug.

            // BETTER APPROACH: Add ID to state if editing.
            let idToUpdate = undefined;
            if (originalSlug) {
                const doc = await articleService.getBySlug(originalSlug);
                if (doc) idToUpdate = doc.id;
            }

            const payload: any = {
                slug,
                category,
                title_en: titleEn,
                title_pt: titlePt,
                excerpt_en: excerptEn,
                excerpt_pt: excerptPt,
                content_en: contentEn,
                content_pt: contentPt,
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

            setStatus('saved');
            setTimeout(() => setStatus('idle'), 2000);

            // If slug changed, navigate to new URL
            if (originalSlug && slug !== originalSlug) {
                navigate(`/admin/editor/${slug}`, { replace: true });
            } else if (!originalSlug) {
                // Created new
                navigate(`/admin/editor/${slug}`, { replace: true });
            }

        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    if (loading || status === 'loading') {
        return <div className="min-h-screen bg-[var(--color-bg-body)] flex items-center justify-center text-white opacity-50">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-body)] text-[var(--color-text-body)] font-mono text-sm">
            {/* Toolbar */}
            <div className="fixed top-0 left-0 w-full bg-[var(--color-bg-body)] border-b border-[var(--color-border)] p-4 flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/dashboard')} className="hover:text-[var(--color-accent)] flex items-center gap-2">
                        <ChevronLeft size={16} />
                        <span className="uppercase tracking-wider">Back</span>
                    </button>
                    <span className="text-[var(--color-text-heading)] font-bold border-l border-[var(--color-border)] pl-4">
                        {originalSlug ? 'EDITING RECORD' : 'NEW RECORD'}
                    </span>
                    <span className={`px-2 py-0.5 text-xs uppercase ${status === 'saved' ? 'text-green-500' : 'text-gray-500'}`}>
                        {status}
                    </span>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleSave} className="hover:text-[var(--color-text-heading)] uppercase tracking-wider bg-[var(--color-text-heading)] text-black px-4 py-1 font-bold">
                        Save Record
                    </button>
                </div>
            </div>

            <div className="pt-24 pb-32 px-8 max-w-[1800px] mx-auto grid grid-cols-2 gap-12">
                {/* Metadata Column */}
                <div className="col-span-2 grid grid-cols-4 gap-4 mb-8 border-b border-[var(--color-border)] pb-8">
                    <div className="col-span-1">
                        <label className="block text-xs uppercase opacity-50 mb-2">Slug (URL Identifier)</label>
                        <input
                            value={slug}
                            onChange={e => setSlug(e.target.value)}
                            className="w-full bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none py-1 font-bold"
                            placeholder="my-article-slug"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs uppercase opacity-50 mb-2">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#111] border border-[var(--color-border)] p-1 text-xs">
                            <option>ANALYSIS</option>
                            <option>STATISTICS</option>
                            <option>INVESTIGATION</option>
                            <option>GUIDE</option>
                        </select>
                    </div>
                </div>

                {/* English Column */}
                <div className="space-y-6">
                    <h3 className="text-[var(--color-accent)] uppercase tracking-widest border-b border-[var(--color-border)] pb-2 mb-6">English Source</h3>

                    <div>
                        <input
                            value={titleEn}
                            onChange={e => setTitleEn(e.target.value)}
                            placeholder="Title (EN)"
                            className="w-full bg-transparent text-2xl font-bold text-[var(--color-text-heading)] placeholder-opacity-20 placeholder-white outline-none mb-4"
                        />
                        <textarea
                            value={excerptEn}
                            onChange={e => setExcerptEn(e.target.value)}
                            placeholder="Excerpt/Hook (EN) - 150 chars"
                            className="w-full bg-transparent text-lg italic opacity-70 outline-none resize-none h-24 mb-4 border-l-2 border-[var(--color-border)] pl-4"
                        />
                        <textarea
                            value={contentEn}
                            onChange={e => setContentEn(e.target.value)}
                            placeholder="# Markdown Content (EN)..."
                            className="w-full h-[600px] bg-[#080808] p-6 outline-none font-mono text-sm leading-relaxed text-gray-300 resize-none border border-[var(--color-border)] focus:border-[var(--color-accent)] transition-colors"
                        />
                    </div>
                </div>

                {/* Portuguese Column */}
                <div className="space-y-6">
                    <h3 className="text-[var(--color-accent)] uppercase tracking-widest border-b border-[var(--color-border)] pb-2 mb-6">Portuguese Translation</h3>

                    <div>
                        <input
                            value={titlePt}
                            onChange={e => setTitlePt(e.target.value)}
                            placeholder="Título (PT)"
                            className="w-full bg-transparent text-2xl font-bold text-[var(--color-text-heading)] placeholder-opacity-20 placeholder-white outline-none mb-4"
                        />
                        <textarea
                            value={excerptPt}
                            onChange={e => setExcerptPt(e.target.value)}
                            placeholder="Resumo/Gancho (PT) - 150 chars"
                            className="w-full bg-transparent text-lg italic opacity-70 outline-none resize-none h-24 mb-4 border-l-2 border-[var(--color-border)] pl-4"
                        />
                        <textarea
                            value={contentPt}
                            onChange={e => setContentPt(e.target.value)}
                            placeholder="# Conteúdo Markdown (PT)..."
                            className="w-full h-[600px] bg-[#080808] p-6 outline-none font-mono text-sm leading-relaxed text-gray-300 resize-none border border-[var(--color-border)] focus:border-[var(--color-accent)] transition-colors"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;
