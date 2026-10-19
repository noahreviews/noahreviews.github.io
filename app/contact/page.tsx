import type { Metadata } from 'next';
import Page from '@/components/Page';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'Contact', description: `Questions, corrections or suggestions for ${SITE.name}.`, alternates: { canonical: '/contact/' } };

export default function Contact() {
  return (
    <Page title="Contact us">
      <p>Questions, corrections and suggestions for new guides are welcome.</p>
      <p>
        The quickest way to reach us is to open an issue on our public GitHub repository:{' '}
        <a href={`${SITE.repo}/issues`} rel="noopener" target="_blank">{SITE.repo.replace('https://', '')}/issues</a>. We read every
        message and reply there.
      </p>
      <p>For order questions about a product you bought, please contact the store you bought it from directly.</p>
    </Page>
  );
}
