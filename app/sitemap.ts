import type { MetadataRoute } from 'next';
import { ACTIVE, hreflangPairs } from '@/lib/i18n';
import { getPosts, postAlternates, STATIC_PAGES } from '@/lib/posts';
import { CATEGORY_KEYS, SITE } from '@/lib/site';

export const dynamic = 'force-static';

const abs = (p: string) => `${SITE.url}${p}`;
const langs = (paths: Record<string, string>) => ({ languages: Object.fromEntries(Object.entries(paths).flatMap(([l, p]) => hreflangPairs(l, abs(p)))) });
const shared = (suffix: string) => langs(Object.fromEntries(ACTIVE.map((l) => [l, `/${l}/${suffix}`])));

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  for (const lang of ACTIVE) {
    const posts = getPosts(lang);
    const latest = posts.map((p) => p.updated || p.date).sort().pop();
    out.push({ url: abs(`/${lang}/`), lastModified: latest, changeFrequency: 'weekly', priority: 1, alternates: shared('') });
    for (const c of CATEGORY_KEYS) out.push({ url: abs(`/${lang}/category/${c}/`), lastModified: latest, changeFrequency: 'weekly', priority: 0.7, alternates: shared(`category/${c}/`) });
    for (const p of posts)
      out.push({ url: abs(`/${lang}/${p.slug}/`), lastModified: p.updated || p.date, changeFrequency: 'monthly', priority: 0.8, images: [p.image], alternates: langs(postAlternates(p.key)) });
    for (const s of STATIC_PAGES) out.push({ url: abs(`/${lang}/${s}/`), changeFrequency: 'yearly', priority: 0.3, alternates: shared(`${s}/`) });
  }
  return out;
}
