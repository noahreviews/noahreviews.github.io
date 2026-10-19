import Link from 'next/link';
import { CATEGORIES } from '@/lib/site';
import { fmtDate, type Post } from '@/lib/posts';

export default function PostCard({ p, big = false }: { p: Post; big?: boolean }) {
  return (
    <article className={big ? 'card card--big' : 'card'}>
      <Link href={`/${p.slug}/`} className="card-img" tabIndex={-1} aria-hidden="true">
        <img src={p.image} alt="" loading={big ? 'eager' : 'lazy'} width={p.imageW} height={p.imageH} />
      </Link>
      <div className="card-body">
        <p className="kicker">{CATEGORIES[p.category]?.name}</p>
        <h3><Link href={`/${p.slug}/`}>{p.title}</Link></h3>
        <p className="card-desc">{p.description}</p>
        <p className="meta">Updated {fmtDate(p.updated || p.date)} · {p.readingMinutes} min read</p>
      </div>
    </article>
  );
}
