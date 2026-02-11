import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
    const { lang, setLang } = useLanguage();

    return (
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-wurm-muted uppercase select-none">
            <button
                onClick={() => setLang('en')}
                className={`hover:text-wurm-accent transition-colors ${lang === 'en' ? 'text-wurm-accent font-bold' : ''}`}
            >
                EN
            </button>
            <span className="opacity-30">/</span>
            <button
                onClick={() => setLang('pt')}
                className={`hover:text-wurm-accent transition-colors ${lang === 'pt' ? 'text-wurm-accent font-bold' : ''}`}
            >
                PT
            </button>
        </div>
    );
};

export default LanguageSwitcher;
