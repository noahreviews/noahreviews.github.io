import Link from 'next/link';

export default function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="wrap">
      <article className="post">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> › {title}</nav>
        <h1>{title}</h1>
        <div className="prose">{children}</div>
      </article>
    </main>
  );
}
