import { useLanguage } from '../contexts/LanguageContext';
import { useEffect } from 'react';

const LanguageSwitcher = () => {
    const { lang, setLang } = useLanguage();

    // Debug: log when language changes
    useEffect(() => {
        console.log('🌐 Language changed to:', lang);
        console.log('📦 localStorage:', localStorage.getItem('wurm_analytics_lang'));
    }, [lang]);

    const handleLanguageChange = (newLang: 'en' | 'pt') => {
        console.log('🔄 Changing language from', lang, 'to', newLang);
        setLang(newLang);
    };

    return (
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-wurm-muted uppercase select-none">
            <button
                onClick={() => handleLanguageChange('en')}
                className={`
                    min-h-[44px] md:min-h-[32px] px-3 py-2
                    hover:text-wurm-accent transition-colors
                    cursor-pointer pointer-events-auto
                    ${lang === 'en' ? 'text-wurm-accent font-bold' : ''}
                `}
                type="button"
                aria-label="Switch to English"
            >
                EN
            </button>
            <span className="opacity-30">/</span>
            <button
                onClick={() => handleLanguageChange('pt')}
                className={`
                    min-h-[44px] md:min-h-[32px] px-3 py-2
                    hover:text-wurm-accent transition-colors
                    cursor-pointer pointer-events-auto
                    ${lang === 'pt' ? 'text-wurm-accent font-bold' : ''}
                `}
                type="button"
                aria-label="Mudar para Português"
            >
                PT
            </button>
        </div>
    );
};

export default LanguageSwitcher;
