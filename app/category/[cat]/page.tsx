import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import PostCard from '@/components/PostCard';
import { getAllPosts } from '@/lib/posts';
import { CATEGORIES, SITE } from '@/lib/site';

type Props = { params: Promise<{ cat: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(CATEGORIES).map((cat) => ({ cat }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = CATEGORIES[(await params).cat];
  return { title: `${c.name} Guides & Reviews`, description: `${c.blurb} Practical buying guides from ${SITE.name}.`, alternates: { canonical: `/category/${(await params).cat}/` } };
}

export default async function Category({ params }: Props) {
  const { cat } = await params;
  const c = CATEGORIES[cat];
  const posts = getAllPosts().filter((p) => p.category === cat);
  return (
    <main className="wrap wide">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
        { '@type': 'ListItem', position: 2, name: c.name, item: `${SITE.url}/category/${cat}/` },
      ] }} />
      <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> › {c.name}</nav>
      <header className="hero hero--small">
        <h1>{c.name}</h1>
        <p className="lede">{c.blurb}</p>
      </header>
      <div className="grid">{posts.map((p) => <PostCard key={p.slug} p={p} />)}</div>
    </main>
  );
}
