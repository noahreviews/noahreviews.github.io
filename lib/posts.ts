import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { STORE, STORE_CHRISTIAN } from './site';

export type Faq = { q: string; a: string };
export type Source = { title: string; url: string };

export type Post = {
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
  takeaways: string[];
  faq: Faq[];
  sources: Source[];
  toc: { id: string; text: string }[];
  html: string;
  readingMinutes: number;
};

const DIR = path.join(process.cwd(), 'content/posts');

const slugify = (s: string) =>
  s.toLowerCase().replace(/&[a-z]+;/g, '').replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function getPost(slug: string): Post {
  const { data, content } = matter(fs.readFileSync(path.join(DIR, `${slug}.md`), 'utf8'));
  const body = content.replace(/\{\{store(#christian)?\}\}/g, (_, c) => (c ? STORE_CHRISTIAN : STORE));
  const toc: Post['toc'] = [];
  const html = (marked.parse(body, { async: false }) as string)
    // anchor ids for the table of contents
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
  return {
    slug,
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
    takeaways: data.takeaways || [],
    faq: data.faq || [],
    sources: data.sources || [],
    toc,
    html,
    readingMinutes: Math.max(1, Math.round(body.split(/\s+/).length / 220)),
  };
}

export function getAllPosts(): Post[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => getPost(f.replace(/\.md$/, '')))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const fmtDate = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
