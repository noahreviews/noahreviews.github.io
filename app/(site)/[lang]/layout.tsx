import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fraunces, Inter } from 'next/font/google';
import Flag from '@/components/Flag';
import JsonLd from '@/components/JsonLd';
import { ACTIVE, isLang, langInfo, storeUrl, t } from '@/lib/i18n';
import { CATEGORY_KEYS, SITE } from '@/lib/site';
import '../../globals.css';

// Only the latin subset is preloaded; latin-ext (Polish ą ś ł …) still loads on demand via unicode-range.
const serif = Fraunces({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => ACTIVE.map((lang) => ({ lang }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const m = t(lang);
  return {
    metadataBase: new URL(SITE.url),
    title: { default: m.homeTitle, template: `%s | ${SITE.name}` },
    description: m.siteDescription,
    applicationName: SITE.name,
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      locale: langInfo(lang).og,
      alternateLocale: ACTIVE.filter((l) => l !== lang).map((l) => langInfo(l).og),
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: `${SITE.name}: ${m.tagline}` }],
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  };
}

export const viewport: Viewport = { themeColor: '#14532d', colorScheme: 'light' };

// Point each language in the switcher at the current page's translation, using the hreflang links in <head>.
const SWITCHER_JS = `document.querySelectorAll('[data-lang-link]').forEach(function(a){var l=document.querySelector('link[rel="alternate"][hreflang="'+a.getAttribute('hreflang')+'"]');if(l)a.href=l.href})`;

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const m = t(lang);
  return (
    <html lang={langInfo(lang).hreflang} className={`${serif.variable} ${sans.variable}`}>
      <body>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              { '@type': 'Organization', '@id': `${SITE.url}/#org`, name: SITE.name, url: SITE.url, logo: { '@type': 'ImageObject', url: `${SITE.url}/images/logo.png`, width: 512, height: 512 }, sameAs: [SITE.repo] },
              { '@type': 'WebSite', '@id': `${SITE.url}/${lang}/#website`, name: SITE.name, url: `${SITE.url}/${lang}/`, publisher: { '@id': `${SITE.url}/#org` }, inLanguage: langInfo(lang).hreflang },
            ],
          }}
        />
        <a className="skip" href="#content">{m.skip}</a>
        <div className="topbar">
          <ul className="wrap wide">
            {m.home.trust.map((x) => <li key={x.title}>{x.title}</li>)}
          </ul>
        </div>
        <header className="site-header">
          <div className="wrap wide">
            <Link href={`/${lang}/`} className="brand" aria-label={SITE.name}>
              <svg viewBox="0 0 64 64" width="26" height="26" aria-hidden="true"><rect width="64" height="64" rx="14" fill="currentColor" /><path d="M32 10l5.2 16.8L54 32l-16.8 5.2L32 54l-5.2-16.8L10 32l16.8-5.2z" fill="var(--gold)" /></svg>
              <span>{SITE.name}</span>
            </Link>
            <nav aria-label="Main">
              {CATEGORY_KEYS.map((k) => <Link key={k} href={`/${lang}/category/${k}/`}>{m.categories[k].name}</Link>)}
              <Link href={`/${lang}/how-we-review/`}>{m.nav.howWeReview}</Link>
              <Link href={`/${lang}/about/`}>{m.nav.about}</Link>
              <a className="btn btn-sm" href={storeUrl(lang)} rel="sponsored noopener" title={m.post.partnerLink}>{m.nav.topPick} →</a>
              <details className="lang-menu">
                <summary><span className="sr-only">{m.nav.language}: </span><Flag lang={lang} /> <span>{lang.toUpperCase()}</span></summary>
                <ul>
                  {ACTIVE.map((l) => (
                    <li key={l}>
                      <a href={`/${l}/`} hrefLang={langInfo(l).hreflang} lang={langInfo(l).hreflang} data-lang-link aria-current={l === lang ? 'true' : undefined}>
                        <Flag lang={l} /> {t(l).langName}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </nav>
          </div>
        </header>
        <div id="content">{children}</div>
        <footer className="site-footer">
          <div className="wrap wide footer-grid">
            <div>
              <p className="brand-foot">{SITE.name}</p>
              <p>{m.tagline}.</p>
            </div>
            <div>
              <p className="foot-h">{m.footer.categories}</p>
              {CATEGORY_KEYS.map((k) => <Link key={k} href={`/${lang}/category/${k}/`}>{m.categories[k].name}</Link>)}
            </div>
            <div>
              <p className="foot-h">{m.footer.policies}</p>
              {(['how-we-review', 'affiliate-disclosure', 'privacy', 'contact'] as const).map((k) => (
                <Link key={k} href={`/${lang}/${k}/`}>{m.pages[k]}</Link>
              ))}
            </div>
          </div>
          <div className="wrap wide fine">
            <p>{m.footer.disclosure} <Link href={`/${lang}/affiliate-disclosure/`}>{m.footer.disclosureLink}</Link>.</p>
            <ul className="foot-langs">
              {ACTIVE.map((l) => (
                <li key={l}><a href={`/${l}/`} hrefLang={langInfo(l).hreflang} lang={langInfo(l).hreflang} data-lang-link><Flag lang={l} size={18} /> {t(l).langName}</a></li>
              ))}
            </ul>
            <p>© {new Date().getFullYear()} {SITE.name}</p>
          </div>
        </footer>
        <script dangerouslySetInnerHTML={{ __html: SWITCHER_JS }} />
      </body>
    </html>
  );
}
