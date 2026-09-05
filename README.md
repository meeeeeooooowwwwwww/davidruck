# davidaruck.com

Official personal website for David Ruck, deployed as a Cloudflare Workers static-assets project.

## Production

- Domain: https://davidaruck.com
- Worker: `davidaruck-site`
- Cloudflare account: existing production account configured by the owner
- Static assets: `./public`

## Deploy

```bash
npm install
npx wrangler deploy
```

Wrangler will deploy the existing custom-domain routes defined in `wrangler.jsonc`.

## Global header and footer

The site header and footer are global server-side components defined in `src/index.js` as `GLOBAL_HEADER` and `GLOBAL_FOOTER`.

They use the professional homepage navigation and the full homepage footer as the single source of truth for all HTML pages. Do not maintain page-specific header or footer variants. When the site-wide header or footer changes, update the global component once in `src/index.js`.

`wrangler.jsonc` routes HTML/page paths through the Worker so `HTMLRewriter` applies the global components. Static assets such as CSS, icons and images are not deliberately routed through the Worker.

## Information architecture

The public-facing site is intentionally professional-first. Primary navigation should contain only About, 0199, Career, Digital, Media, GRID EATER and Contact.

`/my-account/` is a deeper long-form personal/public-history record and must not be placed in the primary navigation or promoted from the homepage. It is deliberately reached through a subtle link near the bottom of the About page.

Personal subsections belong beneath `/my-account/`. The Denise Ruck subsection lives at `/my-account/denise-ruck/`; the legacy `/my-sister/` path redirects there and should not be restored as a standalone top-level section.

## Content policy

The `/my-account/` page and its subsections are intentionally first-person primary-source accounts. Personal recollections, disputed details and interpretations are attributed as such. Do not silently rewrite them as neutral third-party facts.

## SEO

The site includes canonical URLs, Person/ProfilePage structured data, `sameAs` social identity links, sitemap, robots.txt, llms.txt and first-person biography/history content. General professional searches and AI summaries should prioritise the professional pages; deeper personal-history material is secondary context.
