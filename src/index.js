const RUMBLE_VIDEO_URL = 'https://rumble.com/v6zh68m-selfie-the-chainsmokers.html';

// Global site chrome. These are the single source of truth for every HTML page.
// Keep the public-facing navigation professional-first: deeper personal-history
// material is intentionally reached through contextual links inside the site.
const GLOBAL_HEADER = `<nav class="nav" aria-label="Primary navigation"><a class="brand" href="/" aria-label="David Ruck home">DAR.</a><div class="nav-links"><a href="/about/">About</a><a href="/0199/">0199</a><a href="/career/">Career</a><a href="/digital/">Digital</a><a href="/media/">Media</a><a href="/grid-eater/">GRID EATER</a><a href="/contact/">Contact</a></div></nav>`;

const GLOBAL_FOOTER = `<div class="footer-copy"><strong>David Ruck</strong><br><span>© 2026 · Christchurch, New Zealand · davidaruck.com</span></div><div class="footer-social" aria-label="David Ruck social profiles"><a class="social-link" href="https://substack.com/@davidruck" target="_blank" rel="me noopener noreferrer"><img src="/assets/icons/substack.svg" alt="" width="22" height="22"><span>Substack</span></a><a class="social-link" href="https://www.linkedin.com/in/davidaruck/" target="_blank" rel="me noopener noreferrer"><img src="/assets/icons/linkedin.svg" alt="" width="22" height="22"><span>LinkedIn</span></a><a class="social-link" href="https://www.youtube.com/@AmericaFirstNZ" target="_blank" rel="me noopener noreferrer"><img src="/assets/icons/youtube.svg" alt="" width="22" height="22"><span>YouTube</span></a><a class="social-link" href="https://rumble.com/user/NatalieGWinters" target="_blank" rel="me noopener noreferrer"><img src="/assets/icons/rumble.svg" alt="" width="22" height="22"><span>Rumble</span></a></div><div class="footer-sites"><a href="https://grideater.com" target="_blank" rel="noopener noreferrer">GRID EATER</a><span>·</span><a href="https://americafirst.co.nz" target="_blank" rel="noopener noreferrer">America First Ltd</a><span>·</span><a href="https://nataliegwinters.com" target="_blank" rel="noopener noreferrer">Natalie G. Winters</a></div>`;

class GlobalHeaderHandler {
  element(element) {
    element.setInnerContent(GLOBAL_HEADER, { html: true });
  }
}

class GlobalFooterHandler {
  element(element) {
    element.setInnerContent(GLOBAL_FOOTER, { html: true });
  }
}

class DeniseStoryLinkHandler {
  element(element) {
    element.setAttribute('href', '/my-account/denise-ruck/');
  }
}

class DeniseStoryLabelHandler {
  element(element) {
    element.setInnerContent('Read Story One: Denise Ruck →');
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/my-sister' || url.pathname.startsWith('/my-sister/')) {
      return Response.redirect(`${url.origin}/my-account/denise-ruck/`, 301);
    }

    if (url.pathname === '/api/rumble/my-sister' || url.pathname === '/api/rumble/denise-ruck') {
      const endpoint = `https://rumble.com/api/Media/oembed.json?url=${encodeURIComponent(RUMBLE_VIDEO_URL)}`;

      try {
        const response = await fetch(endpoint, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'davidaruck.com/1.0'
          }
        });

        if (!response.ok) {
          return Response.json(
            { ok: false, error: `Rumble returned ${response.status}` },
            { status: 502, headers: { 'Cache-Control': 'no-store' } }
          );
        }

        const data = await response.json();
        const match = typeof data.html === 'string'
          ? data.html.match(/src=["']([^"']+)["']/i)
          : null;

        if (!match) {
          return Response.json(
            { ok: false, error: 'Rumble did not return an embed URL' },
            { status: 502, headers: { 'Cache-Control': 'no-store' } }
          );
        }

        return Response.json(
          {
            ok: true,
            src: match[1],
            title: data.title || 'Selfie - The Chainsmokers',
            width: data.width || 1920,
            height: data.height || 1080
          },
          {
            headers: {
              'Cache-Control': 'public, max-age=3600',
              'X-Content-Type-Options': 'nosniff'
            }
          }
        );
      } catch (error) {
        return Response.json(
          { ok: false, error: 'Unable to reach Rumble' },
          { status: 502, headers: { 'Cache-Control': 'no-store' } }
        );
      }
    }

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('text/html')) {
      return response;
    }

    return new HTMLRewriter()
      .on('.site-header', new GlobalHeaderHandler())
      .on('.footer', new GlobalFooterHandler())
      .on('.prose a[href="/my-sister/"]', new DeniseStoryLinkHandler())
      .on('.prose a[href="/my-sister/"] strong', new DeniseStoryLabelHandler())
      .transform(response);
  }
};
