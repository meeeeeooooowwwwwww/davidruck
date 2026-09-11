# davidruck.com information architecture

## Principle

The site should not grow by appending every new memory to `/career/` or `/media/`. Those pages are indexes. Long-form stories get their own canonical pages and the index pages stay readable.

Existing public URLs are treated as permanent. If content moves, the old URL either remains a useful landing page or issues a 301 redirect. Existing fragment links are preserved with a small client-side legacy-anchor bridge because URL fragments are never sent to the Worker.

## Primary tree

- `/` — professional homepage
- `/about/` — concise biography and through-line
- `/career/` — career index and chronology, not the full stories
  - `/career/hospitality/`
  - `/career/hotel-dynamics/` — planned when enough material is documented
  - `/career/telstraclear/`
  - `/career/compass/`
  - `/career/hrv/`
  - `/career/red-vs-blue/` — planned when the fuller story is documented
  - `/career/0199/`
- `/media/` — media/events index, not the complete music autobiography
  - `/media/surreal/`
  - `/media/alt-tv/`
  - `/media/pulzarfm/`
- `/music/` — life in music: choir, Bleach/Nirvana, bands, DJing, influences and production
- `/digital/` — digital career and infrastructure
- `/grid-eater/` — current GRID EATER work
- `/america-first/` — America First Limited context
- `/contact/`
- `/my-account/` — separate long-form personal/public record

## URL preservation

Keep these live:

- `/career/` as the stable career landing page.
- `/media/` as the stable media landing page.
- `/career/telstraclear/`, `/career/hospitality/` and `/career/0199/` as existing canonical deep pages.
- `/0199/` continues to 301 to `/career/0199/`.

Legacy fragment links need browser-side forwarding on `/media/`:

- `/media/#production` → `/music/#production`
- `/media/#pulzar-after-dark` → `/media/pulzarfm/#after-dark`

Do not delete or repurpose an established URL merely because a deeper page is introduced.

## Content rule

When a role or chapter starts accumulating multiple anecdotes, decisions, people, business lessons or later consequences, it becomes its own page. The parent index should then retain only enough copy to explain why the chapter matters and link through.

This keeps the site useful as both a portfolio and a living autobiography without turning any one page into an endless wall of text.
