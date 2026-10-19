import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { getAllPosts } from '@/lib/posts';
import { CATEGORIES, SITE } from '@/lib/site';

export default function Home() {
  const posts = getAllPosts();
  const [lead, ...rest] = posts;
  return (
    <main className="wrap wide">
      <section className="hero">
        <p className="kicker">Buying guides & reviews</p>
        <h1>{SITE.tagline}</h1>
        <p className="lede">
          We compare product types, explain the specs that matter and point out the limits as well as the strengths, so you can buy once and buy right.
        </p>
        <ul className="trust" aria-label="Our standards">
          <li><strong>Clear disclosures</strong><span>Partner links are labelled on every page.</span></li>
          <li><strong>Sourced advice</strong><span>Safety and spec claims link to their sources.</span></li>
          <li><strong>Kept up to date</strong><span>Every guide shows when it was last reviewed.</span></li>
        </ul>
      </section>

      {lead && (
        <section aria-labelledby="latest">
          <h2 id="latest" className="section-h">Latest guides</h2>
          <PostCard p={lead} big />
          <div className="grid">{rest.map((p) => <PostCard key={p.slug} p={p} />)}</div>
        </section>
      )}

      <section aria-labelledby="cats" className="cats">
        <h2 id="cats" className="section-h">Browse by category</h2>
        <div className="grid">
          {Object.entries(CATEGORIES).map(([k, c]) => (
            <Link key={k} href={`/category/${k}/`} className="cat">
              <strong>{c.name}</strong>
              <span>{c.blurb}</span>
              <em>{posts.filter((p) => p.category === k).length} guides →</em>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
