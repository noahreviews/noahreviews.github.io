import type { Metadata } from 'next';
import Link from 'next/link';
import Page from '@/components/Page';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'How We Review', description: `The research process, editorial standards and corrections policy behind every ${SITE.name} guide.`, alternates: { canonical: '/how-we-review/' } };

export default function HowWeReview() {
  return (
    <Page title="How we review">
      <h2>1. Start from real questions</h2>
      <p>Every guide answers something people actually search for. We check search demand in Google&apos;s own tools before we write.</p>
      <h2>2. Research the specs that matter</h2>
      <p>
        We read manufacturer listings and documentation and compare product types side by side: size, power, weather rating, control
        options and limits. When a spec decides whether a product suits you (for example, whether a power adapter is included), we say so.
      </p>
      <h2>3. Source safety and technical claims</h2>
      <p>Safety advice and technical definitions link to their sources, such as the NFPA or the IEC rating system, in a Sources section.</p>
      <h2>4. Separate advice from partnerships</h2>
      <p>
        Partner links are disclosed at the top of each guide and marked <code>rel=&quot;sponsored&quot;</code>. We include cheaper or
        simpler alternatives when they would serve you better. See our <Link href="/affiliate-disclosure/">affiliate disclosure</Link>.
      </p>
      <h2>5. Keep guides current</h2>
      <p>Each guide shows the date it was last reviewed. We update guides when products, prices or advice change.</p>
      <h2>Corrections</h2>
      <p>Spotted a mistake? <Link href="/contact/">Tell us</Link> and we will check it and correct the guide.</p>
    </Page>
  );
}
