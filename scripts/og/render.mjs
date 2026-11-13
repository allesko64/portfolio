/**
 * Renders the social share card (scripts/og/card.html) to public/og.png.
 *   pnpm og
 * Needs a Chromium: set CHROMIUM_PATH, or have Playwright's browsers installed.
 */
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const card = 'file://' + path.join(here, 'card.html');
const out = path.join(here, '../../public/og.png');

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(card, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, type: 'png' });
await browser.close();
console.log('wrote', path.relative(process.cwd(), out));
