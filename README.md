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

## Information architecture

The public-facing site is intentionally professional-first. Primary navigation should contain only About, 0199, Career, Digital, Media, GRID EATER and Contact.

`/my-account/` is a deeper long-form personal/public-history record and must not be placed in the primary navigation or promoted from the homepage. It is deliberately reached through a subtle link near the bottom of the About page.

Personal subsections belong beneath `/my-account/`. The Denise Ruck subsection lives at `/my-account/denise-ruck/`; the legacy `/my-sister/` path redirects there and should not be restored as a standalone top-level section.

## Content policy

The `/my-account/` page and its subsections are intentionally first-person primary-source accounts. Personal recollections, disputed details and interpretations are attributed as such. Do not silently rewrite them as neutral third-party facts.

## SEO

The site includes canonical URLs, Person/ProfilePage structured data, `sameAs` social identity links, sitemap, robots.txt, llms.txt and first-person biography/history content. General professional searches and AI summaries should prioritise the professional pages; deeper personal-history material is secondary context.
