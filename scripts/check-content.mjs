// Scans the built site (dist/) for banned pricing and compliance-claim language.
// Run after `npm run build`: `npm run check:content`. Exits non-zero on any violation.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

const BANNED = [
  { name: 'pricing / price', re: /\bpric(e|es|ed|ing)\b/i },
  { name: 'tier (as a word)', re: /\btiers?\b/i },
  { name: 'free trial', re: /\bfree[- ]trial/i },
  { name: 'no contracts', re: /\bno[- ]contracts?\b/i },
  { name: 'subscription', re: /\bsubscri(be|ption)/i },
  { name: 'pricing-style plan', re: /\b(pricing|payment|monthly|annual|yearly|basic|starter|pro|premium|business|enterprise|paid|free) plans?\b/i },
  { name: 'plans that start at / from', re: /\bplans? (start|from|begin)/i },
  { name: 'currency amount', re: /[$€£]\s?\d/ },
  { name: 'per month / per year', re: /\bper (month|year|hour)\b|\/mo\b/i },
  { name: 'compliance certification claim', re: /\b(hipaa|soc ?2|hitrust|iso ?27001|gdpr)\b/i },
  { name: 'certified / certification', re: /\bcertifi(ed|cation)/i },
  { name: 'compliant claim', re: /\bcompliant\b/i },
];

// Words from the literal success-criteria list that legitimately appear in approved copy in a non-pricing sense.
const ALLOWED_SENSES = [
  { word: 'plan', re: /\bplan(s|ned|ning)?\b/gi, why: 'the "understand, plan, build, check in" process (approved copy)' },
  { word: 'tier (substring)', re: /\w*tier\w*/gi, why: 'only as part of "frontier" (approved copy)' },
  { word: 'compliance', re: /[^.]*\bcompliance\b[^.]*\./gi, why: 'only to disclaim compliance claims (REQUIREMENTS #8 stance)' },
];

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<meta[^>]*content="([^"]*)"[^>]*>/gi, ' $1 ')
    .replace(/<title>([\s\S]*?)<\/title>/gi, ' $1 ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ');
}

const pages = readdirSync(DIST).filter((f) => f.endsWith('.html'));
let violations = 0;
for (const page of pages) {
  const text = visibleText(readFileSync(join(DIST, page), 'utf8'));
  for (const { name, re } of BANNED) {
    const m = text.match(re);
    if (m) {
      violations++;
      const i = m.index ?? 0;
      console.error(`✗ ${page}: ${name} → "…${text.slice(Math.max(0, i - 50), i + 60)}…"`);
    }
  }
  for (const { word, re, why } of ALLOWED_SENSES) {
    const hits = [...new Set((text.match(re) || []).map((s) => s.trim()))];
    if (hits.length) console.log(`  ${page}: "${word}" appears ${hits.length}x — allowed: ${why}\n      ${hits.slice(0, 4).join(' | ')}`);
  }
}
console.log(`\nScanned ${pages.length} pages: ${violations ? `${violations} violation(s)` : 'no banned pricing or compliance-claim language found'}.`);
process.exit(violations ? 1 : 0);
