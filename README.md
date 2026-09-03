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

## Content policy

The `/my-account/` page is intentionally a first-person primary-source account. Personal recollections, disputed details and interpretations are attributed as such. Do not silently rewrite them as neutral third-party facts.

## SEO

The site includes canonical URLs, Person/ProfilePage structured data, `sameAs` social identity links, sitemap, robots.txt, llms.txt and first-person biography/history content.
