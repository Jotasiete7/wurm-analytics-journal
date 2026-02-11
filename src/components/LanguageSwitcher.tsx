import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
    const { lang, setLang } = useLanguage();

    return (
        <div className="fixed top-4 right-4 z-50 flex gap-3 text-[10px] font-mono tracking-widest text-wurm-muted uppercase bg-black/80 p-1.5 rounded-full border border-wurm-border backdrop-blur-sm shadow-xl">
            <div className="flex bg-wurm-panel rounded-full px-1 border border-wurm-border/50">
                <button
                    onClick={() => setLang('en')}
                    className={`px-2 py-1 rounded-full transition-all ${lang === 'en' ? 'text-white font-bold bg-wurm-accent/10' : 'hover:text-wurm-accent'}`}
                >
                    EN
                </button>
                <button
                    onClick={() => setLang('pt')}
                    className={`px-2 py-1 rounded-full transition-all ${lang === 'pt' ? 'text-white font-bold bg-wurm-accent/10' : 'hover:text-wurm-accent'}`}
                >
                    PT
                </button>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
