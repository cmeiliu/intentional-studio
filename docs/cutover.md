# Intentional Studio Funnel Cutover

## Before Production Traffic

1. Set Vercel env vars for Intentional Studio:
   - `DATABASE_URL` for the `pebbled-lead-gen` Neon project
   - `ANTHROPIC_API_KEY`
   - optional `ANTHROPIC_INTAKE_MODEL`
   - `NEXT_PUBLIC_CAL_LINK`
   - `CAL_WEBHOOK_SECRET`
   - optional PostHog and Instantly keys
2. Run `npm run db:migrate`.
3. Run `npm run db:check` and confirm:
   - `onboarding.sessions`
   - `onboarding.presurvey_submissions`
   - `meetings.meetings`
4. Deploy an Intentional preview.
5. Test `/start -> /projects -> /schedule`.
6. Send a signed Cal webhook test payload to `/api/webhooks/cal`.
7. Only after the handler is live and tested, change the Cal.com webhook URL to:
   `https://intentional.studio/api/webhooks/cal`.

## Do Not Change Overnight

- DNS
- Cal.com production webhook URL
- Vercel production settings
- Neon credentials

## Pebbled Follow-Up

Pebbled-side redirects and decommissioning stay in `PEBB-226`.
