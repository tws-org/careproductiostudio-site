# Requirements — carepracticestudio.com

## Overview

Care Practice Studio is a 4-page marketing/content site for a solo technical product management consultancy serving small, mission-driven behavioral and mental health providers (solo practitioners, small nonprofits, community clinics). This is a static content site — no accounts, no dynamic app behavior, no complex interaction.

Approved visual designs and copy live in `care-product-studio-site`. That folder is the source of truth for layout, styling, and content. This document defines the technical and functional contract the build must satisfy.

## Tech Stack

- **Framework:** Astro. Keep it simple — static output, no unnecessary framework overhead (no React/Vue islands unless a specific interactive element genuinely requires one, e.g. the optional contact form).
- **Hosting:** Cloudflare Pages.
- **CI/CD:** GitHub Actions workflow that builds the Astro site and deploys it to Cloudflare Pages on push to the main branch. Use Cloudflare's official GitHub Action (`cloudflare/pages-action` or equivalent) rather than a hand-rolled deploy script.
- **Domain:** carepracticestudio.com (already purchased; DNS/Cloudflare Pages custom domain wiring is in scope if not already configured).

## Site Structure / Routes

| Page                      | Route        |
| ------------------------- | ------------ |
| Home                      | `/`          |
| Who I Help + Case Studies | `/help`      |
| What I Do                 | `/execution` |
| Contact                   | `/contact`   |

A `sitemap.xml` for these four routes already exists and should be included in the build output (or generated via Astro's sitemap integration, matching these exact paths).

## Functional Requirements (Must-Have)

1. **Persistent navigation** on every page, including a "Next Steps" button/link that goes to `/contact`. This must be visible without scrolling on every page (header nav, not buried below the fold).
2. **Footer** on every page (Home, Who I Help, What I Do, Contact) — consistent across all four.
3. **Home page** gives the full pitch: headline + sub-headline, a two-item row (Who I Help teaser, Case Study teaser), a What I Do row, a closing "Next Steps" CTA, and the footer. Content comes from the approved design in `care-product-studio-site`.
4. **Who I Help + Case Studies page** (`/help`) combines the full "Who I Help" content with a Case Studies section. The Case Studies section must be built so a new case study can be added later without a redesign (e.g. a repeatable card/list component, not hardcoded one-off markup). Currently contains one case study (Jess Rebelo / Unleashed Potential); design it to hold more without structural changes.
5. **What I Do page** (`/execution`) describes the four-step process (understand, plan, build, check in) per the approved copy.
6. **Contact page** (`/contact`) contains, top to bottom:
   - An optional 3-question form: plain-language questions, **radio-button answers only, no free text**. The form must be fully skippable — a visitor can go straight to the scheduling link without answering anything.
   - A scheduling link (Calendly or equivalent), which is the **primary call to action** and must never be gated or blocked by the form.
7. **No pricing anywhere on the site.** No plans, tiers, "free trial," or "no contracts" language.
8. **No claims of compliance/security work not actually performed.** The site must not say or imply Care Practice Studio holds deep compliance certifications it doesn't have. If compliance comes up, the stance is: this isn't claimed, bring your own reviewer if your project needs one.
9. **Mobile-responsive.** All four pages must render correctly on common mobile viewport widths, not just desktop.

## Non-Goals (explicitly out of scope for this build)

- A blog
- A full portfolio/case-study index beyond the one combined `/help` page
- User accounts, logins, or any authenticated area
- Any backend beyond what's needed to receive the optional contact form's answers (a simple form handler / static form service is fine — no custom database needed for this project)
- SEO investment beyond the basic sitemap.xml and reasonable semantic HTML

## Success Criteria (must be demonstrated, not asserted)

- [ ] `npm run build` (or equivalent Astro build command) completes with no errors.
- [ ] All four routes (`/`, `/help`, `/execution`, `/contact`) render and are reachable via the site's navigation from every other page.
- [ ] The "Next Steps" nav element is present and visible without scrolling on all four pages, verified at both desktop and mobile viewport widths.
- [ ] The footer is present and consistent on all four pages.
- [ ] The Contact page's 3-question form renders with radio-button inputs only (no text inputs), and a visitor can reach the scheduling link without answering any question.
- [ ] The scheduling link on the Contact page is a real, working link (Calendly or equivalent), not a placeholder.
- [ ] The Case Studies section on `/help` is implemented as a repeatable component (list/array-driven), not one-off hardcoded markup for a single entry.
- [ ] A search of all page content confirms no instances of: "pricing," "tier," "plan," "free trial," "no contracts," "subscription," or language stating/implying compliance certifications are held.
- [ ] `sitemap.xml` is present at the site root and lists exactly the four routes above with the `carepracticestudio.com` domain.
- [ ] The GitHub Actions workflow successfully builds and deploys to Cloudflare Pages on a push to main (demonstrated via a real deploy, not just a workflow file that hasn't been run).
- [ ] The live site is reachable at the production Cloudflare Pages URL and, once DNS is configured, at carepracticestudio.com.
