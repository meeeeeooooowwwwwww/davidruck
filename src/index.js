import { applyChapterEnhancements } from './chapter-enhancements.js';

const NAV_ITEMS = [
  ['/about/', 'About'], ['/career/', 'Career'], ['/music/', 'Music'],
  ['/events/', 'Events'], ['/media/', 'Media'], ['/work/', 'Current Work'],
  ['/contact/', 'Contact']
];

function renderNavLinks(pathname) {
  return NAV_ITEMS.map(([href, label]) => {
    const sectionPath = href.slice(0, -1);
    const isCurrent = pathname === sectionPath || pathname.startsWith(`${sectionPath}/`);
    const current = isCurrent ? ` aria-current="${pathname === sectionPath ? 'page' : 'location'}"` : '';
    return `<a href="${href}"${current}>${label}</a>`;
  }).join('');
}

function renderGlobalHeader(pathname) {
  const links = renderNavLinks(pathname);
  return `<a class="skip-link" href="#main-content">Skip to content</a><nav class="nav" aria-label="Primary navigation"><a class="brand" href="/" aria-label="David Ruck home">David Ruck</a><div class="nav-links">${links}</div><button class="theme-toggle" type="button" aria-pressed="false" aria-label="Toggle colour theme"><span class="theme-sun" aria-hidden="true">☀</span><span class="theme-switch" aria-hidden="true"><i></i></span><span class="theme-moon" aria-hidden="true">☾</span><span class="sr-only">Toggle colour theme</span></button><details class="mobile-nav"><summary aria-label="Open navigation menu"><span class="mobile-nav-icon" aria-hidden="true"><i></i><i></i><i></i></span><span class="mobile-nav-label">MENU</span></summary><div class="mobile-nav-panel">${links}</div></details></nav>`;
}

// Injected with the shared header so every page has the active state immediately,
// without relying on a cached stylesheet or client-side navigation script.
const ACTIVE_NAV_STYLES = `<style>
.nav-links a[aria-current] { color: var(--accent); }
.nav-links a[aria-current]::after { right: 0; }
.mobile-nav-panel a[aria-current] {
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  font-weight: 800;
}
</style>`;
const GLOBAL_FOOTER = `<div class="footer-copy"><strong>David Ruck</strong><br><span>© 2026 · Christchurch, New Zealand · business, music and the stories between them</span></div><div class="footer-social" aria-label="David Ruck social profiles"><a class="social-link" href="https://substack.com/@davidruck" target="_blank" rel="me noopener"><img src="/assets/icons/substack.svg" alt="" width="22" height="22"><span>Substack</span></a><a class="social-link social-link--orcid" href="https://orcid.org/0009-0009-3029-9422" target="_blank" rel="me noopener noreferrer" aria-label="David Ruck ORCID iD 0009-0009-3029-9422"><img src="/assets/icons/orcid.svg" alt="" width="19" height="19"><span>ORCID</span></a><a class="social-link" href="https://github.com/meeeeeooooowwwwwww" target="_blank" rel="me noopener"><img src="/assets/icons/github.svg" alt="" width="22" height="22"><span>GitHub</span></a><a class="social-link social-link--youtube" href="https://www.youtube.com/@AmericaFirstNZ" target="_blank" rel="noopener"><img src="/assets/icons/youtube.svg?v=20261111" alt="" width="22" height="22"><span>YouTube</span></a></div><div class="footer-sites"><a href="/music/">Music</a><span>·</span><a href="/events/">Events</a><span>·</span><a href="/media/">Media</a><span>·</span><a href="https://grideater.com" target="_blank" rel="noopener">GRID EATER</a><span>·</span><a href="https://americafirst.co.nz" target="_blank" rel="noopener">America First Limited</a><span>·</span><a href="https://americafirst.nz/" target="_blank" rel="noopener noreferrer">America First NZ</a></div>`;

class GlobalHeadHandler { element(element) { element.append(ACTIVE_NAV_STYLES + '<script src="/assets/theme-init.js"></script><script src="/assets/site.js" defer></script>', { html: true }); } }
class GlobalHeaderHandler {
  constructor(pathname) { this.pathname = pathname; }
  element(element) { element.setInnerContent(renderGlobalHeader(this.pathname), { html: true }); }
}
class GlobalFooterHandler { element(element) { element.setInnerContent(GLOBAL_FOOTER, { html: true }); } }
class MainContentHandler { element(element) { element.setAttribute('id', 'main-content'); } }
class ExternalReferralLinkHandler {
  element(element) {
    const rel = element.getAttribute('rel') || '';
    const tokens = rel.split(/\s+/).filter(Boolean).filter(token => token !== 'noreferrer' && token !== 'noopener');
    tokens.push('noopener');
    element.setAttribute('rel', [...new Set(tokens)].join(' '));
  }
}
class MyAccountSourceNoteHandler {
  element(element) {
    element.setInnerContent('<h3>Contemporary record</h3><p>These links are included so readers can distinguish my present-day account and recollection from surviving contemporary reporting. External articles include criticism and viewpoints I do not necessarily agree with.</p><p><a href="https://youtu.be/R2CZyDfmz5s" target="_blank" rel="noopener"><strong>TVNZ / Te Karere: Pākehā Party support comparison ↗</strong></a> · <a href="https://www.critic.co.nz/news/article/3086/pakehahaha-are-they-serious" target="_blank" rel="noopener">Critic Te Ārohi, 2013 ↗</a> · <a href="https://www.sunlive.co.nz/news/48443-pakeha-party-hits-chord-locals.html" target="_blank" rel="noopener">SunLive, 11 July 2013 ↗</a> · <a href="https://natlib.govt.nz/records/32377880" target="_blank" rel="noopener">National Library of New Zealand ↗</a></p>', { html: true });
  }
}
function normalisePathname(pathname) { if (pathname === '/index.html') return '/'; if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1); return pathname; }

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = normalisePathname(url.pathname);
    if (pathname === '/0199' || pathname === '/0199/index.html') return Response.redirect(`${url.origin}/career/0199/`, 301);
    if (pathname === '/my-sister' || pathname.startsWith('/my-sister/') || pathname === '/my-account/denise-ruck' || pathname.startsWith('/my-account/denise-ruck/')) return Response.redirect(`${url.origin}/my-account/`, 301);
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;
    let rewriter = new HTMLRewriter().on('head', new GlobalHeadHandler()).on('.site-header', new GlobalHeaderHandler(pathname)).on('.footer', new GlobalFooterHandler()).on('main', new MainContentHandler()).on('a[target="_blank"]', new ExternalReferralLinkHandler());
    rewriter = applyChapterEnhancements(rewriter, pathname);
    if (pathname === '/my-account') rewriter = rewriter.on('.source-note', new MyAccountSourceNoteHandler());
    return rewriter.transform(response);
  }
};
