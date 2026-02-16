import { Twitter, Linkedin, Link2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
    title: string;
    url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
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
                href={shareUrls.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 border border-wurm-border hover:border-wurm-accent hover:text-wurm-accent transition-colors text-xs uppercase tracking-wider"
                title="Share on Twitter"
            >
                <Twitter size={14} />
                <span className="hidden sm:inline">Twitter</span>
            </a>

            <a
                href={shareUrls.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 border border-wurm-border hover:border-wurm-accent hover:text-wurm-accent transition-colors text-xs uppercase tracking-wider"
                title="Share on LinkedIn"
            >
                <Linkedin size={14} />
                <span className="hidden sm:inline">LinkedIn</span>
            </a>

            <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 border border-wurm-border hover:border-wurm-accent hover:text-wurm-accent transition-colors text-xs uppercase tracking-wider"
                title="Copy link"
            >
                {copied ? <Check size={14} className="text-green-500" /> : <Link2 size={14} />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
        </div>
    );
}
