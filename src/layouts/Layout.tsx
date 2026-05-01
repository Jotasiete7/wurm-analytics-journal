import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Header as AgHeader } from '@ecossistema-guilda/layout/Header';
import { LanguageSwitch } from '@ecossistema-guilda/modules/LanguageSwitch';
import agStyles from '@ecossistema-guilda/layout/Header.module.css';
import { useLanguage } from '../contexts/LanguageContext';


const Layout = () => {
    const { lang, setLang } = useLanguage();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-wurm-bg flex flex-col items-center selection:bg-wurm-accent selection:text-black font-sans">
            {/* Header: Antigravity System */}
            <AgHeader 
                variant="analytics"
                currentToolId="analytics"
                LinkComponent={NavLink}
                logo={
                    <img
                        src="/logo-sm.webp"
                        alt="A Guilda Analytics"
                        className="h-8 w-auto object-contain opacity-90 transition-opacity"
                    />
                }
                centralNav={
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
                }
                extraModules={
                    <LanguageSwitch 
                        lang={lang} 
                        onLanguageChange={(l) => setLang(l)} 
                        styles={agStyles}
                    />
                }
            />

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
                            {/* Ecosystem links removed as they are in the Header */}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
