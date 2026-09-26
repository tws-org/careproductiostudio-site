# carepracticestudio.com

Four-page static marketing site for Care Practice Studio, built with [Astro](https://astro.build) and hosted on Cloudflare Pages.

| Page | Route | Source |
|---|---|---|
| Home | `/` | `src/pages/index.astro` |
| Who I help + case studies | `/help` | `src/pages/help.astro` |
| What I do | `/execution` | `src/pages/execution.astro` |
| Contact | `/contact` | `src/pages/contact.astro` |

The approved designs live in `care-practice-studio-site/` (git-ignored). They are the source of truth for copy and layout.

## Develop

```sh
npm install
npm run dev            # http://localhost:4321
npm run build          # static output in dist/
npm run check:content  # scan dist/ for banned pricing / compliance-claim language
```

End-to-end checks (Playwright, desktop and mobile viewports) against a running site:

```sh
npx playwright install chromium      # first time only
npx wrangler pages dev dist --port 8788
node scripts/verify.mjs http://localhost:8788 .shots   # screenshots go to .shots/
node scripts/verify.mjs https://carepracticestudio.com # or against production
```

## Common edits

- **Booking link:** set `BOOKING_URL` in `src/data/site.ts`. UTM tags are added automatically, and any answers to the optional questions are passed along as Calendly prefills (`a1`–`a3`).
- **Add a case study:** add an object to the `caseStudies` array in `src/data/caseStudies.ts`. The carousel, dots, and counter update automatically, and the "In progress" placeholder slide disappears once there are two real studies. To show a screenshot, put the image in `public/` and set `image: { src, alt }`.
- **Nav and footer links:** edit `NAV_LINKS` in `src/data/site.ts`. The sitemap is generated from `ROUTES` in the same file.

## Deploy

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the site, runs the content check, and deploys `dist/` to the Cloudflare Pages project `carepracticestudio` with `cloudflare/wrangler-action`. Pull requests only build and run the check.

Required repository secrets:

- `CLOUDFLARE_API_TOKEN`: an API token with the **Account › Cloudflare Pages › Edit** permission
- `CLOUDFLARE_ACCOUNT_ID`
