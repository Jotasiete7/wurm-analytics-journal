import { useEffect, useState, useMemo } from 'react';
import { List } from 'lucide-react';

interface TableOfContentsProps {
    content: string;
}

interface Heading {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

    // Extract headings using useMemo to avoid setState in effect
    const headings = useMemo<Heading[]>(() => {
        const headingRegex = /^(#{1,3})\s+(.+)$/gm;
        const matches = [...content.matchAll(headingRegex)];

        return matches.map((match, index) => {
            const level = match[1].length;
            const text = match[2].trim();
            const id = `heading-${index}`;
            return { id, text, level };
        });
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66%' }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <nav className="sticky top-24 p-6 border border-wurm-border bg-wurm-panel/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 text-xs uppercase tracking-widest text-wurm-muted font-mono">
                <List size={14} />
                <span>Table of Contents</span>
            </div>
            <ul className="space-y-2 text-sm">
                {headings.map(({ id, text, level }) => (
                    <li
                        key={id}
                        style={{ paddingLeft: `${(level - 1) * 12}px` }}
                    >
                        <a
                            href={`#${id}`}
                            className={`block py-1 transition-colors ${activeId === id
                                ? 'text-wurm-accent font-medium'
                                : 'text-wurm-muted hover:text-wurm-text'
                                }`}
                        >
                            {text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
