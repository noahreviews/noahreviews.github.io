import type { Metadata } from 'next';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { fill, fmtDate, languageCount, storeUrl, t, type Lang } from '@/lib/i18n';
import { getPosts, postKeys, postPath } from '@/lib/posts';
import { sharedAlternates } from '@/lib/seo';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: { absolute: t(lang).homeTitle }, alternates: { canonical: `/${lang}/`, languages: sharedAlternates('') } };
}

export default async function Home({ params }: Props) {
  const lang = (await params).lang as Lang;
  const m = t(lang);
  const REVIEW_KEY = 'lumalyn-curtain-lights-review';
  const posts = getPosts(lang).filter((p) => p.key !== REVIEW_KEY);
  const hasReview = postKeys(lang).includes(REVIEW_KEY);
  const updated = fmtDate(posts.map((p) => p.updated || p.date).sort().pop() || '', lang);
  return (
    <main className="wrap wide">
      <section className="hero">
        <div>
          <p className="kicker">{m.home.kicker}</p>
          <h1>{m.tagline}</h1>
          <p className="lede">{m.home.lede}</p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href="#latest">{m.home.ctaSecondary}</a>
            <Link className="btn btn-ghost" href={`/${lang}/how-we-review/`}>{m.nav.howWeReview}</Link>
          </div>
        </div>
        <aside className="hero-card" aria-label={m.nav.topPick}>
          <div className="hc-pick">
            <img src={`https://lumalyn.store/cdn/shop/files/lumalyn-v2-1-hero.jpg?width=160&height=160&crop=center`} alt="" width={80} height={80} />
            <div>
              <p className="hc-label">{m.nav.topPick}</p>
              <p className="hc-title">{m.post.ctaTitle}</p>
            </div>
          </div>
          <p className="hc-specs">{m.post.ctaSpecs}</p>
          <a className="btn hc-btn" href={storeUrl(lang)} rel="sponsored noopener">{m.post.ctaCheck} →</a>
          <p className="hero-note">{m.post.partnerLink} · <Link href={`/${lang}/affiliate-disclosure/`}>{m.footer.disclosureLink}</Link></p>
          {hasReview && <p className="hc-review"><Link href={postPath(lang, REVIEW_KEY)}>{m.post.readReview} →</Link></p>}
          <ul className="hc-trust">
            {m.home.trust.map((x) => <li key={x.title}><strong>{x.title}.</strong> {x.text}</li>)}
          </ul>
        </aside>
      </section>
      <section aria-labelledby="latest" className="latest">
        <div className="section-head">
          <h2 id="latest" className="section-h">{m.home.latest}</h2>
          <p className="section-sub">
            {fill(m.home.statGuides, { n: posts.length })} · {fill(m.home.statLangs, { n: languageCount() })} · {fill(m.home.statUpdated, { date: updated })}
          </p>
        </div>
        <div className="grid">{posts.map((p) => <PostCard key={p.key} p={p} />)}</div>
      </section>


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

    </main>
  );
}
