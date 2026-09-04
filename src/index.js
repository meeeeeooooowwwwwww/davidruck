const RUMBLE_VIDEO_URL = 'https://rumble.com/v6zh68m-selfie-the-chainsmokers.html';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/rumble/my-sister') {
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

    return env.ASSETS.fetch(request);
  }
};
