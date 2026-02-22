interface Env {
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { env, params } = context;
    const slug = params.slug as string;

    // Fallback para a resposta original
    const response = await context.next();

    if (!slug) return response;

    try {
        const supabaseUrl = env.VITE_SUPABASE_URL;
        const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.warn('Supabase credentials missing in environment.');
            return response;
        }

        // Busca o artigo via REST API do Supabase para evitar dependências pesadas na Edge
        const apiReq = await fetch(
            `${supabaseUrl}/rest/v1/articles?slug=eq.${slug}&select=*`,
            {
                headers: {
                    apikey: supabaseKey,
                    Authorization: `Bearer ${supabaseKey}`,
                    Accept: 'application/json',
                },
            }
        );

        if (!apiReq.ok) return response;

        const articles = await apiReq.json() as any[];
        const article = articles?.[0];

        if (!article) return response;

        // Determina título e descrição (priorizando PT se disponível, seguindo o padrão do site)
        const title = article.title_pt || article.title_en || article.title || "Wurm Analytics Journal";
        const description = article.excerpt_pt || article.excerpt_en || article.excerpt || "Research and economic intelligence.";
        const imageUrl = "https://wurm-analytics-journal.pages.dev/og-image.png";
        const pageUrl = `https://wurm-analytics-journal.pages.dev/research/${slug}`;

        return new HTMLRewriter()
            .on('title', {
                element(element) {
                    element.setInnerContent(`${title} | Wurm Analytics Journal`);
                },
            })
            .on('meta[property="og:title"]', {
                element(element) {
                    element.setAttribute('content', title);
                },
            })
            .on('meta[property="og:description"]', {
                element(element) {
                    element.setAttribute('content', description);
                },
            })
            .on('meta[property="og:url"]', {
                element(element: any) {
                    element.setAttribute('content', pageUrl);
                },
            })
            .on('meta[property="og:image"]', {
                element(element: any) {
                    element.setAttribute('content', imageUrl);
                },
            })
            .on('meta[property="og:type"]', {
                element(element: any) {
                    element.setAttribute('content', 'article');
                },
            })
            .on('meta[name="twitter:title"]', {
                element(element: any) {
                    element.setAttribute('content', title);
                },
            })
            .on('meta[name="twitter:description"]', {
                element(element: any) {
                    element.setAttribute('content', description);
                },
            })
            .on('meta[name="twitter:image"]', {
                element(element: any) {
                    element.setAttribute('content', imageUrl);
                },
            })
            .transform(response);

    } catch (e) {
        console.error('Error in OG function:', e);
        return response;
    }
};
