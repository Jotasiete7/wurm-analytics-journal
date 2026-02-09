import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
    const { lang, setLang } = useLanguage();

    return (
        <div className="fixed top-6 right-6 z-50 flex gap-3 text-[10px] font-mono tracking-widest text-[var(--color-text-meta)] uppercase select-none">
            <button
                onClick={() => setLang('en')}
                className={`hover:text-[var(--color-accent)] transition-colors ${lang === 'en' ? 'text-[var(--color-accent)] underline decoration-[var(--color-accent)] underline-offset-4' : ''}`}
            >
                EN
            </button>
            <span className="opacity-30">|</span>
            <button
                onClick={() => setLang('pt')}
                className={`hover:text-[var(--color-accent)] transition-colors ${lang === 'pt' ? 'text-[var(--color-accent)] underline decoration-[var(--color-accent)] underline-offset-4' : ''}`}
            >
                PT
            </button>
        </div>
    );
};

export default LanguageSwitcher;
