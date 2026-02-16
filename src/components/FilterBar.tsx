import { useEffect, useState } from 'react';
import type { Document } from '../content';

interface FilterBarProps {
    articles: Document[];
    onFilter: (filtered: Document[]) => void;
}

export default function FilterBar({ articles, onFilter }: FilterBarProps) {
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

    useEffect(() => {
        handleFilter();
    }, [selectedCategory, selectedTags, articles]);

    const hasActiveFilters = selectedCategory || selectedTags.length > 0;

    return (
        <div className="space-y-4 mb-8 pb-8 border-b border-wurm-border">
            {/* Categories */}
            {categories.length > 0 && (
                <div className="flex gap-2 flex-wrap items-center">
                    <span className="text-[10px] uppercase tracking-widest text-wurm-muted font-mono">Category:</span>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1 text-[10px] uppercase tracking-wider border transition-colors ${!selectedCategory
                                ? 'border-wurm-accent text-wurm-accent bg-wurm-accent/10'
                                : 'border-wurm-border text-wurm-muted hover:border-wurm-accent hover:text-wurm-accent'
                            }`}
                    >
                        All
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

            {/* Tags */}
            {allTags.length > 0 && (
                <div className="flex gap-2 flex-wrap items-center">
                    <span className="text-[10px] uppercase tracking-widest text-wurm-muted font-mono">Tags:</span>
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
            {hasActiveFilters && (
                <button
                    onClick={() => {
                        setSelectedCategory(null);
                        setSelectedTags([]);
                    }}
                    className="text-[10px] uppercase tracking-wider text-wurm-accent hover:underline font-mono"
                >
                    Clear all filters
                </button>
            )}
        </div>
    );
}
