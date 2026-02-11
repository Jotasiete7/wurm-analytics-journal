import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';


const Layout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    return (
        <div className="min-h-screen bg-wurm-bg flex flex-col items-center selection:bg-wurm-accent selection:text-black font-sans">
            {/* Header: Minimal Institutional */}
            <header className="sticky top-0 z-50 w-full bg-wurm-bg/95 backdrop-blur-sm border-b border-wurm-border/50">
                <div className="max-w-[var(--spacing-measure-wide)] mx-auto px-6 py-6 flex items-center justify-between">

                    {/* Left: Portal Link (Minimal) */}
                    <div className="flex-1 flex justify-start">
                        <a
                            href="https://wurm-aguild-site.pages.dev"
                            className="group flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-wurm-muted hover:text-wurm-accent transition-colors"
                        >
                            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="hidden sm:inline">Portal</span>
                        </a>
                    </div>

                    {/* Center: Halftone Logo (Primary Brand) */}
                    <div className="flex-1 flex justify-center">
                        <NavLink to="/" className="group block p-2">
                            <img
                                src="/logo-sm.webp"
                                alt="A Guilda Analytics"
                                className="h-8 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_10px_rgba(212,180,131,0.1)]"
                            />
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

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-wurm-muted hover:text-wurm-accent"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Divider (Desktop Only) */}
                        <div className="hidden md:block h-3 w-px bg-wurm-border"></div>

                        {/* Language Switcher (Inline) */}
                        <div className="hidden md:block">
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-wurm-bg border-b border-wurm-border/50 animate-in slide-in-from-top-2 duration-200 shadow-xl">
                        <nav className="flex flex-col items-center py-8 gap-6 text-sm font-mono uppercase tracking-widest text-wurm-muted">
                            {['Analysis', 'Statistics', 'Investigations'].map((item) => (
                                <NavLink
                                    key={item}
                                    to={`/?cat=${item.toUpperCase()}`}
                                    className="hover:text-wurm-accent transition-colors py-2"
                                >
                                    {item}
                                </NavLink>
                            ))}
                            <div className="w-12 h-px bg-wurm-border opacity-30 my-2"></div>
                            <LanguageSwitcher />
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="w-full max-w-[var(--spacing-measure-wide)] px-6 py-12 md:py-16 flex-grow relative z-10 w-full overflow-x-hidden">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-wurm-border/30 mt-auto relative z-20 bg-wurm-bg">
                <div className="max-w-[var(--spacing-measure-wide)] mx-auto px-6 py-12 flex flex-col items-center opacity-60">

                    {/* Brand Reinforcement (Minimal "a") */}
                    <div className="mb-8 opacity-20 hover:opacity-40 transition-opacity">
                        <img src="/logo-sm.webp" alt="A Guilda" className="h-5 w-auto grayscale" />
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 text-center md:text-left">
                        <div
                            className="text-xs font-mono text-wurm-muted uppercase tracking-widest cursor-default select-none hover:text-wurm-text transition-colors"
                            onDoubleClick={() => navigate('/admin')}
                            title="v1.0.0"
                        >
                            &copy; 2026 A Guilda. All rights dedicated.
                        </div>
                        <div className="flex gap-6 text-xs font-mono text-wurm-muted uppercase tracking-widest justify-center">
                            <a href="https://wurm-recipe-tool.pages.dev" className="hover:text-wurm-accent transition-colors">Recipes</a>
                            <a href="https://wurm-mining-tool.pages.dev" className="hover:text-wurm-accent transition-colors">Mining</a>
                            <a href="#" className="hover:text-wurm-accent transition-colors">Legal</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
