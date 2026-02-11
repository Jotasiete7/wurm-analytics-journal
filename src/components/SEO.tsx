interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    type?: 'article' | 'website';
    image?: string;
}

const SEO = ({ title, description, canonical, type = 'website', image }: SEOProps) => {
    const siteTitle = 'Wurm Analytics';
    const fullTitle = `${title} | ${siteTitle}`;

    return (
        <>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
        </>
    );
};

export default SEO;
