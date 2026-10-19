import type { Metadata } from 'next';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { fill, t, type Lang } from '@/lib/i18n';
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
        <p className="kicker">{m.home.kicker}</p>
        <h1>{m.tagline}</h1>
        <p className="lede">{m.home.lede}</p>
        <ul className="trust">
          {m.home.trust.map((x) => <li key={x.title}><strong>{x.title}</strong><span>{x.text}</span></li>)}
        </ul>
      </section>

      {lead && (
        <section aria-labelledby="latest">
          <h2 id="latest" className="section-h">{m.home.latest}</h2>
          <PostCard p={lead} big />
          <div className="grid">{rest.map((p) => <PostCard key={p.key} p={p} />)}</div>
        </section>
      )}

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
