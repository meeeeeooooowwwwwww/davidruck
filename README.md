# davidaruck.com

Official personal and professional website for David Ruck, deployed as a lean Cloudflare Workers static-assets project.

## Production

- Domain: https://davidaruck.com
- Worker: `davidaruck-site`
- Static content: `./public`
- Worker composition and redirects: `./src`
- Runtime framework: none
- Browser dependencies: none

The site deliberately favours static HTML, one shared CSS file and a very small amount of first-party JavaScript over a client-side framework.

## Local development

Use the locked dependency graph:

```bash
npm ci
npm run check
npm run dev
```

Production deploys are handled by GitHub Actions after validation passes on `main`.

## Architecture

### Static pages

All public pages live under `public/`. Each HTML document contains its page-specific metadata and content, plus empty canonical header and footer placeholders.

The Cloudflare Worker fills those placeholders from the single global definitions in `src/index.js`. Do not copy site-wide navigation or footer markup into individual pages.

### CSS

All authored site styling is consolidated in `public/assets/styles.css`.

Avoid adding page-local `<style>` blocks or new override stylesheets unless there is a strong architectural reason. The CI audit rejects the retired CSS-module pattern.

### JavaScript

`public/assets/site.js` contains only shared progressive enhancement:

- production Google Analytics loading;
- the click-to-load YouTube facade.

The homepage does not load a YouTube player until the visitor requests it, and the professional site does not load AdSense.

### Worker

`src/index.js` handles canonical site chrome, legacy redirects, the small Rumble oEmbed endpoint used by the deeper personal-history page, and targeted professional-page copy normalisation.

`src/chapter-enhancements.js` renders chronology and reference cards without remote image hotlinks.

## CI and deployment

Pull requests run validation only. Production deployment happens only from `main`.

The pipeline installs with `npm ci`, runs the regression audit, syntax-checks authored JavaScript, performs a Wrangler dry run, and deploys with one scoped `CLOUDFLARE_API_TOKEN`.

Global Cloudflare API-key fallbacks are intentionally not supported.

Large raster source media is optimised before it is committed. Production deployment does not mutate source files, which keeps builds reproducible and easier to review.

## Regression audit

Run `npm run audit`.

The audit checks every HTML page for exactly one shared stylesheet, canonical empty header/footer placeholders, retired stylesheet references, inline style blocks, AdSense, an eager homepage YouTube embed, homepage brand-image hotlinks, and unexpectedly large raster media.

## Information architecture

The public-facing site is professional-first. Primary navigation contains About, Career, 0199, Media, Music, Digital, GRID EATER and Contact.

`/my-account/` is a deeper long-form personal/public-history record and is intentionally absent from primary navigation. Personal subsections belong beneath `/my-account/`; the legacy `/my-sister/` path redirects to `/my-account/denise-ruck/`.

## Content policy

The `/my-account/` page and its subsections are intentionally first-person primary-source accounts. Personal recollections, disputed details and interpretations are attributed as such. Do not silently rewrite them as neutral third-party facts.

## SEO

The site includes canonical URLs, Person/ProfilePage structured data, `sameAs` identity links, sitemap, robots.txt, llms.txt and first-person biography/history content.

For exact-name searches such as `David Ruck`, the professional pages retain clear visible entity signals without keyword stuffing. The long-form `/my-account/` record remains secondary context rather than primary professional biography.
