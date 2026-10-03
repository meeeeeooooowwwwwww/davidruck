const PROD_HOSTS = new Set(['davidaruck.com', 'www.davidaruck.com']);

function initAnalytics() {
  if (!PROD_HOSTS.has(location.hostname)) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-KRH3H70VP9';
  document.head.append(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-KRH3H70VP9');
}


const THEME_STORAGE_KEY = 'davidruck-theme';

function getSystemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme, persist = false) {
  const resolved = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = resolved;
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(resolved === 'dark'));
    toggle.setAttribute('aria-label', resolved === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute('content', resolved === 'dark' ? '#171310' : '#f4efe7');
  if (persist) {
    try { localStorage.setItem(THEME_STORAGE_KEY, resolved); } catch {}
  }
}

function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem(THEME_STORAGE_KEY); } catch {}
  setTheme(saved === 'dark' || saved === 'light' ? saved : getSystemTheme());

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('.theme-toggle');
    if (!toggle) return;
    const current = document.documentElement.dataset.theme || getSystemTheme();
    setTheme(current === 'dark' ? 'light' : 'dark', true);
  });

  const media = window.matchMedia?.('(prefers-color-scheme: dark)');
  media?.addEventListener?.('change', () => {
    let explicit = null;
    try { explicit = localStorage.getItem(THEME_STORAGE_KEY); } catch {}
    if (!explicit) setTheme(getSystemTheme());
  });
}

function handleLegacyFragments() {
  if (location.pathname !== '/media/' && location.pathname !== '/media') return;

  const legacy = new Map([
    ['#production', '/music/#production'],
    ['#pulzar-after-dark', '/media/pulzarfm/#after-dark']
  ]);
  const destination = legacy.get(location.hash);
  if (destination) location.replace(destination);
}

function getYouTubeId(element) {
  const scope = element.closest('[data-youtube-id]');
  const videoId = scope?.dataset.youtubeId || '';
  return /^[\w-]{11}$/.test(videoId) ? videoId : null;
}

function initYouTubeFacades() {
  for (const scope of document.querySelectorAll('[data-youtube-id]')) {
    const videoId = getYouTubeId(scope);
    if (!videoId) continue;

    for (const image of scope.querySelectorAll('[data-youtube-thumbnail]')) {
      image.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
      image.addEventListener('error', () => { image.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`; }, { once: true });
    }

    for (const link of scope.querySelectorAll('[data-youtube-link]')) {
      link.href = `https://www.youtube.com/watch?v=${videoId}`;
    }
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('.video-facade-button');
    if (!button) return;

    const container = button.closest('.video-facade');
    const videoId = getYouTubeId(button);
    if (!container || !videoId) return;

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.title = button.getAttribute('aria-label') || 'YouTube video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;

    container.replaceChildren(iframe);
  });
}

initTheme();
handleLegacyFragments();
initYouTubeFacades();

if ('requestIdleCallback' in window) {
  window.requestIdleCallback(initAnalytics, { timeout: 2500 });
} else {
  window.setTimeout(initAnalytics, 1200);
}
