import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Document } from '../content';
import { useLanguage } from '../contexts/LanguageContext';

interface FilterBarProps {
    articles: Document[];
    onFilter: (filtered: Document[]) => void;
}

export default function FilterBar({ articles, onFilter }: FilterBarProps) {
    const { t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Extract unique categories and tags
    const categories = [...new Set(articles.map(a => a.category))].filter(Boolean);
    const allTags = [...new Set(articles.flatMap(a => a.tags || []))].filter(Boolean);

    const handleFilter = () => {
        let filtered = articles;

        if (selectedCategory) {
            filtered = filtered.filter(a => a.category === selectedCategory);
        }

        if (selectedTags.length > 0) {
            filtered = filtered.filter(a =>
                a.tags?.some(tag => selectedTags.includes(tag))
            );
        }

        onFilter(filtered);
    };

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedTags([]);
    };

    useEffect(() => {
        handleFilter();
    }, [selectedCategory, selectedTags, articles]);

    return (
        <div className="space-y-4 mb-8 pb-8 border-b border-wurm-border">
            {/* Category Filter */}
            {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-wurm-muted uppercase tracking-wider font-mono">
                        {t('Category:', 'Categoria:')}
                    </span>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1 text-[10px] uppercase tracking-wider border transition-colors ${!selectedCategory
                            ? 'border-wurm-accent text-wurm-accent bg-wurm-accent/10'
                            : 'border-wurm-border text-wurm-muted hover:border-wurm-accent hover:text-wurm-accent'
                            }`}
                    >
                        {t('All', 'Todos')}
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 text-[10px] uppercase tracking-wider border transition-colors ${selectedCategory === cat
                                ? 'border-wurm-accent text-wurm-accent bg-wurm-accent/10'
                                : 'border-wurm-border text-wurm-muted hover:border-wurm-accent hover:text-wurm-accent'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* Tag Filter */}
            {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-wurm-muted uppercase tracking-wider font-mono">
                        {t('Tags:', 'Tags:')}
                    </span>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => {
                                setSelectedTags(prev =>
                                    prev.includes(tag)
                                        ? prev.filter(t => t !== tag)
                                        : [...prev, tag]
                                );
                            }}
                            className={`px-3 py-1 text-[10px] uppercase tracking-wider border transition-colors ${selectedTags.includes(tag)
                                ? 'border-wurm-accent text-wurm-accent bg-wurm-accent/10'
                                : 'border-wurm-border text-wurm-muted hover:border-wurm-accent hover:text-wurm-accent'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            {/* Clear Filters */}
            {(selectedCategory || selectedTags.length > 0) && (
                <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-1 text-xs text-wurm-muted hover:text-wurm-accent transition-colors font-mono uppercase tracking-wider"
                >
                    <X size={12} />
                    {t('Clear all', 'Limpar tudo')}
                </button>
            )}
        </div>
    );
}
