import { useState, useEffect } from 'react';
import { ThumbsUp, Eye } from 'lucide-react';
import { articleService } from '../services/articles';

interface VoteControlProps {
    docId: string;
    initialVotes: number;
    initialViews: number;
}

const VoteControl = ({ docId, initialVotes, initialViews }: VoteControlProps) => {
    const [votes, setVotes] = useState(initialVotes);
    const [views, setViews] = useState(initialViews);
    const [hasVoted, setHasVoted] = useState(false);
    const [isVoting, setIsVoting] = useState(false);

    useEffect(() => {
        // Load local voting state
        const userVoted = localStorage.getItem(`wurm_analytics_has_voted_${docId}`);
        if (userVoted) setHasVoted(true);

        // We can optionally refresh stats here or trust initial props
        // But since view increment happens on mount in parent, let's trust that for now
        // Or fetch fresh stats to be sure
        const fetchStats = async () => {
            const stats = await articleService.getStats(docId);
            if (stats) {
                setViews(stats.views || 0);
                setVotes(stats.votes || 0);
            }
        };
        fetchStats();

        // Optional: Realtime subscription could be added here later
    }, [docId]);

    const handleVote = async () => {
        if (hasVoted || isVoting) return;

        setIsVoting(true);
        try {
            await articleService.vote(docId);

            // Optimistic update
            const newVotes = votes + 1;
            setVotes(newVotes);
            setHasVoted(true);

            // Persist local state
            localStorage.setItem(`wurm_analytics_has_voted_${docId}`, 'true');
        } catch (error) {
            console.error('Failed to vote:', error);
            // Revert optimistic update (could be complex, simply refetching stats is easier usually)
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <div className="flex items-center space-x-6 py-4 border-t border-[var(--color-border)] mt-8">
            <div className="flex items-center space-x-2 text-[var(--color-text-secondary)]" title="Views">
                <Eye size={16} />
                <span className="font-mono text-sm">{views}</span>
            </div>

            <button
                onClick={handleVote}
                disabled={hasVoted || isVoting}
                className={`flex items-center space-x-2 transition-all duration-200 ${hasVoted
                    ? 'text-[var(--color-accent)] cursor-default scale-110'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:scale-105'
                    } ${isVoting ? 'opacity-50 cursor-wait' : ''}`}
                title="Endorse this research"
            >
                <ThumbsUp size={16} className={hasVoted ? 'fill-current' : ''} />
                <span className="font-mono text-sm">{votes}</span>
            </button>

            {hasVoted && (
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-mono animate-in fade-in duration-300">
                    Endorsed
                </span>
            )}
        </div>
    );
};

export default VoteControl;
