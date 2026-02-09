import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Filter, BarChart2, BookOpen, Microscope, FileText } from 'lucide-react';
import { type Document, type Category } from '../content';
import { articleService } from '../services/articles';

const Sidebar = () => {
    const [activeFilter, setActiveFilter] = useState<Category | 'ALL'>('ALL');
    const [docs, setDocs] = useState<Document[]>([]);

    useEffect(() => {
        const fetchDocs = async () => {
            const data = await articleService.getAll();
            if (data) {
                setDocs(data);
            }
        };
        fetchDocs();
    }, []);

    const categories: { id: Category; label: string; icon: any }[] = [
        { id: 'ANALYSIS', label: 'Analysis', icon: Microscope },
        { id: 'STATISTICS', label: 'Statistics', icon: BarChart2 },
        { id: 'INVESTIGATION', label: 'Investigations', icon: Search },
        { id: 'GUIDE', label: 'Guides', icon: BookOpen },
    ];

    const filteredDocs = activeFilter === 'ALL'
        ? docs
        : docs.filter(doc => doc.category === activeFilter);

    return (
        <aside className="border-r border-[var(--color-border)] bg-[var(--color-bg-subtle)] flex flex-col h-screen sticky top-0 shrink-0 z-40">
            {/* Header / Brand Area */}
            <div className="h-[60px] border-b border-[var(--color-border)] flex items-center px-6 space-x-3">
                <img src="/logo.png" alt="Wurm Analytics Logo" className="w-8 h-8 object-contain opacity-90" />
                <div className="font-mono text-[var(--color-gold-matte)] font-bold tracking-wider uppercase text-sm">
                    Wurm Analytics
                </div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-[var(--color-border)]">
                <div className="flex items-center space-x-2 mb-4 text-xs font-mono text-[var(--color-text-secondary)] uppercase tracking-wider">
                    <Filter size={12} />
                    <span>Index Filters</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setActiveFilter('ALL')}
                        className={`text-xs px-2 py-1.5 border ${activeFilter === 'ALL'
                            ? 'border-[var(--color-gold-matte)] text-[var(--color-gold-matte)]'
                            : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)]'
                            } transition-colors text-left font-mono`}
                    >
                        [ALL]
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(cat.id)}
                            className={`text-xs px-2 py-1.5 border ${activeFilter === cat.id
                                ? 'border-[var(--color-gold-matte)] text-[var(--color-gold-matte)]'
                                : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)]'
                                } transition-colors text-left font-mono`}
                        >
                            [{cat.label.substring(0, 4)}]
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats / Highlights */}
            <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-deep)]">
                <div className="flex justify-between items-center text-[10px] font-mono text-[var(--color-text-secondary)] mb-2">
                    <span className="uppercase">System Status</span>
                    <span className="text-[var(--color-gold-matte)]">ONLINE</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-[10px] text-[var(--color-text-secondary)]">Docs</div>
                        <div className="text-sm font-mono">{docs.length}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-[var(--color-text-secondary)]">Updated</div>
                        <div className="text-sm font-mono">24h</div>
                    </div>
                </div>
            </div>

            {/* Document List */}
            <nav className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="px-4 py-4 space-y-1">
                    {filteredDocs.map(doc => (
                        <NavLink
                            key={doc.id}
                            to={`/research/${doc.slug}`}
                            className={({ isActive }) => `
                group flex items-start space-x-3 p-3 border-l-2 transition-all hover:bg-[var(--color-bg-deep)]
                ${isActive
                                    ? 'border-[var(--color-gold-matte)] bg-[var(--color-bg-deep)]'
                                    : 'border-transparent opacity-70 hover:opacity-100'}
              `}
                        >
                            <div className="mt-0.5">
                                <FileText size={14} className={activeFilter === doc.category ? 'text-[var(--color-gold-matte)]' : 'text-[var(--color-text-secondary)]'} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className={`text-sm font-medium leading-tight mb-1 group-hover:text-[var(--color-text-primary)] ${doc.category === 'ANALYSIS' ? 'text-blue-200' : 'text-[var(--color-text-primary)]'
                                    }`}>
                                    {doc.title_en}
                                </div>
                                <div className="flex items-center space-x-2 text-[10px] font-mono text-[var(--color-text-secondary)]">
                                    <span>{doc.date}</span>
                                    <span className="text-[var(--color-border)]">|</span>
                                    <span className="uppercase">{doc.category}</span>
                                </div>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Footer / Methodology Link */}
            <div className="p-4 border-t border-[var(--color-border)]">
                <NavLink to="/methodology" className="flex items-center space-x-2 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-gold-matte)] transition-colors">
                    <Microscope size={14} />
                    <span className="font-mono uppercase tracking-wider">Methodology</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
