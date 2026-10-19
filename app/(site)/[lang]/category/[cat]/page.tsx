import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import PostCard from '@/components/PostCard';
import { ACTIVE, fill, t, type Lang } from '@/lib/i18n';
import { getPosts } from '@/lib/posts';
import { sharedAlternates } from '@/lib/seo';
import { CATEGORY_KEYS, SITE } from '@/lib/site';

type Props = { params: Promise<{ lang: string; cat: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => ACTIVE.flatMap((lang) => CATEGORY_KEYS.map((cat) => ({ lang, cat })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, cat } = await params;
  const c = t(lang).categories[cat as (typeof CATEGORY_KEYS)[number]];
  return {
    title: fill(t(lang).categoryTitle, { name: c.name }),
    description: fill(t(lang).categoryDescription, { blurb: c.blurb }),
    alternates: { canonical: `/${lang}/category/${cat}/`, languages: sharedAlternates(`category/${cat}/`) },
  };
}

export default async function Category({ params }: Props) {
  const { lang, cat } = (await params) as { lang: Lang; cat: (typeof CATEGORY_KEYS)[number] };
  const m = t(lang);
  const c = m.categories[cat];
  const posts = getPosts(lang).filter((p) => p.category === cat);
  return (
    <main className="wrap wide">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: m.breadcrumbHome, item: `${SITE.url}/${lang}/` },
        { '@type': 'ListItem', position: 2, name: c.name, item: `${SITE.url}/${lang}/category/${cat}/` },
      ] }} />
      <nav className="crumbs" aria-label="Breadcrumb"><Link href={`/${lang}/`}>{m.breadcrumbHome}</Link> › {c.name}</nav>
      <header className="hero hero--small">
        <h1>{c.name}</h1>
        <p className="lede">{c.blurb}</p>
      </header>
      <div className="grid">{posts.map((p) => <PostCard key={p.key} p={p} />)}</div>
    </main>
  );
}
