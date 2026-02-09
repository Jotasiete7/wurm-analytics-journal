import { Outlet, NavLink } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Layout = () => {
    return (
        <div className="min-h-screen bg-[var(--color-bg-body)] flex flex-col items-center">
            {/* Minimal Editorial Header */}
            <LanguageSwitcher />
            <header className="w-full max-w-[var(--measure-wide)] px-6 py-12 flex justify-between items-baseline border-b border-[var(--color-border)] mb-12">
                <NavLink to="/" className="text-xl font-bold tracking-tight text-[var(--color-text-heading)] hover:text-white transition-colors">
                    Wurm Analytics
                </NavLink>
                <nav>
                    <NavLink to="/" className="text-sm text-[var(--color-text-meta)] hover:text-[var(--color-text-heading)] transition-colors">
                        Index
                    </NavLink>
                </nav>
            </header>

            {/* Main Content - Centered Reading Column */}
            <main className="w-full max-w-[var(--measure-text)] px-6 pb-32">
                <Outlet />
            </main>

            <footer className="w-full max-w-[var(--measure-wide)] px-6 py-12 border-t border-[var(--color-border)] mt-auto flex justify-between items-baseline opacity-50">
                <div className="text-xs text-[var(--color-text-meta)]">
                    &copy; 2026 Wurm Analytics
                </div>
                <div className="text-xs text-[var(--color-text-meta)] font-mono">
                    Editorial Journal
                </div>
            </footer>
        </div>
    );
};

export default Layout;
