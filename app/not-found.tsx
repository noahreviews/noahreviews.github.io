import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="wrap">
      <article className="post">
        <h1>Page not found</h1>
        <p>The page you are looking for has moved or does not exist. <Link href="/">Browse all guides</Link>.</p>
      </article>
    </main>
  );
}
