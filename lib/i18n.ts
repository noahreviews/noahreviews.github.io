import fs from 'node:fs';
import path from 'node:path';

export type Lang = 'en' | 'en-gb' | 'de' | 'fr' | 'es' | 'it' | 'nl' | 'pl' | 'pt' | 'sv';

/**
 * URL code → hreflang, Open Graph locale, date locale, the partner store's locale path and the short label in the switcher.
 * /en/ is the US edition and also the generic "en" answer for English readers outside the UK; /en-gb/ is the UK edition.
 */
export const LANGS: { code: Lang; hreflang: string; also?: string[]; og: string; date: string; store: string; short: string }[] = [
  { code: 'en', hreflang: 'en-US', also: ['en'], og: 'en_US', date: 'en-US', store: '', short: 'EN/US' },
  { code: 'en-gb', hreflang: 'en-GB', og: 'en_GB', date: 'en-GB', store: '', short: 'EN/UK' },
  { code: 'de', hreflang: 'de', og: 'de_DE', date: 'de-DE', store: 'de', short: 'DE' },
  { code: 'fr', hreflang: 'fr', og: 'fr_FR', date: 'fr-FR', store: 'fr', short: 'FR' },
  { code: 'es', hreflang: 'es', og: 'es_ES', date: 'es-ES', store: 'es', short: 'ES' },
  { code: 'it', hreflang: 'it', og: 'it_IT', date: 'it-IT', store: 'it', short: 'IT' },
  { code: 'nl', hreflang: 'nl', og: 'nl_NL', date: 'nl-NL', store: 'nl', short: 'NL' },
  { code: 'pl', hreflang: 'pl', og: 'pl_PL', date: 'pl-PL', store: 'pl', short: 'PL' },
  { code: 'pt', hreflang: 'pt-PT', og: 'pt_PT', date: 'pt-PT', store: 'pt', short: 'PT' },
  { code: 'sv', hreflang: 'sv', og: 'sv_SE', date: 'sv-SE', store: 'sv', short: 'SV' },
];

/** Languages that have a messages file (translations land one language at a time). */
export const ACTIVE: Lang[] = LANGS.map((l) => l.code).filter((c) => fs.existsSync(path.join(process.cwd(), 'messages', `${c}.json`)));

export const langInfo = (code: string) => LANGS.find((l) => l.code === code) || LANGS[0];

/** Every hreflang value a language's pages answer for, paired with the URL (the US edition also answers for generic "en"). */
export const hreflangPairs = (code: string, url: string): [string, string][] => {
  const l = langInfo(code);
  return [l.hreflang, ...(l.also || [])].map((h) => [h, url]);
};

/** Distinct languages (English US and UK count once). */
export const languageCount = () => new Set(ACTIVE.map((l) => l.split('-')[0])).size;
export const isLang = (s: string): s is Lang => ACTIVE.includes(s as Lang);

export type Messages = typeof import('../messages/en.json');
const cache = new Map<string, Messages>();
export function t(lang: string): Messages {
  if (!cache.has(lang)) cache.set(lang, JSON.parse(fs.readFileSync(path.join(process.cwd(), 'messages', `${lang}.json`), 'utf8')));
  return cache.get(lang)!;
}

export const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''));

/** Partner store in the reader's language; Christian guides go to the store's Christian edition page. */
export function storeUrl(lang: string, christian = false) {
  const p = langInfo(lang).store;
  const base = `https://lumalyn.store/${p ? `${p}/` : ''}`;
  return christian ? `${base}pages/christian-christmas-lights` : base;
}

export const fmtDate = (d: string, lang: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString(langInfo(lang).date, { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** A landing page on the partner store, in the reader's language. */
export function storePageUrl(lang: string, handle: string) {
  const p = langInfo(lang).store;
  return `https://lumalyn.store/${p ? `${p}/` : ''}pages/${handle}`;
}
