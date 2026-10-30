// Capture genuine browser screenshots of the six public homepages for the portfolio.
// No credentials, authenticated sessions or visitor information are used.
// Run this only in a trusted CI context; publication requires visual review.
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const websites = [
  ['kiwi-gardeners','https://kiwigardeners.com/','Kiwi'],
  ['natalie-g-winters','https://nataliegwinters.com/','Natalie'],
  ['grid-eater','https://grideater.com/','GRID EATER'],
  ['america-first-limited','https://americafirst.co.nz/','America First'],
  ['america-first-nz','https://americafirst.nz/','America First'],
  ['david-ruck','https://davidaruck.com/','David'],
];
const outDir = 'public/assets/work-previews';
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const captures = [];
const errors = [];
const blocked = /(attention required|just a moment|checking your browser|error 1020|access denied|this site can.t be reached)/i;
try {
  for (const [slug, url, expected] of websites) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
      locale: 'en-NZ',
      colorScheme: 'light',
      reducedMotion: 'reduce',
      serviceWorkers: 'block',
    });
    const page = await context.newPage();
    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      if (!response || response.status() >= 400) throw new Error(`${url}: HTTP ${response?.status() ?? 'no response'}`);
      await page.waitForTimeout(1800);
      const title = await page.title();
      const text = (await page.locator('body').innerText()).slice(0, 5000);
      if (blocked.test(title) || blocked.test(text.slice(0, 800))) throw new Error(`${url}: appears to show bot challenge or error page (${title})`);
      if (!text.toLowerCase().includes(expected.toLowerCase())) throw new Error(`${url}: expected homepage identity ${expected} not found; got ${title}`);
      const file = `${outDir}/${slug}.jpg`;
      await page.screenshot({ path: file, type: 'jpeg', quality: 80, animations: 'disabled' });
      captures.push({ slug, url, title, file, viewport: '1280x800', screenshot: 'desktop top viewport', capturedUtc: new Date().toISOString() });
      console.log(`Captured ${slug}: ${title}`);
    } catch (error) {
      // Some live sites restrict automated browsers. Never capture or publish a challenge page.
      const message = String(error?.message || error);
      errors.push({slug, url, error: message});
      console.warn(`Cannot capture ${slug}: ${message}`);
    } finally {
      await context.close();
    }
  }
  await writeFile(`${outDir}/capture-metadata.json`, JSON.stringify({captures, errors}, null, 2) + '\n');
  console.log(`Captures: ${captures.length}/6; protected/unavailable: ${errors.length}`);
  if (captures.length === 0) throw new Error('No authentic homepage previews could be captured');
} finally {
  await browser.close();
}
