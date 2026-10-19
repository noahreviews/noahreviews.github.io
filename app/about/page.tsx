import type { Metadata } from 'next';
import Link from 'next/link';
import Page from '@/components/Page';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'About Us', description: `Who runs ${SITE.name}, what we cover and how we are funded.`, alternates: { canonical: '/about/' } };

export default function About() {
  return (
    <Page title={`About ${SITE.name}`}>
      <p>
        {SITE.name} publishes buying guides and product reviews for home, holiday and everyday products. Our goal is simple: explain
        what actually matters before you buy, in plain English, and be upfront about the downsides.
      </p>
      <h2>What we cover</h2>
      <p>
        We started with holiday lighting (Christmas curtain lights, animated window displays, smart lights and balcony decorating) and add
        new categories over time.
      </p>
      <h2>How we are funded</h2>
      <p>
        Some brands we cover are partners, including Lumalyn. When a guide links to a partner, we say so at the top of the page and mark
        the link as sponsored. Details are in our <Link href="/affiliate-disclosure/">affiliate disclosure</Link>.
      </p>
      <h2>Our standards</h2>
      <p>
        Read <Link href="/how-we-review/">how we review</Link> for our research process and corrections policy, or{' '}
        <Link href="/contact/">contact us</Link> with a question or correction.
      </p>
    </Page>
  );
}
