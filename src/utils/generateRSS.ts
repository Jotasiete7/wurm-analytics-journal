import type { Document } from '../content';

export function generateRSS(articles: Document[], siteUrl: string = 'https://analytics.aguilda.com'): string {
    const now = new Date().toUTCString();

    const rssItems = articles
        .filter(article => article.status === 'published' || !article.status) // Only published
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Most recent first
        .slice(0, 20) // Limit to 20 most recent
        .map(article => {
            const title = article.title_en || article.title;
            const excerpt = article.excerpt_en || article.excerpt;
            const link = `${siteUrl}/research/${article.slug}`;
            const pubDate = new Date(article.date).toUTCString();

            return `    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${excerpt}]]></description>
      <category>${article.category}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
        })
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Wurm Analytics</title>
    <link>${siteUrl}</link>
    <description>Research and analysis on Wurm Online</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;
}
