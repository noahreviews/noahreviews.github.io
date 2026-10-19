import Link from 'next/link';
import { fmtDate, fill, t } from '@/lib/i18n';
import { postPath, type Post } from '@/lib/posts';

export default function PostCard({ p, big = false }: { p: Post; big?: boolean }) {
  const m = t(p.lang);
  const href = postPath(p.lang, p.key);
  return (
    <article className={big ? 'card card--big' : 'card'}>
      <Link href={href} className="card-img" tabIndex={-1} aria-hidden="true">
        <img src={p.image} alt="" loading={big ? 'eager' : 'lazy'} width={p.imageW} height={p.imageH} />
      </Link>
      <div className="card-body">
        <p className="kicker">{(m.categories as Record<string, { name: string }>)[p.category]?.name}</p>
        <h3><Link href={href}>{p.title}</Link></h3>
        <p className="card-desc">{p.description}</p>
        <p className="meta">{m.post.updated} {fmtDate(p.updated || p.date, p.lang)} · {fill(m.post.minRead, { n: p.readingMinutes })}</p>
      </div>
    </article>
  );
}
