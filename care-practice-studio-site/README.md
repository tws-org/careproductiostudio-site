# Care Practice Studio — website handoff (v1)

Design export for engineering. Source of truth for the design is the "Care Practice Studio — Website" canvas; this folder is a working static build of it plus the spec below.

Domain: **carepracticestudio.com** · Contact email: **help@carepracticestudio.com**

## What's in here

| Path | What it is |
|---|---|
| `index.html` | Page 1 — Home |
| `who-i-help.html` | Page 2 — Who I help + case studies (carousel) |
| `what-i-do.html` | Page 3 — What I do (four-step process) |
| `contact.html` | Page 4 — Contact (optional 3-question form + booking) |
| `mobile-home-reference.html` | Mobile layout reference for Home (390px). Not a separate page — it shows how every page should collapse on phones. |
| `assets/tokens.css` | Design tokens (colors, fonts, radii, spacing) as CSS variables |
| `assets/styles.css` | Shared styles: hover/focus states, text links, form pills, carousel dots |
| `assets/carousel.js` | Vanilla JS for the case-study carousel (no dependencies) |
| `reference/*.png` | Full-page screenshots of each page at design width |

Open any `.html` file directly in a browser — no build step. Section layout is still in inline styles copied straight from the design; treat it as the spec for spacing/sizing and move it into your stylesheet or components however you like.

## Scope (from the PRD)

- Static content site: 4 pages, one optional form, one external booking link (Calendly or similar). No accounts, no CMS, no app behavior.
- **Out of scope for v1:** blog, pricing, multi-project portfolio, any compliance/HIPAA claims.
- **Success metric:** real calls booked via the scheduling link (target: 1 in the first 60 days). Make sure bookings can be counted and test bookings filtered out — e.g. a UTM on the Calendly link plus a click event on every "Book a call" button.

## Sitemap and navigation

```
Home ──┬── Who I help (+ case studies)
       ├── What I do
       └── Contact   ← every page points here
```

- Top nav on every page: Home · Who I help · What I do · **Contact** (filled button). Current page gets `aria-current="page"` and an accent underline.
- **Every button that goes to the Contact page is labeled "What happens next."** Keep that label consistent everywhere. The nav button stays "Contact" (it names the page, and the longer label won't fit the mobile header).
- "Book a call" is used only for the actual booking link on the Contact page.
- The Home case-study card links to `who-i-help.html#case-studies`.

## Design tokens

### Color

| Token | Hex | Use |
|---|---|---|
| `--color-primary` | `#065F46` | Headings, primary buttons, dark panels |
| `--color-primary-deep` | `#04342A` | Button hover, footer background, current-page nav button |
| `--color-accent` | `#10B981` | **Decorative only:** rules, step numerals, carousel dots, focus ring, the "product" lens in the hero graphic |
| `--color-accent-light` | `#A7F3D0` | Eyebrow text on emerald panels |
| `--color-mint-50` | `#F4FAF7` | Alternate section background |
| `--color-mint-100` | `#ECF8F3` | CTA band, callouts |
| `--color-line` | `#D6E8DF` | Card borders, dividers |
| `--color-ink` | `#161616` | Body text |
| `--color-ink-soft` | `#3C4A44` | Secondary text on white |

Contrast rule: `#10B981` on white is ~2.5:1, so never use it for text on white. White on `#065F46` is ~7.5:1 and is fine for all sizes.

### Type

- **Headings, nav, buttons, labels:** Lato 400/700/900 (fallback Helvetica Neue, sans-serif)
- **Body copy and italic step numerals:** Playfair Display 400/600 + 400 italic (fallback Georgia, serif)
- Loaded from Google Fonts in each page's `<head>`. Self-hosting (e.g. `@fontsource/lato`, `@fontsource/playfair-display`) is a reasonable swap for performance and privacy.

| Role | Desktop | Mobile |
|---|---|---|
| H1 | Lato 900, 68–72px, line-height 1.04, tracking −0.025em | 38px |
| H2 (section) | Lato 900, 40–48px, line-height 1.1 | 26–32px |
| H3 / card title | Lato 900, 21–36px | 19–26px |
| Eyebrow | Lato 700, 13–14px, uppercase, tracking 0.14em | 12px |
| Body | Playfair 18–22px, line-height 1.6–1.65 | 16–18px |
| Button | Lato 700, 17–18px | 17px |

### Layout and shape

- Design width 1440px; content gutter 80px on desktop, 20px on mobile. Suggest a max content width of ~1280px on very wide screens.
- Section vertical padding: 96–104px on desktop, 44–56px on mobile.
- Nav height: 88px desktop, 68px mobile.
- Radii: buttons and chips 999px (pill), cards 20px, large panels 24px, callouts 16px, form pills 14px.
- Touch targets are at least 44px.

## Responsive behavior

The desktop pages use multi-column grids (2-up cards, 4-up steps, 5/7 text splits, the 1fr / 520px form rows). Below ~900px, collapse all of them to a single column, following `mobile-home-reference.html`:

- The hero graphic moves below the CTA and shrinks.
- The 4 steps stack as numeral + text rows.
- Nav becomes logo + Contact button + menu button. **The menu itself isn't built yet** — it needs a simple disclosure panel with the four links.
- Form: each question stacks above its three answer pills, which stay 3-across.
- The footer's link columns become a 2-column grid.

## Components and interactions

**Case-study carousel** (`who-i-help.html`, `assets/carousel.js`)
- Each slide is a `.slide` block, with one `.cs-dot` button per slide. Prev/next buttons wrap around, and the counter reads "N of total".
- **Adding a case study = add one `.slide` and one dot.** No layout change needed (a PRD requirement).
- Slide 2 is currently an "In progress" placeholder. Remove it once there's a second real case study.

**Contact form** (`contact.html`)
- Three questions, radio answers only: 0 Not at all / 5 Somewhat / 10 Yes, help please! No free text.
- **Optional and never blocking.** "Skip the questions — book now" at the top jumps to the booking block (`#book`), and the booking link works whether or not anything is answered.
- The selected state is pure CSS (`.pill:has(input:checked)`). Radios are visually hidden but still keyboard- and screen-reader-accessible via `fieldset`/`legend`.
- **Not wired up yet.** Decide where answers go. Options: pass them to Calendly as prefill/custom answers (e.g. `a1=…` query params), or post them to a form endpoint when "Book a call" is clicked. The booking must never wait on that request.

**Buttons and links:** primary buttons are `.btn` (emerald → deep on hover), the inverse button on emerald is `.btn-inv`, and underlined text links are `.textlink`. All have visible focus rings (3px accent).

## Content still to fill before launch

- [ ] **Calendly URL:** `contact.html` "Book a call" currently points to calendly.com (marked `data-todo`).
- [ ] **Jess Rebelo case study:** the Before, After and quote are **mock copy**. Replace them with approved text and get her permission before launch. The quote in particular must not ship unapproved.
- [ ] **Case study screenshot:** placeholder box on `who-i-help.html`.
- [ ] **"What happens next" expectations:** the PRD asks the Contact page to set expectations after booking (call length, what's covered). No copy yet.
- [ ] **Mobile menu** (see Responsive behavior).
- [ ] Favicon, `<meta name="description">` and social/OG tags per page.
- [ ] Analytics for the success metric (see Scope).

## Copy notes

- All copy comes from Peter's content docs (Home/Hero, Who I Help, Contact, PRD), with the name updated to Care Practice Studio.
- Written by design and awaiting Peter's approval: the Home sub-headline, the What I do H1 ("Planning first, then an AI-assisted build."), the 3-hour check-in callout (from the PRD acceptance criteria) and the footer tagline.
- Tone guardrail from the PRD: warm, person-centered, and professional. No claims about security, compliance or HIPAA work that hasn't been done.

## Accessibility checklist (already in the markup)

- Semantic landmarks (`header`, `nav`, `section`, `footer`) and one `h1` per page.
- Real `<a>`/`<button>`/`<input>` elements, `aria-label` on icon-only buttons, and `aria-current` on the active nav item and carousel dot.
- Decorative SVGs are `aria-hidden`. The carousel counter is `aria-live="polite"`.
- Text contrast is AA or better throughout.
