import type { Metadata } from 'next';
import Flag from '@/components/Flag';
import { ACTIVE, langInfo, t } from '@/lib/i18n';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name}: Buying Guides & Product Reviews`,
  description: t('en').siteDescription,
  alternates: {
    canonical: '/',
    languages: { ...Object.fromEntries(ACTIVE.map((l) => [langInfo(l).hreflang, `/${l}/`])), 'x-default': '/' },
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
          __html: `(function(){var a=${langs};var p=(navigator.languages||[navigator.language||'en']);for(var i=0;i<p.length;i++){var c=String(p[i]).slice(0,2).toLowerCase();if(a.indexOf(c)>-1){location.replace('/'+c+'/');return}}location.replace('/en/')})();`,
        }}
      />
      <p className="brand-big">✦ {SITE.name}</p>
      <h1>{t('en').chooser.title}</h1>
      <p className="lede">{t('en').chooser.intro}</p>
      <ul className="lang-grid">
        {ACTIVE.map((l) => (
          <li key={l}>
            <a href={`/${l}/`} hrefLang={langInfo(l).hreflang} lang={langInfo(l).hreflang}>
              <Flag lang={l} size={28} />
              <span>{t(l).langName}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
