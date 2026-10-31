import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = new URL('../', import.meta.url);
const PUBLIC = new URL('../public/', import.meta.url);
const failures = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

function fail(file, message) {
  failures.push(`${path.relative(ROOT.pathname, file)}: ${message}`);
}

const publicFiles = await walk(PUBLIC.pathname);
const htmlFiles = publicFiles.filter(file => file.endsWith('.html'));

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const styleLinks = html.match(/<link rel="stylesheet" href="\/assets\/styles\.css">/g) || [];
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const inlineExecutableScript = /<script(?![^>]*type=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/i.test(html);
  const remoteImages = [...html.matchAll(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi)].map(match => match[1]);

  if (styleLinks.length !== 1) fail(file, `expected exactly one shared stylesheet link, found ${styleLinks.length}`);
  if (/\/(?:home-hero|brand-credentials|portfolio|aurora-theme|mobile-nav|chapter-enhancements)\.css/.test(html)) fail(file, 'references a retired CSS module');
  if (/<style\b/i.test(html)) fail(file, 'contains an inline <style> block');
  if (inlineExecutableScript) fail(file, 'contains executable inline JavaScript');
  if (/pagead2\.googlesyndication\.com/i.test(html)) fail(file, 'contains AdSense');
  if (/https:\/\/www\.youtube\.com\/embed\//i.test(html)) fail(file, 'uses www.youtube.com for an embed; use youtube-nocookie.com to match CSP');
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(file, 'missing a non-empty title');
  if (!/<meta name="description" content="[^"]+"/i.test(html)) fail(file, 'missing a meta description');
  if (!/<link rel="canonical" href="https:\/\/davidaruck\.com\//i.test(html)) fail(file, 'missing canonical davidruck.com URL');
  if (h1Count !== 1) fail(file, `expected exactly one H1, found ${h1Count}`);
  if (!/<header class="site-header"><\/header>/.test(html)) fail(file, 'does not use the canonical empty header placeholder');
  if (!/<footer class="footer"><\/footer>/.test(html)) fail(file, 'does not use the canonical empty footer placeholder');

  const allowedRemoteImageHosts = new Set(['i.ytimg.com', 'nataliegwinters.com', 'upload.wikimedia.org', 'www.millenniumhotels.com', 'www.trustedbrands.co.nz']);
  for (const src of remoteImages) {
    const host = new URL(src).hostname;
    if (!allowedRemoteImageHosts.has(host)) fail(file, `unapproved remote image host: ${host}`);
  }
}

const homePath = path.join(PUBLIC.pathname, 'index.html');
const home = await readFile(homePath, 'utf8');
if (/<iframe\b/i.test(home)) fail(homePath, 'homepage contains an embedded iframe; use the click-to-load video facade');
if (/D\.O\.B\.|P\.O\.B\.|birthDate/i.test(home)) fail(homePath, 'homepage exposes personal birth details that are not needed on the curated public front end');
if (!/data-youtube-id="ElPxSbnP2Kw"/.test(home)) fail(homePath, 'homepage is missing the approved featured video facade');
if (!/"@type":"VideoObject"/.test(home)) fail(homePath, 'homepage structured data is missing VideoObject');
if (!/<meta name="twitter:card" content="summary_large_image">/.test(home)) fail(homePath, 'homepage is missing large-image social metadata');
if (!home.includes('\"alternateName\":[\"David A. Ruck\",\"Dave Ruck\",\"DJ Ruckus\"]')) fail(homePath, 'David Ruck person aliases missing');
const biography=await readFile(path.join(PUBLIC.pathname,'about/index.html'),'utf8');
if (!biography.includes('\"@type\":\"ProfilePage\"')) fail(homePath,'About profile structured data missing');
if (!biography.includes('Dave Ruckus') || !biography.includes('David Ruckus')) fail(homePath,'Requested search variants missing from contextual biography');

const siteScriptPath = path.join(PUBLIC.pathname, 'assets', 'site.js');
const siteScript = await readFile(siteScriptPath, 'utf8');
if (!siteScript.includes('youtube-nocookie.com/embed/')) fail(siteScriptPath, 'YouTube facade must use youtube-nocookie.com');
if (!siteScript.includes('davidruck-theme')) fail(siteScriptPath, 'theme persistence key is missing');

const themeBootstrapPath = path.join(PUBLIC.pathname, 'assets', 'theme-init.js');
const themeBootstrap = await readFile(themeBootstrapPath, 'utf8');
if (!themeBootstrap.includes('localStorage')) fail(themeBootstrapPath, 'pre-paint theme bootstrap is missing localStorage preference handling');

const workerPath = path.join(ROOT.pathname, 'src', 'index.js');
const worker = await readFile(workerPath, 'utf8');
if (!worker.includes('class="theme-toggle"')) fail(workerPath, 'global header is missing the theme toggle');
if (!worker.includes('href="/music/"') || !worker.includes('href="/media/"')) fail(workerPath, 'global navigation must expose music and media');

const llmsPath = path.join(PUBLIC.pathname, 'llms.txt');
const llms = await readFile(llmsPath, 'utf8');
if (/NatalieGWinters|my-account\/denise-ruck/i.test(llms)) fail(llmsPath, 'llms.txt promotes unrelated or archived identity material');

const sitemapPath = path.join(PUBLIC.pathname, 'sitemap.xml');
const sitemap = await readFile(sitemapPath, 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const sitemapUrlSet = new Set(sitemapUrls);
if (!sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) fail(sitemapPath, 'missing standard sitemap namespace');
if (sitemapUrls.length !== (sitemap.match(/<url>/g) || []).length) fail(sitemapPath, 'each sitemap URL must have exactly one loc element');
if (sitemapUrlSet.size !== sitemapUrls.length) fail(sitemapPath, 'duplicate sitemap URL');
for (const loc of sitemapUrls) {
  try {
    const url = new URL(loc);
    if (url.origin !== 'https://davidaruck.com' || !url.pathname.endsWith('/') || url.search || url.hash) {
      fail(sitemapPath, 'non-canonical sitemap URL: ' + loc);
    }
  } catch {
    fail(sitemapPath, 'invalid sitemap URL: ' + loc);
  }
}
for (const [, lastmod] of sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod) || Number.isNaN(Date.parse(lastmod))) {
    fail(sitemapPath, 'invalid lastmod date: ' + lastmod);
  }
}
const indexableUrls = new Set();
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const relative = path.relative(PUBLIC.pathname, file).split(path.sep).join('/');
  const expected = new URL(relative.replace(/index\.html$/, ''), 'https://davidaruck.com/').href;
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1];
  if (canonical !== expected) fail(file, 'canonical URL does not match page path: expected ' + expected);
  const robots = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i)?.[1] || '';
  if (/\bnoindex\b/i.test(robots)) {
    if (sitemapUrlSet.has(expected)) fail(sitemapPath, 'noindex page included: ' + expected);
  } else {
    indexableUrls.add(expected);
    if (!sitemapUrlSet.has(expected)) fail(sitemapPath, 'indexable page missing: ' + expected);
  }
}
for (const url of sitemapUrlSet) {
  if (!indexableUrls.has(url)) fail(sitemapPath, 'unrecognised or non-indexable page listed: ' + url);
}
const robotsPath = path.join(PUBLIC.pathname, 'robots.txt');
const robots = await readFile(robotsPath, 'utf8');
if (!/^Sitemap: https:\/\/davidaruck\.com\/sitemap\.xml$/m.test(robots)) fail(robotsPath, 'robots.txt does not advertise canonical sitemap');

for (const file of publicFiles.filter(file => /\.(?:png|jpe?g)$/i.test(file))) {
  const info = await stat(file);
  if (info.size > 1_000_000) fail(file, `source raster is ${(info.size / 1_000_000).toFixed(2)} MB; optimise it before committing`);
}

if (failures.length) {
  console.error('\nStatic audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Static audit passed: ${htmlFiles.length} HTML pages checked.`);
