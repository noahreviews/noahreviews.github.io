import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Fraunces, Inter } from 'next/font/google';
import JsonLd from '@/components/JsonLd';
import { CATEGORIES, SITE } from '@/lib/site';
import './globals.css';

const serif = Fraunces({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: Buying Guides & Product Reviews`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: SITE.name, url: SITE.url, images: [{ url: SITE.ogImage }] },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf8f2' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1613' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              { '@type': 'Organization', '@id': `${SITE.url}/#org`, name: SITE.name, url: SITE.url, logo: `${SITE.url}/icon.svg`, sameAs: [SITE.repo] },
              { '@type': 'WebSite', '@id': `${SITE.url}/#website`, name: SITE.name, url: SITE.url, publisher: { '@id': `${SITE.url}/#org` }, inLanguage: 'en' },
            ],
          }}
        />
        <a className="skip" href="#content">Skip to content</a>
        <header className="site-header">
          <div className="wrap wide">
            <Link href="/" className="brand" aria-label={`${SITE.name} home`}>
              <svg viewBox="0 0 64 64" width="26" height="26" aria-hidden="true"><rect width="64" height="64" rx="14" fill="currentColor" /><path d="M32 10l5.2 16.8L54 32l-16.8 5.2L32 54l-5.2-16.8L10 32l16.8-5.2z" fill="var(--gold)" /></svg>
              <span>{SITE.name}</span>
            </Link>
            <nav aria-label="Main">
              {Object.entries(CATEGORIES).map(([k, c]) => <Link key={k} href={`/category/${k}/`}>{c.name}</Link>)}
              <Link href="/how-we-review/">How we review</Link>
              <Link href="/about/">About</Link>
            </nav>
          </div>
        </header>
        <div id="content">{children}</div>
        <footer className="site-footer">
          <div className="wrap wide footer-grid">
            <div>
              <p className="brand-foot">{SITE.name}</p>
              <p>{SITE.tagline}.</p>
            </div>
            <div>
              <p className="foot-h">Categories</p>
              {Object.entries(CATEGORIES).map(([k, c]) => <Link key={k} href={`/category/${k}/`}>{c.name}</Link>)}
            </div>
            <div>
              <p className="foot-h">Trust & policies</p>
              <Link href="/how-we-review/">How we review</Link>
              <Link href="/affiliate-disclosure/">Affiliate disclosure</Link>
              <Link href="/privacy/">Privacy</Link>
              <Link href="/contact/">Contact</Link>
            </div>
          </div>
          <div className="wrap wide fine">
            <p>Some links on this site are partner links. We may earn from qualifying purchases at no extra cost to you. See our <Link href="/affiliate-disclosure/">affiliate disclosure</Link>.</p>
            <p>© {new Date().getFullYear()} {SITE.name}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
