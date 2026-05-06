import { Link2, Check, MessageCircle, Share2 } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
    title: string;
    url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const shareUrls = {
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ': ' + url)}`
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    url: url
                });
            } catch (err) {
                console.log('Share cancelled or failed');
            }
        } else {
            copyToClipboard();
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-wurm-muted font-mono">Share:</span>

            <a
                href={shareUrls.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 border border-wurm-border hover:border-wurm-accent hover:text-wurm-accent transition-colors text-xs uppercase tracking-wider"
                title="Share on WhatsApp"
            >
                <MessageCircle size={14} />
                <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <button
                onClick={handleNativeShare}
                className="flex items-center gap-2 px-3 py-1.5 border border-wurm-border hover:border-wurm-accent hover:text-wurm-accent transition-colors text-xs uppercase tracking-wider"
                title="Share using system menu"
            >
                <Share2 size={14} />
                <span className="hidden sm:inline">Partilhar</span>
            </button>

            <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 border border-wurm-border hover:border-wurm-accent hover:text-wurm-accent transition-colors text-xs uppercase tracking-wider"
                title="Copy link"
            >
                {copied ? <Check size={14} className="text-green-500" /> : <Link2 size={14} />}
                <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Copiar Link'}</span>
            </button>
        </div>
    );
}
