import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import PostCard from '@/components/PostCard';
import { fmtDate, getAllPosts, getPost } from '@/lib/posts';
import { CATEGORIES, SITE, STORE, STORE_CHRISTIAN } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => getAllPosts().map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPost((await params).slug);
  const url = `/${p.slug}/`;
  return {
    title: { absolute: p.seoTitle },
    description: p.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: p.seoTitle,
      description: p.description,
      url,
      publishedTime: p.date,
      modifiedTime: p.updated || p.date,
      section: CATEGORIES[p.category]?.name,
      images: [{ url: p.image, width: p.imageW, height: p.imageH, alt: p.imageAlt }],
    },
    twitter: { card: 'summary_large_image', title: p.seoTitle, description: p.description, images: [p.image] },
  };
}

export default async function PostPage({ params }: Props) {
  const p = getPost((await params).slug);
  const cat = CATEGORIES[p.category];
  const url = `${SITE.url}/${p.slug}/`;
  const store = p.christian ? STORE_CHRISTIAN : STORE;
  const related = getAllPosts().filter((o) => o.slug !== p.slug && o.category === p.category).slice(0, 3);
  const graph: object[] = [
    {
      '@type': 'Article',
      headline: p.title,
      description: p.description,
      image: [p.image],
      datePublished: p.date,
      dateModified: p.updated || p.date,
      author: { '@type': 'Organization', name: SITE.author, url: `${SITE.url}/about/` },
      publisher: { '@id': `${SITE.url}/#org` },
      mainEntityOfPage: url,
      articleSection: cat?.name,
      keywords: p.keyword,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
        { '@type': 'ListItem', position: 2, name: cat?.name, item: `${SITE.url}/category/${p.category}/` },
        { '@type': 'ListItem', position: 3, name: p.seoTitle, item: url },
      ],
    },
  ];
  if (p.faq.length)
    graph.push({ '@type': 'FAQPage', mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });

  return (
    <main className="wrap">
      <JsonLd data={{ '@context': 'https://schema.org', '@graph': graph }} />
      <article className="post">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> › <Link href={`/category/${p.category}/`}>{cat?.name}</Link>
        </nav>
        <h1>{p.title}</h1>
        <p className="standfirst">{p.description}</p>
        <div className="byline">
          <span className="avatar" aria-hidden="true">LR</span>
          <div>
            <p>By <Link href="/about/">{SITE.author}</Link></p>
            <p className="meta">
              Updated <time dateTime={p.updated || p.date}>{fmtDate(p.updated || p.date)}</time> · {p.readingMinutes} min read
            </p>
          </div>
        </div>
        <p className="disclosure">
          <strong>Disclosure:</strong> this guide includes a partner link to Lumalyn. We may earn if you buy, at no extra cost to you. It does not
          change what we recommend. <Link href="/affiliate-disclosure/">Learn more</Link>.
        </p>

        <figure className="lead">
          <img src={p.image} alt={p.imageAlt} width={p.imageW} height={p.imageH} fetchPriority="high" />
          <figcaption>{p.imageAlt}. Image: Lumalyn.</figcaption>
        </figure>

        {p.takeaways.length > 0 && (
          <section className="box takeaways" aria-labelledby="tk">
            <h2 id="tk">Key takeaways</h2>
            <ul>{p.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>
          </section>
        )}

        {p.toc.length > 2 && (
          <nav className="box toc" aria-labelledby="toc-h">
            <p id="toc-h" className="box-h">In this guide</p>
            <ol>
              {p.toc.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>)}
              {p.faq.length > 0 && <li><a href="#faq">FAQ</a></li>}
            </ol>
          </nav>
        )}

        <div className="prose" dangerouslySetInnerHTML={{ __html: p.html }} />

        {p.faq.length > 0 && (
          <section className="faq" aria-labelledby="faq">
            <h2 id="faq">Frequently asked questions</h2>
            {p.faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </section>
        )}

        <aside className="cta" aria-label="Where to buy">
          <div>
            <p className="kicker">{p.christian ? 'For faith-filled displays' : 'Our pick for windows & balconies'}</p>
            <p className="cta-title">Lumalyn Smart Animated Balcony Lights</p>
            <p>400-LED pixel curtain · 2 × 2 m or 3 × 3 m · app + remote · music sync · timers · IP44 for covered outdoor spots.</p>
          </div>
          <a className="btn" href={store} rel="sponsored noopener">Visit lumalyn.store</a>
        </aside>

        {p.sources.length > 0 && (
          <section className="sources" aria-labelledby="src">
            <h2 id="src">Sources</h2>
            <ul>{p.sources.map((s) => <li key={s.url}><a href={s.url} rel="noopener" target="_blank">{s.title}</a></li>)}</ul>
          </section>
        )}

        <section className="author-box" aria-label="About the author">
          <span className="avatar avatar--lg" aria-hidden="true">LR</span>
          <div>
            <p className="box-h">{SITE.author}</p>
            <p>
              We research product specs, manufacturer documentation and safety guidance, then write guides for readers who want a clear
              recommendation. Read <Link href="/how-we-review/">how we review</Link>.
            </p>
          </div>
        </section>
      </article>

      {related.length > 0 && (
        <section className="related" aria-labelledby="rel">
          <h2 id="rel" className="section-h">Related guides</h2>
          <div className="grid">{related.map((o) => <PostCard key={o.slug} p={o} />)}</div>
        </section>
      )}
    </main>
  );
}
