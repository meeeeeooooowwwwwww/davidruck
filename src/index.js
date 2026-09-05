const RUMBLE_VIDEO_URL = 'https://rumble.com/v6zh68m-selfie-the-chainsmokers.html';

class RemoveElementHandler {
  element(element) {
    element.remove();
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
      .on('.nav-links a[href="/my-account/"]', new RemoveElementHandler())
      .on('.nav-links a[href="/my-sister/"]', new RemoveElementHandler())
      .on('.nav-links a[href="/my-account/denise-ruck/"]', new RemoveElementHandler())
      .on('.prose a[href="/my-sister/"]', new DeniseStoryLinkHandler())
      .on('.prose a[href="/my-sister/"] strong', new DeniseStoryLabelHandler())
      .transform(response);
  }
};
