const RUMBLE_VIDEO_URL = 'https://rumble.com/v6zh68m-selfie-the-chainsmokers.html';

// Global site chrome. These are the single source of truth for every HTML page.
// Keep the public-facing navigation professional-first: deeper personal-history
// material is intentionally reached through contextual links inside the site.
const GLOBAL_HEADER = `<nav class="nav" aria-label="Primary navigation"><a class="brand" href="/" aria-label="David Ruck home">David Ruck</a><div class="nav-links"><a href="/about/">About</a><a href="/0199/">0199</a><a href="/career/">Career</a><a href="/digital/">Digital</a><a href="/media/">Media</a><a href="/grid-eater/">GRID EATER</a><a href="/contact/">Contact</a></div></nav>`;

const GLOBAL_FOOTER = `<div class="footer-copy"><strong>David Ruck</strong><br><span>© 2026 · Christchurch, New Zealand · davidaruck.com</span></div><div class="footer-social" aria-label="David Ruck social profiles"><a class="social-link" href="https://substack.com/@davidruck" target="_blank" rel="me noopener noreferrer"><img src="/assets/icons/substack.svg" alt="" width="22" height="22"><span>Substack</span></a><a class="social-link" href="https://www.linkedin.com/in/davidaruck/" target="_blank" rel="me noopener noreferrer"><img src="/assets/icons/linkedin.svg" alt="" width="22" height="22"><span>LinkedIn</span></a><a class="social-link" href="https://www.youtube.com/@AmericaFirstNZ" target="_blank" rel="me noopener noreferrer"><img src="/assets/icons/youtube.svg" alt="" width="22" height="22"><span>YouTube</span></a><a class="social-link" href="https://rumble.com/user/NatalieGWinters" target="_blank" rel="me noopener noreferrer"><img src="/assets/icons/rumble.svg" alt="" width="22" height="22"><span>Rumble</span></a></div><div class="footer-sites"><a href="https://grideater.com" target="_blank" rel="noopener noreferrer">GRID EATER</a><span>·</span><a href="https://americafirst.co.nz" target="_blank" rel="noopener noreferrer">America First Ltd</a><span>·</span><a href="https://nataliegwinters.com" target="_blank" rel="noopener noreferrer">Natalie G. Winters</a></div>`;

class GlobalThemeHandler {
  element(element) {
    element.append('<link rel="stylesheet" href="/assets/aurora-theme.css">', { html: true });
  }
}

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

class TextContentHandler {
  constructor(content, html = false) {
    this.content = content;
    this.html = html;
  }

  element(element) {
    element.setInnerContent(this.content, { html: this.html });
  }
}

class MyAccountSourceNoteHandler {
  element(element) {
    element.setInnerContent('<h3>Contemporary record</h3><p>These links are included so readers can distinguish my present-day account and recollection from surviving contemporary reporting. External articles include criticism and viewpoints I do not necessarily agree with.</p><p><a href="https://youtu.be/R2CZyDfmz5s" target="_blank" rel="noopener noreferrer"><strong>TVNZ / Te Karere: Pākehā Party support comparison ↗</strong></a> · <a href="https://www.critic.co.nz/news/article/3086/pakehahaha-are-they-serious" target="_blank" rel="noopener noreferrer">Critic Te Ārohi, 2013 ↗</a> · <a href="https://www.sunlive.co.nz/news/48443-pakeha-party-hits-chord-locals.html" target="_blank" rel="noopener noreferrer">SunLive, 11 July 2013 ↗</a> · <a href="https://natlib.govt.nz/records/32377880" target="_blank" rel="noopener noreferrer">National Library of New Zealand ↗</a></p>', { html: true });
  }
}

function normalisePathname(pathname) {
  if (pathname === '/index.html') return '/';
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = normalisePathname(url.pathname);

    if (pathname === '/my-sister' || pathname.startsWith('/my-sister/')) {
      return Response.redirect(`${url.origin}/my-account/denise-ruck/`, 301);
    }

    if (pathname === '/api/rumble/my-sister' || pathname === '/api/rumble/denise-ruck') {
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

    let rewriter = new HTMLRewriter()
      .on('head', new GlobalThemeHandler())
      .on('.site-header', new GlobalHeaderHandler())
      .on('.footer', new GlobalFooterHandler())
      .on('.prose a[href="/my-sister/"]', new DeniseStoryLinkHandler())
      .on('.prose a[href="/my-sister/"] strong', new DeniseStoryLabelHandler());

    // Professional pages keep the first-person voice, but restore clear visible
    // third-person entity signals for exact-name searches such as "David Ruck".
    if (pathname === '/') {
      rewriter = rewriter.on('.hero-summary', new TextContentHandler('<strong>David Ruck</strong> is a Christchurch-based entrepreneur, sales-systems builder and digital operator. I have worked across hospitality, telecommunications, call centres, business data, media, websites, hosting and digital marketing, and my current focus is AI-assisted infrastructure and business discovery.', true));
      rewriter = rewriter.on('.actions a[href="/about/"]', new TextContentHandler('About David Ruck'));
      rewriter = rewriter.on('.actions a[href="/career/"]', new TextContentHandler('David Ruck career & ventures'));
    }

    if (pathname === '/about') {
      rewriter = rewriter.on('.page-head .lead', new TextContentHandler('<strong>David Ruck</strong> is a Christchurch entrepreneur and systems builder. My career has been unusually broad, but the underlying work has been remarkably consistent: sales, audiences, infrastructure, data and finding better ways to connect businesses with customers.', true));
    }

    if (pathname === '/career') {
      rewriter = rewriter.on('.page-head h1', new TextContentHandler('David Ruck: Career & Ventures'));
      rewriter = rewriter.on('.page-head .lead', new TextContentHandler("David Ruck's career has crossed very different industries, but most of the work comes back to performance, audiences, customer acquisition, systems and technology."));
    }

    if (pathname === '/digital') {
      rewriter = rewriter.on('.page-head h1', new TextContentHandler('David Ruck: Digital Marketing, Websites & Infrastructure'));
      rewriter = rewriter.on('.page-head .lead', new TextContentHandler("David Ruck's digital career grew directly from customer demand around 0199 and became a long-term focus across websites, hosting, domains, search, PPC, analytics, data and automation."));
    }

    if (pathname === '/media') {
      rewriter = rewriter.on('.page-head h1', new TextContentHandler('David Ruck: Radio, Television, Events & Christchurch Culture'));
      rewriter = rewriter.on('.page-head .lead', new TextContentHandler('David Ruck began learning how audiences form through restaurants, parties, rave events, radio and television. Surreal Entertainment began while I was still very young in Christchurch.'));
    }

    if (pathname === '/0199') {
      rewriter = rewriter.on('.page-head h1', new TextContentHandler('David Ruck and the real origin of 0199 Directory Assistance'));
    }

    if (pathname === '/grid-eater') {
      rewriter = rewriter.on('.page-head h1', new TextContentHandler('GRID EATER by David Ruck'));
      rewriter = rewriter.on('.page-head .lead', new TextContentHandler("GRID EATER is David Ruck's current Christchurch project, bringing together the strongest lessons from 0199, digital services, hosting, business data, direct sales and AI-assisted development."));
    }

    if (pathname === '/my-account') {
      rewriter = rewriter.on('.source-note', new MyAccountSourceNoteHandler());
    }

    return rewriter.transform(response);
  }
};
