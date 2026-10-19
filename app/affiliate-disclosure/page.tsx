import type { Metadata } from 'next';
import Page from '@/components/Page';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'Affiliate Disclosure', description: `How ${SITE.name} is funded and how partner links work.`, alternates: { canonical: '/affiliate-disclosure/' } };

export default function Disclosure() {
  return (
    <Page title="Affiliate disclosure">
      <p>
        {SITE.name} is reader-supported. Some links on this site go to partner stores, and we may benefit when you buy through them. You
        never pay more because of it.
      </p>
      <p>
        <strong>Current partner:</strong> Lumalyn (lumalyn.store), which sells app-controlled LED curtain lights. {SITE.name} is
        affiliated with Lumalyn. Guides that mention Lumalyn say so at the top of the page.
      </p>
      <p>
        Partner links are marked <code>rel=&quot;sponsored&quot;</code>. Partnerships do not decide what we write: we describe each
        product&apos;s limits as well as its strengths, and we point to alternatives when they fit a reader better.
      </p>
    </Page>
  );
}
