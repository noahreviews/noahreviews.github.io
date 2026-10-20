import type { Metadata } from 'next';
import Flag from '@/components/Flag';
import { ACTIVE, hreflangPairs, langInfo, t } from '@/lib/i18n';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name}: Buying Guides & Product Reviews`,
  description: t('en').siteDescription,
  alternates: {
    canonical: '/',
    languages: { ...Object.fromEntries(ACTIVE.flatMap((l) => hreflangPairs(l, `/${l}/`))), 'x-default': '/' },
  },
  openGraph: { type: 'website', siteName: SITE.name, url: SITE.url, images: [{ url: SITE.ogImage, width: 1200, height: 630 }] },
};

/** Language chooser at the site root (x-default). Visitors are sent to their browser language when we have it. */
export default function Root() {
  const langs = JSON.stringify(ACTIVE);
  return (
    <main className="wrap chooser">
      <script
        dangerouslySetInnerHTML={{
          // exact match first (en-GB → /en-gb/), then the base language (en-US, en-CA … → /en/)
          __html: `(function(){var a=${langs};var p=(navigator.languages||[navigator.language||'en']);for(var i=0;i<p.length;i++){var f=String(p[i]).toLowerCase(),c=f.slice(0,2);if(a.indexOf(f)>-1){location.replace('/'+f+'/');return}if(a.indexOf(c)>-1){location.replace('/'+c+'/');return}}location.replace('/en/')})();`,
        }}
      />
      <p className="brand-big"><svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true"><rect width="64" height="64" rx="16" fill="currentColor" /><path d="M32 11C33.6 25 39 30.4 53 32 39 33.6 33.6 39 32 53 30.4 39 25 33.6 11 32 25 30.4 30.4 25 32 11Z" fill="#fff" /></svg> {SITE.name}</p>
      <h1>{t('en').chooser.title}</h1>
      <p className="lede">{t('en').chooser.intro}</p>
      <ul className="lang-grid">
        {ACTIVE.map((l) => (
          <li key={l}>
            <a href={`/${l}/`} hrefLang={langInfo(l).hreflang} lang={langInfo(l).hreflang}>
              <Flag lang={l} size={28} />
              <span>{langInfo(l).short}<small>{t(l).langName}</small></span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
