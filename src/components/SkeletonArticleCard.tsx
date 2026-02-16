export default function SkeletonArticleCard() {
    return (
        <article className="group flex flex-col items-start animate-pulse">
            {/* Category, Date, Reading Time */}
            <div className="flex items-center gap-3 mb-3">
                <div className="h-3 bg-wurm-border/30 rounded w-20"></div>
                <div className="h-3 bg-wurm-border/30 rounded w-2"></div>
                <div className="h-3 bg-wurm-border/30 rounded w-24"></div>
                <div className="h-3 bg-wurm-border/30 rounded w-2"></div>
                <div className="h-3 bg-wurm-border/30 rounded w-16"></div>
            </div>

            {/* Title */}
            <div className="h-8 bg-wurm-border/30 rounded w-3/4 mb-3"></div>

            {/* Excerpt */}
            <div className="space-y-2 mb-4 w-full max-w-xl">
                <div className="h-4 bg-wurm-border/30 rounded w-full"></div>
                <div className="h-4 bg-wurm-border/30 rounded w-5/6"></div>
            </div>

            {/* Read more link */}
            <div className="h-3 bg-wurm-border/30 rounded w-20"></div>
        </article>
    );
}
