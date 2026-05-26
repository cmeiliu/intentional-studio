# Intentional Studio

Marketing site for **Intentional Studio** — an AI practice run by Mei Liu.
Teaching, custom software, and website redesigns for businesses that want to actually use AI.

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS v4, and the existing custom CSS.

- `app/page.tsx` - current brochure markup
- `app/globals.css` - Tailwind entry plus the Chanel-cruise palette and type system
- `app/BrochureEffects.tsx` - reveal-on-scroll, navbar state, hero card hover
- `public/assets/` - imagery

## Local preview

Install dependencies and run the local Next.js server:

```bash
npm install
npm run dev
```

Then visit <http://localhost:3000>.
