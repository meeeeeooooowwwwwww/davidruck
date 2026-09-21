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
const htmlFiles = publicFiles.filter((file) => file.endsWith('.html'));

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const styleLinks = html.match(/<link rel="stylesheet" href="\/assets\/styles\.css">/g) || [];
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const inlineExecutableScript = /<script(?![^>]*type=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/i.test(html);
  const remoteImages = [...html.matchAll(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi)].map((match) => match[1]);

  if (styleLinks.length !== 1) fail(file, `expected exactly one shared stylesheet link, found ${styleLinks.length}`);
  if (/\/(?:home-hero|brand-credentials|portfolio|aurora-theme|mobile-nav|chapter-enhancements)\.css/.test(html)) fail(file, 'references a retired CSS module');
  if (/<style\b/i.test(html)) fail(file, 'contains an inline <style> block');
  if (inlineExecutableScript) fail(file, 'contains executable inline JavaScript');
  if (/pagead2\.googlesyndication\.com/i.test(html)) fail(file, 'contains AdSense');
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(file, 'missing a non-empty title');
  if (!/<meta name="description" content="[^"]+"/i.test(html)) fail(file, 'missing a meta description');
  if (!/<link rel="canonical" href="https:\/\/davidaruck\.com\//i.test(html)) fail(file, 'missing canonical davidruck.com URL');
  if (h1Count !== 1) fail(file, `expected exactly one H1, found ${h1Count}`);
  if (!/<header class="site-header"><\/header>/.test(html)) fail(file, 'does not use the canonical empty header placeholder');
  if (!/<footer class="footer"><\/footer>/.test(html)) fail(file, 'does not use the canonical empty footer placeholder');

  const allowedRemoteImageHosts = new Set([
    'i.ytimg.com',
    'upload.wikimedia.org',
    'www.millenniumhotels.com',
    'www.trustedbrands.co.nz'
  ]);
  for (const src of remoteImages) {
    const host = new URL(src).hostname;
    if (!allowedRemoteImageHosts.has(host)) fail(file, `unapproved remote image host: ${host}`);
  }
}

const homePath = path.join(PUBLIC.pathname, 'index.html');
const home = await readFile(homePath, 'utf8');
if (/youtube\.com\/embed/i.test(home)) fail(homePath, 'contains an eager YouTube embed');
if (!/data-youtube-id="IGsf8YftGes"/.test(home)) fail(homePath, 'missing the click-to-load YouTube facade');
if (/pagead2\.googlesyndication\.com/i.test(home)) fail(homePath, 'homepage contains AdSense');

for (const file of publicFiles.filter((file) => /\.(?:png|jpe?g)$/i.test(file))) {
  const info = await stat(file);
  if (info.size > 1_000_000) {
    fail(file, `source raster is ${(info.size / 1_000_000).toFixed(2)} MB; optimise it before committing`);
  }
}

if (failures.length) {
  console.error('\nStatic audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Static audit passed: ${htmlFiles.length} HTML pages checked.`);
