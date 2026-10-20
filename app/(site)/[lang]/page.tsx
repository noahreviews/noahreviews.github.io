import type { Metadata } from 'next';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { fill, fmtDate, languageCount, storeUrl, t, type Lang } from '@/lib/i18n';
import { cdnSrcSet } from '@/lib/img';
import { getPosts } from '@/lib/posts';
import { sharedAlternates } from '@/lib/seo';
import { CATEGORY_KEYS } from '@/lib/site';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: { absolute: t(lang).homeTitle }, alternates: { canonical: `/${lang}/`, languages: sharedAlternates('') } };
}

export default async function Home({ params }: Props) {
  const lang = (await params).lang as Lang;
  const m = t(lang);
  const posts = getPosts(lang);
  const [lead, ...rest] = posts;
  return (
    <main className="wrap wide">
      <section className="hero">
        <div>
          <p className="kicker">{m.home.kicker}</p>
          <h1>{m.tagline}</h1>
          <p className="lede">{m.home.lede}</p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href={storeUrl(lang)} rel="sponsored noopener">{m.home.ctaPrimary} →</a>
            <a className="btn btn-ghost" href="#latest">{m.home.ctaSecondary}</a>
          </div>
          <ul className="hero-trust">
            {m.home.trust.map((x) => <li key={x.title}>{x.title}</li>)}
          </ul>
          <p className="hero-note">{m.post.partnerLink} · <Link href={`/${lang}/affiliate-disclosure/`}>{m.footer.disclosureLink}</Link></p>
        </div>
        <div className="hero-media">
          <img
            src="https://lumalyn.store/cdn/shop/files/lumalyn-f1-designs.jpg?width=900"
            srcSet={cdnSrcSet('https://lumalyn.store/cdn/shop/files/lumalyn-f1-designs.jpg?width=900', [480, 720, 900])}
            sizes="(max-width: 860px) calc(100vw - 32px), 500px"
            alt={m.home.kicker}
            width={900}
            height={765}
            fetchPriority="high"
          />
          <a className="hero-badge" href={storeUrl(lang)} rel="sponsored noopener">
            <span>
              <span>{m.nav.topPick}</span>
              <strong>{m.post.ctaTitle}</strong>
            </span>
            <em>{m.post.ctaShort} →</em>
          </a>
        </div>
      </section>
      <ul className="stats" aria-label={m.home.whyTitle}>
        <li>{fill(m.home.statGuides, { n: posts.length })}</li>
        <li>{fill(m.home.statLangs, { n: languageCount() })}</li>
        <li>{m.home.statSources}</li>
        <li>{fill(m.home.statUpdated, { date: fmtDate(posts.map((p) => p.updated || p.date).sort().pop() || '', lang) })}</li>
      </ul>

      {lead && (
        <section aria-labelledby="latest">
          <h2 id="latest" className="section-h">{m.home.latest}</h2>
          <PostCard p={lead} big />
          <div className="grid">{rest.map((p) => <PostCard key={p.key} p={p} />)}</div>
        </section>
      )}

      <aside className="pick" aria-label={m.post.ctaTitle}>
        <a className="pick-img" href={storeUrl(lang)} rel="sponsored noopener" tabIndex={-1} aria-hidden="true">
          <img
            src="https://lumalyn.store/cdn/shop/files/lumalyn-v2-1-hero.jpg?width=800"
            srcSet={cdnSrcSet('https://lumalyn.store/cdn/shop/files/lumalyn-v2-1-hero.jpg?width=800', [480, 640, 800])}
            sizes="(max-width: 760px) calc(100vw - 32px), 420px"
            alt=""
            loading="lazy"
            width={800}
            height={800}
          />
        </a>
        <div className="pick-body">
          <p className="kicker">{m.post.ctaKicker}</p>
          <p className="cta-title">{m.post.ctaTitle}</p>
          <p>{m.post.ctaSpecs}</p>
          <a className="btn" href={storeUrl(lang)} rel="sponsored noopener">{m.post.ctaButton}</a>
          <p className="pick-note">{m.footer.disclosure} <Link href={`/${lang}/affiliate-disclosure/`}>{m.footer.disclosureLink}</Link>.</p>
        </div>
      </aside>

      <section aria-labelledby="why" className="why">
        <h2 id="why" className="section-h">{m.home.whyTitle}</h2>
        <div className="why-grid">
          {m.home.why.map((x, i) => (
            <div key={x.title}>
              <h3>{x.title}</h3>
              <p>{x.text}{i === m.home.why.length - 1 && <> <Link href={`/${lang}/privacy/`}>{m.home.privacyLink}</Link>.</>}</p>
            </div>
          ))}
        </div>
        <p className="why-more"><Link href={`/${lang}/how-we-review/`}>{m.home.howLink}</Link></p>
      </section>

      <section aria-labelledby="cats" className="cats">
        <h2 id="cats" className="section-h">{m.home.browse}</h2>
        <div className="grid">
          {CATEGORY_KEYS.map((k) => (
            <Link key={k} href={`/${lang}/category/${k}/`} className="cat">
              <strong>{m.categories[k].name}</strong>
              <span>{m.categories[k].blurb}</span>
              <em>{fill(m.home.guidesCount, { n: posts.filter((p) => p.category === k).length })}</em>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
