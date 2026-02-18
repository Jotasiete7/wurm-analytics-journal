import { useState, useRef, useEffect } from 'react';
import { Network, Home, BookOpen, Pickaxe, LineChart, BookMarked } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// CANONICAL ECOSYSTEM DROPDOWN — A Guilda
// Template de referência para todos os projetos do ecossistema.
// Ao replicar em outro projeto, altere apenas `CURRENT_TOOL`.
// ─────────────────────────────────────────────────────────────

const ECOSYSTEM_TOOLS = [
    {
        id: 'portal',
        label: 'Portal',
        href: 'https://wurm-aguild-site.pages.dev',
        icon: Home,
    },
    {
        id: 'analytics',
        label: 'Analytics',
        href: 'https://wurm-analytics-journal.pages.dev',
        icon: LineChart,
    },
    {
        id: 'recipes',
        label: 'Receitas',
        href: 'https://wurm-recipe-tool.pages.dev',
        icon: BookOpen,
    },
    {
        id: 'mining',
        label: 'Mineração',
        href: 'https://wurm-mining-tool.pages.dev',
        icon: Pickaxe,
    },
    {
        id: 'liturgy',
        label: 'Liturgy',
        href: 'https://wurm-liturgy.pages.dev',
        icon: BookMarked,
    },
] as const;

// ← Change this to the id of the current project
const CURRENT_TOOL = 'analytics';

export default function EcosystemDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setIsOpen(prev => !prev)}
                title="Ecossistema A Guilda"
                className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest transition-colors ${isOpen ? 'text-wurm-accent' : 'text-wurm-muted hover:text-wurm-accent'
                    }`}
            >
                <Network size={14} />
                <span className="hidden sm:inline">Ecossistema</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] w-52 bg-wurm-bg border border-wurm-border rounded-xl p-1.5 shadow-2xl z-50 flex flex-col gap-0.5">
                    <div className="text-[10px] font-mono text-wurm-muted/50 uppercase tracking-widest px-3 py-1.5 border-b border-wurm-border/50 mb-1">
                        A Guilda
                    </div>
                    {ECOSYSTEM_TOOLS.map(({ id, label, href, icon: Icon }) => {
                        const isCurrent = id === CURRENT_TOOL;
                        return isCurrent ? (
                            <div
                                key={id}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-wurm-accent bg-wurm-accent/10 cursor-default"
                            >
                                <Icon size={13} />
                                <span>{label}</span>
                                <span className="ml-auto text-[9px] font-mono opacity-60">aqui</span>
                            </div>
                        ) : (
                            <a
                                key={id}
                                href={href}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-wurm-muted hover:text-wurm-accent hover:bg-wurm-accent/5 transition-colors"
                            >
                                <Icon size={13} />
                                <span>{label}</span>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
