import { applyChapterEnhancements } from './chapter-enhancements.js';

const RUMBLE_VIDEO_URL = 'https://rumble.com/v6zh68m-selfie-the-chainsmokers.html';

// Global site chrome. These are the single source of truth for every HTML page.
// Keep the public-facing navigation professional-first while giving major
// long-form chapters stable homes of their own.
const GLOBAL_NAV_LINKS = `<a href="/about/">About</a><a href="/career/">Career</a><a href="/career/0199/">0199</a><a href="/media/">Media</a><a href="/music/">Music</a><a href="/digital/">Digital</a><a href="/grid-eater/">GRID EATER</a><a href="/contact/">Contact</a>`;
const GLOBAL_HEADER = `<nav class="nav" aria-label="Primary navigation"><a class="brand" href="/" aria-label="David Ruck home">David Ruck</a><div class="nav-links">${GLOBAL_NAV_LINKS}</div><details class="mobile-nav"><summary aria-label="Open navigation menu"><span class="mobile-nav-icon" aria-hidden="true"><i></i><i></i><i></i></span><span class="mobile-nav-label">MENU</span></summary><div class="mobile-nav-panel">${GLOBAL_NAV_LINKS}</div></details></nav>`;

const GLOBAL_FOOTER = `<div class="footer-copy"><strong>David Ruck</strong><br><span>© 2026 · Christchurch, New Zealand · davidaruck.com</span></div><div class="footer-social" aria-label="David Ruck social profiles"><a class="social-link" href="https://substack.com/@davidruck" target="_blank" rel="me noopener"><img src="/assets/icons/substack.svg" alt="" width="22" height="22"><span>Substack</span></a><a class="social-link" href="https://www.linkedin.com/in/davidaruck/" target="_blank" rel="me noopener"><img src="/assets/icons/linkedin.svg" alt="" width="22" height="22"><span>LinkedIn</span></a><a class="social-link" href="https://www.youtube.com/@AmericaFirstNZ" target="_blank" rel="me noopener"><img src="/assets/icons/youtube.svg" alt="" width="22" height="22"><span>YouTube</span></a><a class="social-link" href="https://rumble.com/user/NatalieGWinters" target="_blank" rel="me noopener"><img src="/assets/icons/rumble.svg" alt="" width="22" height="22"><span>Rumble</span></a></div><div class="footer-sites"><a href="https://grideater.com" target="_blank" rel="noopener">GRID EATER</a><span>·</span><a href="https://americafirst.co.nz" target="_blank" rel="noopener">America First Ltd</a><span>·</span><a href="https://nataliegwinters.com" target="_blank" rel="noopener">Natalie G. Winters</a></div>`;

class GlobalThemeHandler {
  element(element) {
    element.append('<meta name="referrer" content="strict-origin-when-cross-origin"><link rel="stylesheet" href="/assets/aurora-theme.css"><link rel="stylesheet" href="/assets/mobile-nav.css?v=20260912-3"><link rel="stylesheet" href="/assets/chapter-enhancements.css?v=20260913-1">', { html: true });
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

class ExternalReferralLinkHandler {
  element(element) {
    // Preserve opener isolation without suppressing davidruck.com as the referrer.
    const rel = element.getAttribute('rel') || '';
    const tokens = rel.split(/\s+/).filter(Boolean).filter(token => token !== 'noreferrer' && token !== 'noopener');
    tokens.push('noopener');
    element.setAttribute('rel', [...new Set(tokens)].join(' '));
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
    element.setInnerContent('<h3>Contemporary record</h3><p>These links are included so readers can distinguish my present-day account and recollection from surviving contemporary reporting. External articles include criticism and viewpoints I do not necessarily agree with.</p><p><a href="https://youtu.be/R2CZyDfmz5s" target="_blank" rel="noopener"><strong>TVNZ / Te Karere: Pākehā Party support comparison ↗</strong></a> · <a href="https://www.critic.co.nz/news/article/3086/pakehahaha-are-they-serious" target="_blank" rel="noopener">Critic Te Ārohi, 2013 ↗</a> · <a href="https://www.sunlive.co.nz/news/48443-pakeha-party-hits-chord-locals.html" target="_blank" rel="noopener">SunLive, 11 July 2013 ↗</a> · <a href="https://natlib.govt.nz/records/32377880" target="_blank" rel="noopener">National Library of New Zealand ↗</a></p>', { html: true });
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

    if (pathname === '/0199' || pathname === '/0199/index.html') {
      return Response.redirect(`${url.origin}/career/0199/`, 301);
    }

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
      .on('a[target="_blank"]', new ExternalReferralLinkHandler())
      .on('.prose a[href="/my-sister/"]', new DeniseStoryLinkHandler())
      .on('.prose a[href="/my-sister/"] strong', new DeniseStoryLabelHandler());

    rewriter = applyChapterEnhancements(rewriter, pathname);

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
      rewriter = rewriter.on('.page-head .lead', new TextContentHandler("David Ruck's career chapter index: the map of roles and ventures, with each substantial story linked to its own canonical page."));
    }

    if (pathname === '/digital') {
      rewriter = rewriter.on('.page-head h1', new TextContentHandler('David Ruck: Digital Marketing, Websites & Infrastructure'));
      rewriter = rewriter.on('.page-head .lead', new TextContentHandler("David Ruck's digital career grew directly from customer demand around 0199 and became a long-term focus across websites, hosting, domains, search, PPC, analytics, data and automation."));
    }

    if (pathname === '/media') {
      rewriter = rewriter.on('.page-head h1', new TextContentHandler('David Ruck: Radio, Television, Events & Music'));
      rewriter = rewriter.on('.page-head .lead', new TextContentHandler('This is the media and culture chapter index. Surreal, ALT TV, PulzarFM After Dark and the separate life-in-music story now have their own pages so each can keep growing without bloating a single timeline.'));
    }

    if (pathname === '/music') {
      rewriter = rewriter.on('.page-head h1', new TextContentHandler('David Ruck: A Life in Music'));
    }

    if (pathname === '/career/0199') {
      rewriter = rewriter.on('.page-head h1', new TextContentHandler('David Ruck and the full 0199 Directory Assistance story'));
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
