interface SEOProps {
    title: string;
    description: string;
    type?: 'website' | 'article';
    image?: string;
}

export default function SEO({ title, description, type = 'website', image }: SEOProps) {
    const siteName = 'Wurm Analytics';
    const fullTitle = `${title} | ${siteName}`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const defaultImage = typeof window !== 'undefined' ? `${window.location.origin}/logo.webp` : '';

    return (
        <>
            {/* Standard Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image || defaultImage} />
        </>
    );
}
