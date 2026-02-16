import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Document } from '../content';

interface SearchBarProps {
    articles: Document[];
    onFilter: (filtered: Document[]) => void;
    placeholder?: string;
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function SearchBar({ articles, onFilter, placeholder = 'Search articles...' }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300); // 300ms debounce

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            onFilter(articles);
            return;
        }

        const filtered = articles.filter(article => {
            const searchText = `
                ${article.title_en || ''} 
                ${article.title_pt || ''} 
                ${article.excerpt_en || ''} 
                ${article.excerpt_pt || ''}
                ${article.content_en || ''}
                ${article.content_pt || ''}
            `.toLowerCase();

            return searchText.includes(debouncedQuery.toLowerCase());
        });

        onFilter(filtered);
    }, [debouncedQuery, articles, onFilter]);

    return (
        <div className="relative mb-8">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-wurm-muted" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-12 py-3 border border-wurm-border bg-wurm-panel text-wurm-text placeholder-wurm-muted outline-none focus:border-wurm-accent transition-colors font-mono text-sm"
            />
            {query && (
                <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-wurm-muted hover:text-wurm-accent transition-colors"
                    title="Clear search"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}
