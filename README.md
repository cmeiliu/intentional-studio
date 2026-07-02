# Intentional Studio

Marketing site for **Intentional Studio** — an AI practice run by Mei Liu.
Teaching, custom software, and website redesigns for businesses that want to actually use AI.

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS v4, Drizzle, Neon, Anthropic, Cal.com, PostHog, and the existing custom CSS.

- `app/page.tsx` - current brochure markup
- `app/globals.css` - Tailwind entry plus the Chanel-cruise palette and type system
- `app/BrochureEffects.tsx` - reveal-on-scroll, navbar state, hero card hover
- `app/start`, `app/projects`, `app/schedule` - onboarding funnel
- `app/api/start/*`, `app/api/webhooks/cal` - backend routes for intake, streaming generation, and booking persistence
- `lib/onboarding`, `lib/meetings` - Drizzle schemas and DB helpers
- `drizzle/0000_onboarding_meetings.sql` - funnel-scoped schema migration
- `public/assets/` - imagery

## Local preview

Install dependencies and run the local Next.js server:

```bash
npm install
npm run dev
```

Then visit <http://localhost:3000>.

## Simulation lanes

Start the local Next.js server, then run the example Pebbled lane:

```bash
npm run dev
npm run sim -- intentional-studio-homepage
```

Simulation evidence is written under `.sim-out/`. The runner uses system Chrome
and defaults to `http://127.0.0.1:3000`; override with `SIM_BASE_URL` or
`--base-url` when the dev server is on another port.

## SEO/GEO checks

Start the local server, then run the SEO/GEO verification gate:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
npm run seo:check
```

For production verification after deploy:

```bash
SEO_CHECK_BASE_URL=https://www.intentional.studio npm run seo:check
```

To generate a production evidence worksheet for rank/GEO tracking:

```bash
SEO_REPORT_BASE_URL=https://www.intentional.studio npm run seo:report
```

Launch and indexing steps live in `docs/seo-geo-launch.md`.

## Backend

The funnel stores sessions and bookings in the `pebbled-lead-gen` Neon database.
Run the scoped migration before sending traffic to the funnel:

```bash
npm run db:migrate
npm run db:check
```

The migration creates only `onboarding.*` and `meetings.*` objects. It does not
touch the existing `public.*` lead-gen CRM tables.
