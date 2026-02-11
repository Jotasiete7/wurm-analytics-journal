import { Outlet } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Network, ArrowLeft, BookOpen, Pickaxe, Home } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-wurm-bg flex flex-col items-center selection:bg-wurm-accent selection:text-black">
            <LanguageSwitcher />

            {/* A Guilda Standard Header */}
            <header className="sticky top-0 z-40 w-full bg-wurm-bg/90 backdrop-blur-md border-b border-wurm-border shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left: Branding & Portal Link */}
                        <div className="flex items-center gap-4">
                            <a
                                href="https://wurm-aguild-site.pages.dev" // Replace with actual portal URL if different
                                className="flex items-center gap-2 text-sm font-medium text-wurm-muted hover:text-wurm-accent transition-colors font-mono uppercase tracking-wider"
                            >
                                <ArrowLeft size={16} />
                                <span className="hidden sm:inline">Portal</span>
                            </a>
                            <div className="h-6 w-px bg-wurm-border hidden sm:block"></div>
                            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                                A Guilda <span className="text-wurm-accent">Analytics</span>
                            </h1>
                        </div>

                        {/* Right: Ecosystem Menu */}
                        <div className="flex items-center gap-3 pr-24 sm:pr-28"> {/* Padding for fixed LanguageSwitcher */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className={`p-2 rounded-full transition-colors ${isMenuOpen ? 'text-wurm-accent bg-wurm-panel' : 'text-wurm-muted hover:text-wurm-text hover:bg-wurm-panel'}`}
                                    title="Wurm Ecosystem"
                                >
                                    <Network size={20} />
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-wurm-panel rounded border border-wurm-border shadow-xl py-2 animate-in fade-in slide-in-from-top-2 z-50">
                                        <div className="px-4 py-2 text-[10px] font-bold text-wurm-muted uppercase tracking-widest border-b border-wurm-border mb-1">
                                            A Guilda Ecosystem
                                        </div>
                                        <a href="https://wurm-aguild-site.pages.dev" className="block px-4 py-2 text-sm text-wurm-text hover:bg-white/5 hover:text-wurm-accent transition-colors font-mono flex items-center gap-2">
                                            <Home size={14} /> Main Hub
                                        </a>
                                        <a href="https://wurm-recipe-tool.pages.dev" className="block px-4 py-2 text-sm text-wurm-text hover:bg-white/5 hover:text-wurm-accent transition-colors font-mono flex items-center gap-2">
                                            <BookOpen size={14} /> Recipes
                                        </a>
                                        <a href="https://wurm-mining-tool.pages.dev" className="block px-4 py-2 text-sm text-wurm-text hover:bg-white/5 hover:text-wurm-accent transition-colors font-mono flex items-center gap-2">
                                            <Pickaxe size={14} /> Mining
                                        </a>
                                        <div className="block px-4 py-2 text-sm font-medium text-wurm-accent bg-wurm-accent/10 font-mono border-l-2 border-wurm-accent flex items-center gap-2">
                                            <span>📊</span> Analytics
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Backdrop for menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)}></div>
            )}

            {/* Main Content */}
            <main className="w-full max-w-[var(--measure-wide)] px-6 py-12 flex-grow">
                <Outlet />
            </main>

            <footer className="w-full max-w-[var(--measure-wide)] px-6 py-12 border-t border-wurm-border mt-auto flex flex-col sm:flex-row justify-between items-center gap-4 opacity-70">
                <div className="text-xs text-wurm-muted font-mono uppercase tracking-widest">
                    &copy; 2026 Wurm Analytics
                </div>
                <div className="text-xs text-wurm-muted flex gap-4">
                    <a href="#" className="hover:text-wurm-accent transition-colors">Privacy</a>
                    <a href="#" className="hover:text-wurm-accent transition-colors">Terms</a>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
