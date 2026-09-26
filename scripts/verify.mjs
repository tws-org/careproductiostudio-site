// End-to-end checks of the success criteria against a running site.
// Usage: node scripts/verify.mjs [baseUrl] [screenshotDir]
//   baseUrl defaults to http://localhost:8788 (`npx wrangler pages dev dist --port 8788`).
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';

// Read the feature flag from the built output (it's inlined into the JS bundle).
const flagSrc = readFileSync(new URL('../src/data/features.ts', import.meta.url), 'utf8');
const caseStudiesOn = /caseStudies:\s*true/.test(flagSrc);

const BASE = (process.argv[2] || 'http://localhost:8788').replace(/\/$/, '');
const SHOTS = process.argv[3];
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const ROUTES = ['/', '/help', '/execution', '/contact'];
const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-360', width: 360, height: 740 },
];

let failures = 0;
const ok = (cond, msg) => {
  if (cond) console.log(`  ✓ ${msg}`);
  else {
    failures++;
    console.log(`  ✗ ${msg}`);
  }
};

const browser = await chromium.launch();
const footerSignatures = new Set();

for (const vp of VIEWPORTS) {
  console.log(`\n== ${vp.name} (${vp.width}x${vp.height})`);
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  for (const route of ROUTES) {
    const res = await page.goto(BASE + route, { waitUntil: 'networkidle' });
    console.log(` ${route}`);
    ok(res?.status() === 200, `HTTP 200 (got ${res?.status()})`);
    ok(new URL(page.url()).pathname === route, `served at ${route} without redirect (landed on ${new URL(page.url()).pathname})`);

    // Next Steps nav element visible above the fold
    const cta = page.locator('header a[data-nav-cta]');
    const box = await cta.boundingBox();
    const ctaText = (await cta.textContent())?.trim();
    ok(
      ctaText === 'Next Steps' && (await cta.isVisible()) && box && box.y >= 0 && box.y + box.height <= vp.height && box.x + box.width <= vp.width,
      `"Next Steps" visible without scrolling (${box ? `${Math.round(box.x)},${Math.round(box.y)} ${Math.round(box.width)}x${Math.round(box.height)}` : 'none'})`,
    );
    ok((await cta.getAttribute('href')) === '/contact', '"Next Steps" links to /contact');

    // No horizontal overflow
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(overflow <= 0, `no horizontal scroll (overflow ${overflow}px)`);

    // Navigation to every other route
    const menuBtn = page.locator('[data-menu-toggle]');
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      ok((await menuBtn.getAttribute('aria-expanded')) === 'true', 'mobile menu opens');
      if (SHOTS && route === '/') await page.screenshot({ path: `${SHOTS}/${vp.name}-menu-open.png` });
    }
    const visibleNavHrefs = await page.$$eval('header a', (as) =>
      as.filter((a) => a.getClientRects().length && getComputedStyle(a).visibility !== 'hidden').map((a) => a.getAttribute('href')),
    );
    for (const other of ROUTES.filter((r) => r !== route)) {
      ok(visibleNavHrefs.includes(other), `header nav links to ${other}`);
    }
    if (await menuBtn.isVisible()) {
      await page.keyboard.press('Escape');
      ok((await menuBtn.getAttribute('aria-expanded')) === 'false', 'mobile menu closes with Escape');
    }

    // Footer
    const footer = page.locator('footer.site-footer');
    ok((await footer.count()) === 1 && (await footer.isVisible()), 'footer present');
    const sig = await footer.evaluate((f) =>
      [...f.querySelectorAll('.footer-brand, .footer-nav')].map((n) => n.textContent.replace(/\s+/g, ' ').trim()).join('|'),
    );
    footerSignatures.add(sig);

    if (route === '/contact') {
      const inputs = await page.$$eval('form input, form textarea, form select', (els) => els.map((e) => e.getAttribute('type') || e.tagName.toLowerCase()));
      ok(inputs.length === 9 && inputs.every((t) => t === 'radio'), `form has only radio inputs (${inputs.length}: ${[...new Set(inputs)].join(',')})`);
      ok((await page.locator('form fieldset').count()) === 3, 'form has 3 questions');
      const book = page.locator('a[data-book-link]');
      const href = await book.getAttribute('href');
      ok(/^https:\/\/(calendly\.com|cal\.com)\//.test(href || ''), `booking link is a scheduling URL (${href})`);
      await page.locator('a[href="#book"]').first().click();
      await page.waitForTimeout(800);
      const bb = await book.boundingBox();
      ok(bb && bb.y >= 0 && bb.y + bb.height <= vp.height, 'skip link brings "Book a call" into view without answering anything');
      const [popup] = await Promise.all([page.waitForEvent('popup', { timeout: 10000 }).catch(() => null), book.click()]);
      ok(!!popup, 'clicking "Book a call" with no answers opens the scheduler');
      if (popup) await popup.close();
      await page.locator('label.pill:has(input[name="q1"][value="10"])').click();
      const href2 = await book.getAttribute('href');
      ok(/[?&]a1=10/.test(href2 || ''), 'answering a question adds it to the booking link');
    }

    if (route === '/help') {
      if (caseStudiesOn) {
        ok((await page.locator('#case-studies .slide article.cs-card').count()) >= 1, 'case study cards rendered from data');
        const next = page.locator('#case-studies [data-next]');
        if (await next.isVisible()) {
          await next.click();
          const counter = await page.locator('#case-studies [data-counter]').textContent();
          ok(counter?.startsWith('2 of'), `carousel advances (${counter})`);
        }
      } else {
        ok((await page.locator('#case-studies').count()) === 0, 'case studies hidden while flag is off');
      }
    }

    if (SHOTS) {
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      const name = route === '/' ? 'home' : route.slice(1);
      await page.screenshot({ path: `${SHOTS}/${vp.name}-${name}.png`, fullPage: true });
    }
  }
  ok(errors.length === 0, `no JS errors (${errors.join('; ')})`);
  await page.close();
}

console.log('\n== Cross-page');
ok(footerSignatures.size === 1, `footer content identical on all pages (${footerSignatures.size} variant(s))`);

const sm = await (await fetch(BASE + '/sitemap.xml')).text();
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
ok(
  JSON.stringify(locs) === JSON.stringify(ROUTES.map((r) => 'https://carepracticestudio.com' + r)),
  `sitemap.xml lists exactly the four routes (${locs.join(', ')})`,
);

await browser.close();
console.log(`\n${failures ? `${failures} check(s) failed` : 'All checks passed'}.`);
process.exit(failures ? 1 : 0);
