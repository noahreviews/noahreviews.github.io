import { ACTIVE, hreflangPairs, type Lang } from './i18n';

/** hreflang map for a page that exists in every active language under the same path suffix. */
export const sharedAlternates = (suffix: string) => ({
  ...Object.fromEntries(ACTIVE.flatMap((l) => hreflangPairs(l, `/${l}/${suffix}`))),
  'x-default': `/en/${suffix}`,
});

/** hreflang map from { lang: path }. */
export const alternatesFrom = (paths: Partial<Record<Lang, string>>) => ({
  ...Object.fromEntries(Object.entries(paths).flatMap(([l, p]) => hreflangPairs(l, p))),
  ...(paths.en ? { 'x-default': paths.en } : {}),
});
