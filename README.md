# Noah Reviews

Practical reviews and buying guides for home, holiday and everyday products, built with Next.js and published on
GitHub Pages. Live at **https://noahreviews.github.io**.

Each guide targets a keyword that people really search for on Google, so the site can reach readers organically.
The first category is **Holiday Lighting**; new categories are added as `CATEGORIES` in `lib/site.ts`.

The site is affiliated with [Lumalyn](https://lumalyn.store/). Every guide discloses this at the top, marks partner links
`rel="sponsored"` and ends with a link to https://lumalyn.store/ (Christian guides link to https://lumalyn.store/#christian).

## Keyword research

Volumes come from **Google Ads Keyword Planner**, location **United States**, all languages, Google Search,
October 2025 – September 2026. The account has no ad spend, so Keyword Planner shows ranges rather than exact numbers.
Candidate keywords were collected from Google Autocomplete first, then checked in Keyword Planner.

| Guide | Main keyword | Avg. monthly searches | Supporting keywords (monthly searches) |
|---|---|---|---|
| [Christmas Curtain Lights](https://noahreviews.github.io/christmas-curtain-lights/) | christmas curtain lights | 1K – 10K | led curtain lights (1K – 10K), christmas curtain lights outdoor (100 – 1K), christmas curtain lights for windows (100 – 1K), led curtain lights outdoor (100 – 1K), window curtain lights christmas (10 – 100) |
| [Animated Christmas Lights](https://noahreviews.github.io/animated-christmas-lights/) | animated christmas lights | 1K – 10K | animated christmas lights outdoor (100 – 1K), animated christmas lights for windows (10 – 100) |
| [Programmable & Smart Christmas Lights](https://noahreviews.github.io/programmable-christmas-lights/) | programmable christmas lights | 1K – 10K | smart christmas lights (1K – 10K), app controlled christmas lights (100 – 1K), smart christmas lights outdoor (100 – 1K), smart led curtain lights (100 – 1K), pixel christmas lights (100 – 1K), led curtain lights programmable (10 – 100) |
| [Indoor Christmas Window Lights](https://noahreviews.github.io/christmas-window-lights-indoor/) | christmas window lights indoor | 1K – 10K | christmas window lights (1K – 10K) |
| [Christmas Lights for an Apartment Balcony](https://noahreviews.github.io/christmas-lights-for-apartment-balcony/) | christmas lights for apartment balcony | 100 – 1K | balcony christmas lights (100 – 1K), balcony christmas lights ideas (100 – 1K), christmas lights balcony railing (10 – 100), best christmas lights for apartment balcony (10 – 100), outdoor christmas lights for apartment balcony (10 – 100), how to hang christmas lights on balcony (10 – 100), outdoor curtain lights for balcony (10 – 100) |
| [Sync Christmas Lights to Music](https://noahreviews.github.io/christmas-lights-to-music/) | christmas lights to music | 100 – 1K | music sync christmas lights (100 – 1K), music synchronized christmas lights (100 – 1K) |
| [Nativity Christmas Lights](https://noahreviews.github.io/nativity-christmas-lights/) | nativity christmas lights | 100 – 1K | christian christmas lights (10 – 100), religious christmas lights (10 – 100), nativity christmas lights outdoor (10 – 100) |

Searches for all of these climb sharply from October to December, so the posts are published ahead of the season.
The nativity guide links to `lumalyn.store/#christian`, which shows the store's Christian image set.

## How it works

- `content/posts/*.md` – one Markdown file per guide, with title, description and target keyword in the front matter.
  `{{store}}` in a post becomes a link to https://lumalyn.store/ (`{{store#christian}}` → https://lumalyn.store/#christian).
  Every guide also ends with a "Visit lumalyn.store" box; Christian guides point it at the #christian view.
- `app/` – Next.js App Router pages, exported as static HTML (`output: 'export'`).
- Each post gets its own title, meta description, canonical URL, Open Graph tags and `Article` structured data.
  `sitemap.xml` and `robots.txt` are generated at build time.
- `.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`.

## Run locally

```bash
npm install
npm run dev
```

`npm run build` writes the static site to `out/`.

## Adding a guide

1. Check the keyword in Google Ads Keyword Planner and add it to the table above.
2. Create `content/posts/<slug>.md` with `title`, `description`, `keyword`, `date` and `image`.
3. Push to `main`; the site redeploys automatically.
