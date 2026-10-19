import type { Metadata } from 'next';
import Page from '@/components/Page';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'Privacy Policy', description: `What data ${SITE.name} collects (almost none) and why.`, alternates: { canonical: '/privacy/' } };

export default function Privacy() {
  return (
    <Page title="Privacy policy">
      <p>{SITE.name} is a static website. We do not use cookies, analytics trackers, ad networks or sign-up forms.</p>
      <p>
        The site is hosted on GitHub Pages, which may log basic technical data such as IP addresses for security. Product images load
        from our partner&apos;s image servers (Shopify), which receive standard request data when they serve an image.
      </p>
      <p>When you click a partner link, the partner&apos;s own privacy policy applies on their site.</p>
    </Page>
  );
}
