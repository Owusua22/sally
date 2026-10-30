// app/feed.xml/route.ts
// RSS feed of the journal — gives search engines and readers one more way to
// discover new articles.

import { getBlogPosts } from '@/lib/data/blog';
import { site } from '@/lib/site';

export const revalidate = 3600;

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = await getBlogPosts({ limit: 30 }).catch(() => []);
  const base = site.url.replace(/\/$/, '');

  const items = posts
    .map((post) => {
      const url = `${base}/blog/${post.slug}`;
      const date = new Date(post.published_at ?? post.created_at).toUTCString();

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${escapeXml(post.excerpt ?? post.seo_description ?? '')}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`${site.nameFull} — Skincare Journal`)}</title>
    <link>${base}/blog</link>
    <description>${escapeXml(site.description)}</description>
    <language>en-gh</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
