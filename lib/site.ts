export const SITE = {
  name: 'Noah Reviews',
  url: 'https://noahreviews.github.io',
  tagline: 'Practical reviews and buying guides for home, holiday and everyday products',
  description:
    'Noah Reviews publishes practical buying guides and product reviews for home, holiday and everyday products, with clear disclosures and sourced advice.',
  author: 'Noah Reviews Editorial Team',
  repo: 'https://github.com/noahreviews/noahreviews.github.io',
  ogImage: 'https://noahreviews.github.io/images/noah-reviews-banner.jpg',
};

/** Partner store links. Every guide ends with one of these; Christian guides open the store's #christian view. */
export const STORE = 'https://lumalyn.store/';
export const STORE_CHRISTIAN = 'https://lumalyn.store/#christian';

export const CATEGORIES: Record<string, { name: string; blurb: string }> = {
  'holiday-lighting': {
    name: 'Holiday Lighting',
    blurb: 'Christmas curtain lights, animated window displays, smart lights and balcony ideas.',
  },
};
