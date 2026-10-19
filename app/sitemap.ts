import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { CATEGORIES, SITE } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latest = posts.map((p) => p.updated || p.date).sort().pop();
  return [
    { url: `${SITE.url}/`, lastModified: latest, changeFrequency: 'weekly', priority: 1 },
    ...Object.keys(CATEGORIES).map((c) => ({ url: `${SITE.url}/category/${c}/`, lastModified: latest, changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...posts.map((p) => ({ url: `${SITE.url}/${p.slug}/`, lastModified: p.updated || p.date, changeFrequency: 'monthly' as const, priority: 0.8, images: [p.image] })),
    ...['about', 'how-we-review', 'affiliate-disclosure', 'contact', 'privacy'].map((s) => ({ url: `${SITE.url}/${s}/`, changeFrequency: 'yearly' as const, priority: 0.3 })),
  ];
}
