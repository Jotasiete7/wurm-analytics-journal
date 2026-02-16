interface StructuredDataProps {
    article: {
        title: string;
        excerpt: string;
        date: string;
        slug: string;
        category: string;
    };
}

export default function StructuredData({ article }: StructuredDataProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt,
        "datePublished": article.date,
        "articleSection": article.category,
        "author": {
            "@type": "Organization",
            "name": "Wurm Analytics"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Wurm Analytics",
            "logo": {
                "@type": "ImageObject",
                "url": `${typeof window !== 'undefined' ? window.location.origin : ''}/logo.webp`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${typeof window !== 'undefined' ? window.location.href : ''}`
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
