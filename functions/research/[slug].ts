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
            const missingEnvResponse = new Response(response.body, response);
            missingEnvResponse.headers.set('x-debug-og-status', 'missing-env');
            return missingEnvResponse;
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

        if (!apiReq.ok) {
            const apiErrorResponse = new Response(response.body, response);
            apiErrorResponse.headers.set('x-debug-og-status', `api-error-${apiReq.status}`);
            return apiErrorResponse;
        }

        const articles = await apiReq.json() as any[];
        const article = articles?.[0];

        if (!article) {
            const noArticleResponse = new Response(response.body, response);
            noArticleResponse.headers.set('x-debug-og-status', 'article-not-found');
            return noArticleResponse;
        }

        // Determina título e descrição (priorizando PT se disponível, seguindo o padrão do site)
        const title = article.title_pt || article.title_en || article.title || "Wurm Analytics Journal";
        const description = article.excerpt_pt || article.excerpt_en || article.excerpt || "Research and economic intelligence.";
        const imageUrl = "https://wurm-analytics-journal.pages.dev/og-image.png";
        const pageUrl = `https://wurm-analytics-journal.pages.dev/research/${slug}`;

        const rewrittenResponse = new HTMLRewriter()
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

        const okResponse = new Response(rewrittenResponse.body, rewrittenResponse);
        okResponse.headers.set('x-debug-og-status', 'success');
        return okResponse;

    } catch (e: any) {
        console.error('Error in OG function:', e);
        const errResponse = new Response(response.body, response);
        errResponse.headers.set('x-debug-og-error', e.message || 'unknown');
        return errResponse;
    }
};
