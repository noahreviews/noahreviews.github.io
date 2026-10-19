import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { ACTIVE, storeUrl, type Lang } from './i18n';

export type Faq = { q: string; a: string };
export type Source = { title: string; url: string };

export type Post = {
  key: string; // English file name, shared by every translation
  lang: Lang;
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  keyword: string;
  category: string;
  date: string;
  updated?: string;
  image: string;
  imageAlt: string;
  imageW: number;
  imageH: number;
  christian: boolean;
  storePage?: string;
  takeaways: string[];
  faq: Faq[];
  sources: Source[];
  toc: { id: string; text: string }[];
  html: string;
  readingMinutes: number;
};

export const STATIC_PAGES = ['about', 'how-we-review', 'affiliate-disclosure', 'contact', 'privacy'] as const;

const ROOT = path.join(process.cwd(), 'content');
const exists = (p: string) => fs.existsSync(p);

const slugify = (s: string) =>
  s.toLowerCase().replace(/ß/g, 'ss').replace(/ł/g, 'l').replace(/[æ]/g, 'ae').replace(/ø/g, 'o').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&[a-z]+;/g, '').replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Post keys (English file names) available in a language. */
export const postKeys = (lang: string) =>
  exists(path.join(ROOT, 'posts', lang)) ? fs.readdirSync(path.join(ROOT, 'posts', lang)).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3)) : [];

const slugCache = new Map<string, string>();
export function slugOf(lang: string, key: string): string {
  const id = `${lang}/${key}`;
  if (!slugCache.has(id)) {
    const file = path.join(ROOT, 'posts', lang, `${key}.md`);
    slugCache.set(id, exists(file) ? matter(fs.readFileSync(file, 'utf8')).data.slug || key : key);
  }
  return slugCache.get(id)!;
}

export const postPath = (lang: string, key: string) => `/${lang}/${slugOf(lang, key)}/`;

/** Same post in every language that has it: { en: '/en/…/', de: '/de/…/' }. */
export const postAlternates = (key: string) =>
  Object.fromEntries(ACTIVE.filter((l) => postKeys(l).includes(key)).map((l) => [l, postPath(l, key)])) as Record<Lang, string>;

/** Replace {{store}}, {{post:key}} and {{page:key}} placeholders, render Markdown, add heading ids and link rels. */
function render(md: string, lang: string) {
  const body = md
    .replace(/\{\{store(#christian)?\}\}/g, (_, c) => storeUrl(lang, !!c))
    .replace(/\{\{post:([\w-]+)\}\}/g, (_, k) => postPath(lang, k))
    .replace(/\{\{page:([\w-]+)\}\}/g, (_, k) => `/${lang}/${k}/`);
  const toc: { id: string; text: string }[] = [];
  const html = (marked.parse(body, { async: false }) as string)
    .replace(/<h2>(.*?)<\/h2>/g, (_, inner: string) => {
      const id = slugify(inner);
      toc.push({ id, text: inner.replace(/<[^>]+>/g, '') });
      return `<h2 id="${id}">${inner}</h2>`;
    })
    // partner links are marked sponsored (Google's rule for paid/affiliate links); other outbound links get noopener
    .replace(/<a href="(https?:\/\/[^"]+)"/g, (_, href: string) =>
      href.startsWith('https://lumalyn.store')
        ? `<a href="${href}" rel="sponsored noopener"`
        : `<a href="${href}" rel="noopener" target="_blank"`,
    );
  return { html, toc, words: body.split(/\s+/).length };
}

const enFront = (key: string) => matter(fs.readFileSync(path.join(ROOT, 'posts', 'en', `${key}.md`), 'utf8')).data;

export function getPost(lang: Lang, key: string): Post {
  const { data, content } = matter(fs.readFileSync(path.join(ROOT, 'posts', lang, `${key}.md`), 'utf8'));
  const { html, toc, words } = render(content, lang);
  return {
    key,
    lang,
    slug: data.slug || key,
    title: data.title,
    seoTitle: data.seoTitle || data.title,
    description: data.description,
    keyword: data.keyword,
    category: data.category || 'holiday-lighting',
    date: data.date,
    updated: data.updated,
    image: data.image,
    imageAlt: data.imageAlt || '',
    imageW: data.imageW || 1200,
    imageH: data.imageH || 1200,
    christian: !!data.christian,
    storePage: data.storePage || (lang !== 'en' ? enFront(key).storePage : undefined),
    takeaways: data.takeaways || [],
    faq: data.faq || [],
    sources: data.sources || [],
    toc,
    html,
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
}

export const getPosts = (lang: Lang) =>
  postKeys(lang).map((k) => getPost(lang, k)).sort((a, b) => (a.date < b.date ? 1 : -1));

export const findPostBySlug = (lang: Lang, slug: string) => postKeys(lang).find((k) => slugOf(lang, k) === slug);

export type Page = { key: string; title: string; seoTitle: string; description: string; html: string };

export function getPage(lang: Lang, key: string): Page {
  const file = path.join(ROOT, 'pages', lang, `${key}.md`);
  const { data, content } = matter(fs.readFileSync(exists(file) ? file : path.join(ROOT, 'pages', 'en', `${key}.md`), 'utf8'));
  return { key, title: data.title, seoTitle: data.seoTitle || data.title, description: data.description, html: render(content, lang).html };
}
