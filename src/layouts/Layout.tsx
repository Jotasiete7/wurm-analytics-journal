import { Outlet, NavLink } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { ArrowLeft } from 'lucide-react';


const Layout = () => {
    return (
        <div className="min-h-screen bg-wurm-bg flex flex-col items-center selection:bg-wurm-accent selection:text-black">
            {/* Header: Minimal Institutional */}
            <header className="sticky top-0 z-50 w-full bg-wurm-bg/95 backdrop-blur-sm border-b border-wurm-border/50">
                <div className="max-w-[var(--spacing-measure-wide)] mx-auto px-6 h-20 flex items-center justify-between">

                    {/* Left: Portal Link (Minimal) */}
                    <div className="flex-1 flex justify-start">
                        <a
                            href="https://wurm-aguild-site.pages.dev"
                            className="group flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-wurm-muted hover:text-wurm-accent transition-colors"
                        >
                            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Portal</span>
                        </a>
                    </div>

                    {/* Center: Logotype (Serif) */}
                    <div className="flex-1 flex justify-center">
                        <NavLink to="/" className="text-xl md:text-2xl font-serif font-bold text-wurm-text tracking-tight hover:opacity-90 transition-opacity">
                            A Guilda <span className="text-wurm-accent">Analytics</span>
                        </NavLink>
                    </div>

                    {/* Right: Navigation + Lang */}
                    <div className="flex-1 flex justify-end items-center gap-6">
                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-wurm-muted">
                            {['Analysis', 'Statistics', 'Investigations'].map((item) => (
                                <NavLink
                                    key={item}
                                    to={`/?cat=${item.toUpperCase()}`}
                                    className="hover:text-wurm-accent transition-colors"
                                >
                                    {item}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Divider */}
                        <div className="hidden md:block h-3 w-px bg-wurm-border"></div>

                        {/* Language Switcher (Inline) */}
                        <LanguageSwitcher />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-[var(--spacing-measure-wide)] px-6 py-16 flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-wurm-border/30 mt-auto">
                <div className="max-w-[var(--spacing-measure-wide)] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center opacity-60">
                    <div className="text-xs font-mono text-wurm-muted uppercase tracking-widest mb-4 md:mb-0">
                        &copy; 2026 A Guilda. All rights dedicated.
                    </div>
                    <div className="flex gap-6 text-xs font-mono text-wurm-muted uppercase tracking-widest">
                        <a href="https://wurm-recipe-tool.pages.dev" className="hover:text-wurm-accent transition-colors">Recipes</a>
                        <a href="https://wurm-mining-tool.pages.dev" className="hover:text-wurm-accent transition-colors">Mining</a>
                        <a href="#" className="hover:text-wurm-accent transition-colors">Legal</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
