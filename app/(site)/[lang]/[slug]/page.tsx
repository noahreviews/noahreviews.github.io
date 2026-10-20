import type { Metadata } from 'next';
import Link from 'next/link';
import Flag from '@/components/Flag';
import JsonLd from '@/components/JsonLd';
import PostCard from '@/components/PostCard';
import { ACTIVE, fill, fmtDate, langInfo, storePageUrl, storeUrl, t, type Lang } from '@/lib/i18n';
import { findPostBySlug, getPage, getPost, getPosts, postAlternates, postKeys, postPath, slugOf, STATIC_PAGES } from '@/lib/posts';
import { alternatesFrom, sharedAlternates } from '@/lib/seo';
import { cdnSrcSet } from '@/lib/img';
import { SITE } from '@/lib/site';

const REVIEW_KEY = 'lumalyn-curtain-lights-review';

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () =>
  ACTIVE.flatMap((lang) => [...postKeys(lang).map((k) => ({ lang, slug: slugOf(lang, k) })), ...STATIC_PAGES.map((slug) => ({ lang, slug }))]);

const isStatic = (slug: string) => (STATIC_PAGES as readonly string[]).includes(slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = (await params) as { lang: Lang; slug: string };
  if (isStatic(slug)) {
    const pg = getPage(lang, slug);
    return { title: pg.seoTitle, description: pg.description, alternates: { canonical: `/${lang}/${slug}/`, languages: sharedAlternates(`${slug}/`) } };
  }
  const p = getPost(lang, findPostBySlug(lang, slug)!);
  const url = `/${lang}/${p.slug}/`;
  return {
    title: { absolute: p.seoTitle },
    description: p.description,
    alternates: { canonical: url, languages: alternatesFrom(postAlternates(p.key)) },
    openGraph: {
      type: 'article',
      title: p.seoTitle,
      description: p.description,
      url,
      locale: langInfo(lang).og,
      publishedTime: p.date,
      modifiedTime: p.updated || p.date,
      section: t(lang).categories[p.category as 'holiday-lighting']?.name,
      images: [{ url: p.image, width: p.imageW, height: p.imageH, alt: p.imageAlt }],
    },
    twitter: { card: 'summary_large_image', title: p.seoTitle, description: p.description, images: [p.image] },
  };
}

export default async function SlugPage({ params }: Props) {
  const { lang, slug } = (await params) as { lang: Lang; slug: string };
  const m = t(lang);

  if (isStatic(slug)) {
    const pg = getPage(lang, slug);
    return (
      <main className="wrap">
        <article className="post">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href={`/${lang}/`}>{m.breadcrumbHome}</Link> › {pg.title}</nav>
          <h1>{pg.title}</h1>
          <div className="prose" dangerouslySetInnerHTML={{ __html: pg.html }} />
        </article>
      </main>
    );
  }

  const p = getPost(lang, findPostBySlug(lang, slug)!);
  const hasReview = postKeys(lang).includes(REVIEW_KEY) && p.key !== REVIEW_KEY;
  const catName = m.categories[p.category as 'holiday-lighting']?.name;
  const url = `${SITE.url}/${lang}/${p.slug}/`;
  const alts = postAlternates(p.key);
  const related = getPosts(lang).filter((o) => o.key !== p.key && o.category === p.category).slice(0, 3);
  const graph: object[] = [
    {
      '@type': 'Article',
      // Google recommends headlines of 110 characters or fewer
      headline: p.title.length <= 110 ? p.title : p.seoTitle,
      description: p.description,
      image: [p.image],
      inLanguage: langInfo(lang).hreflang,
      datePublished: p.date,
      dateModified: p.updated || p.date,
      author: { '@type': 'Organization', name: m.post.author, url: `${SITE.url}/${lang}/about/` },
      publisher: { '@id': `${SITE.url}/#org` },
      mainEntityOfPage: url,
      articleSection: catName,
      keywords: p.keyword,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: m.breadcrumbHome, item: `${SITE.url}/${lang}/` },
        { '@type': 'ListItem', position: 2, name: catName, item: `${SITE.url}/${lang}/category/${p.category}/` },
        { '@type': 'ListItem', position: 3, name: p.seoTitle, item: url },
      ],
    },
  ];
  if (p.faq.length)
    graph.push({ '@type': 'FAQPage', inLanguage: langInfo(lang).hreflang, mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });

  return (
    <main className="wrap">
      <JsonLd data={{ '@context': 'https://schema.org', '@graph': graph }} />
      <article className="post">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href={`/${lang}/`}>{m.breadcrumbHome}</Link> › <Link href={`/${lang}/category/${p.category}/`}>{catName}</Link>
        </nav>
        <h1>{p.title}</h1>
        <p className="standfirst">{p.description}</p>
        <div className="byline">
          <span className="avatar" aria-hidden="true">NR</span>
          <div>
            <p>{m.post.by} <Link href={`/${lang}/about/`}>{m.post.author}</Link></p>
            <p className="meta">
              {m.post.updated} <time dateTime={p.updated || p.date}>{fmtDate(p.updated || p.date, lang)}</time> · {fill(m.post.minRead, { n: p.readingMinutes })}
            </p>
            <p className="checked"><Link href={`/${lang}/how-we-review/`}>✓ {m.post.checked}</Link></p>
          </div>
        </div>
        <p className="disclosure">
          <span dangerouslySetInnerHTML={{ __html: m.post.disclosure }} /> <Link href={`/${lang}/affiliate-disclosure/`}>{m.post.learnMore}</Link>.
        </p>

        <figure className="lead">
          <img src={p.image} srcSet={cdnSrcSet(p.image)} sizes="(max-width: 740px) calc(100vw - 32px), 708px" alt={p.imageAlt} width={p.imageW} height={p.imageH} />
          <figcaption>{p.imageAlt}. {m.post.imageCredit}</figcaption>
        </figure>

        {p.takeaways.length > 0 && (
          <section className="box takeaways" aria-labelledby="tk">
            <h2 id="tk">{m.post.takeaways}</h2>
            <ul>{p.takeaways.map((x) => <li key={x}>{x}</li>)}</ul>
          </section>
        )}

        {p.key !== REVIEW_KEY && (
        <aside className="pick-inline" aria-label={m.post.pickInline}>
          <a href={storeUrl(lang, p.christian)} rel="sponsored noopener" tabIndex={-1} aria-hidden="true">
            <img
              src={`https://lumalyn.store/cdn/shop/files/${p.christian ? 'lumalyn-christian-1-hero' : 'lumalyn-v2-1-hero'}.jpg?width=240&height=240&crop=center`}
              alt=""
              width={120}
              height={120}
              loading="lazy"
            />
          </a>
          <div>
            <p className="kicker">{m.post.pickInline}</p>
            <p className="pick-title">{m.post.ctaTitle}</p>
            <p className="pick-specs">{m.post.ctaSpecs}</p>
            <ul className="pick-points">
              {m.post.pickPros.map((x) => <li key={x}>{x}</li>)}
              <li className="con">{m.post.pickCon}</li>
            </ul>
            {hasReview && <Link className="pick-review" href={postPath(lang, REVIEW_KEY)}>{m.post.readReview} →</Link>}
          </div>
          <div className="pick-side">
            <a className="btn" href={storeUrl(lang, p.christian)} rel="sponsored noopener">{m.post.ctaCheck} →</a>
            <span className="partner-tag">{m.post.partnerLink}</span>
          </div>
        </aside>
        )}

        {p.toc.length > 2 && (
          <nav className="box toc" aria-labelledby="toc-h">
            <p id="toc-h" className="box-h">{m.post.toc}</p>
            <ol>
              {p.toc.map((x) => <li key={x.id}><a href={`#${x.id}`}>{x.text}</a></li>)}
              {p.faq.length > 0 && <li><a href="#faq">{m.post.faqShort}</a></li>}
            </ol>
          </nav>
        )}

        <div className="prose" dangerouslySetInnerHTML={{ __html: p.html }} />

        {p.seeAlso.filter((k) => postKeys(lang).includes(k)).length > 0 && (
          <nav className="box see-also" aria-labelledby="see-also">
            <h2 id="see-also">{m.post.seeAlso}</h2>
            <ul>
              {p.seeAlso.filter((k) => postKeys(lang).includes(k)).map((k) => (
                <li key={k}><Link href={postPath(lang, k)}>{getPost(lang, k).title}</Link></li>
              ))}
            </ul>
          </nav>
        )}

        {p.faq.length > 0 && (
          <section className="faq" aria-labelledby="faq">
            <h2 id="faq">{m.post.faq}</h2>
            {p.faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </section>
        )}

        <aside className="cta" aria-label={m.post.ctaTitle}>
          <div>
            <p className="kicker">{p.christian ? m.post.ctaKickerChristian : m.post.ctaKicker}</p>
            <p className="cta-title">{m.post.ctaTitle}</p>
            <p>{m.post.ctaSpecs}</p>
          </div>
          <div className="cta-actions">
            <a className="btn" href={storeUrl(lang, p.christian)} rel="sponsored noopener">{m.post.ctaCheck} →</a>
            <span className="partner-tag">{m.post.partnerLink}</span>
            {p.storePage && <a className="cta-more" href={storePageUrl(lang, p.storePage)} rel="sponsored noopener">{m.post.ctaMore} →</a>}
          </div>
        </aside>

        {p.sources.length > 0 && (
          <section className="sources" aria-labelledby="src">
            <h2 id="src">{m.post.sources}</h2>
            <ul>{p.sources.map((s) => <li key={s.url}><a href={s.url} rel="noopener" target="_blank">{s.title}</a></li>)}</ul>
          </section>
        )}

        <section className="box how-made" aria-labelledby="how-made">
          <h2 id="how-made">{m.post.howMadeTitle}</h2>
          <p>{m.post.howMade} <Link href={`/${lang}/contact/`}>{m.pages.contact} →</Link></p>
        </section>

        <section className="author-box" aria-label={m.post.author}>
          <span className="avatar avatar--lg" aria-hidden="true">NR</span>
          <div>
            <p className="box-h">{m.post.author}</p>
            <p>{m.post.authorBio} <Link href={`/${lang}/how-we-review/`}>{m.post.authorHow}</Link>.</p>
          </div>
        </section>

        {Object.keys(alts).length > 1 && (
          <nav className="read-in" aria-label={m.post.readIn}>
            <p className="box-h">{m.post.readIn}</p>
            <ul>
              {(Object.entries(alts) as [Lang, string][]).filter(([l]) => l !== lang).map(([l, href]) => (
                <li key={l}><a href={href} hrefLang={langInfo(l).hreflang} lang={langInfo(l).hreflang} title={t(l).langName}><Flag lang={l} size={18} /> {langInfo(l).short}<span className="sr-only"> {t(l).langName}</span></a></li>
              ))}
            </ul>
          </nav>
        )}
      </article>

      <div className="sticky-cta" role="complementary" aria-label={m.post.pickInline}>
        <p><strong>Lumalyn · {m.nav.topPick}</strong>{m.post.partnerLink}</p>
        <a className="btn btn-sm" href={storeUrl(lang, p.christian)} rel="sponsored noopener">{m.post.ctaShort} →</a>
      </div>

      {related.length > 0 && (
        <section className="related" aria-labelledby="rel">
          <h2 id="rel" className="section-h">{m.post.related}</h2>
          <div className="grid">{related.map((o) => <PostCard key={o.key} p={o} />)}</div>
        </section>
      )}
    </main>
  );
}
