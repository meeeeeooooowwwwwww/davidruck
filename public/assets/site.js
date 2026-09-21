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
      image.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
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

handleLegacyFragments();
initYouTubeFacades();

if ('requestIdleCallback' in window) {
  window.requestIdleCallback(initAnalytics, { timeout: 2500 });
} else {
  window.setTimeout(initAnalytics, 1200);
}
