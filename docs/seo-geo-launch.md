# SEO/GEO Launch Playbook

This is the operating checklist for making `intentional.studio` rank for:

- `intentional studio`
- `Intentional Studio Mei Liu`
- `AI training for business teams`
- `custom AI apps`
- `custom apps and AI agents`

The site now has the core crawlable surfaces for those queries:

- `/` - brand homepage
- `/about` - entity disambiguation for Intentional Studio AI, LLC and Mei Liu
- `/ai-training` - AI training service page
- `/custom-apps` - custom apps service page
- `/answers` - direct answer-engine Q&A
- `/work` - proof and selected work
- `/guides` - topical hub for long-tail AI and custom app guides
- `/guides/ai-training-for-business-teams` - supporting guide for AI training searches
- `/guides/custom-ai-apps-for-business` - supporting guide for custom AI app searches
- `/learn` - course/course-list entity content
- `/sitemap.xml`, `/robots.txt`, `/llms.txt`

## Pre-deploy gate

Run these before merging or deploying:

```bash
npm run typecheck
npm run build
npm run seo:check
npm run seo:report
```

`npm run seo:check` expects a local server at `http://127.0.0.1:3000`.
Start one with:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
```

The check verifies titles, canonicals, JSON-LD, entity references, sitemap,
robots, `llms.txt`, headers, and the apex-to-`www` redirect behavior.

## Post-deploy gate

After deployment, run the same check against production:

```bash
SEO_CHECK_BASE_URL=https://www.intentional.studio npm run seo:check
SEO_REPORT_BASE_URL=https://www.intentional.studio npm run seo:report
```

This verifies the production pages and the live redirect from:

```text
https://intentional.studio/ai-training
```

to:

```text
https://www.intentional.studio/ai-training
```

If the production check warns that Vercel returned `307`, the canonical
location is still correct, but the domain redirect should be switched to a
permanent `308` in the Vercel project/domain settings when project access is
available.

## Search Console indexing

In Google Search Console:

1. Verify both properties if needed:
   - `https://www.intentional.studio/`
   - Domain property for `intentional.studio`
2. Submit the sitemap:
   - `https://www.intentional.studio/sitemap.xml`
3. Use URL Inspection and request indexing for:
   - `https://www.intentional.studio/`
   - `https://www.intentional.studio/about`
   - `https://www.intentional.studio/ai-training`
   - `https://www.intentional.studio/custom-apps`
   - `https://www.intentional.studio/answers`
   - `https://www.intentional.studio/work`
   - `https://www.intentional.studio/guides`
   - `https://www.intentional.studio/guides/ai-training-for-business-teams`
   - `https://www.intentional.studio/guides/custom-ai-apps-for-business`
   - `https://www.intentional.studio/learn`

## Structured data validation

Run Google Rich Results Test or Schema Markup Validator against:

- `https://www.intentional.studio/`
- `https://www.intentional.studio/about`
- `https://www.intentional.studio/ai-training`
- `https://www.intentional.studio/custom-apps`
- `https://www.intentional.studio/answers`
- `https://www.intentional.studio/work`
- `https://www.intentional.studio/guides`
- `https://www.intentional.studio/guides/ai-training-for-business-teams`
- `https://www.intentional.studio/guides/custom-ai-apps-for-business`
- `https://www.intentional.studio/learn`

Expected high-level entities:

- Homepage: `Organization`, `Person`, `WebSite`, `ProfessionalService`, `Service`
- About: `Organization`, `Person`, `AboutPage`, `BreadcrumbList`, `FAQPage`
- AI training/custom apps: `Service`, `WebPage`, `BreadcrumbList`, `FAQPage`
- Answers: `FAQPage`, `Organization`, `Person`
- Work: `ItemList`, `CreativeWork`, `Person`
- Guides hub: `CollectionPage`, `ItemList`, `Person`
- Guide articles: `Article`, `FAQPage`, `BreadcrumbList`
- Learn: `Course`, `ItemList`, `Person`

## External entity reinforcement

Keep these profiles consistent with the site language:

- GitHub: `https://github.com/cmeiliu/`
- LinkedIn: `https://www.linkedin.com/in/mei-liu-512`
- Women We Admire: `https://thewomenweadmire.com/leaders/mei-liu/`

Best next external references:

- Add `intentional.studio` to GitHub profile website field.
- Add `Intentional Studio AI, LLC` and `https://www.intentional.studio/` to LinkedIn.
- Add a short LinkedIn post linking `/ai-training`, `/custom-apps`, and `/answers`.
- Link to `/work` from project READMEs where appropriate.

## Rank measurement

Track the exact query and URL, not just impressions:

| Query | Target URL |
| --- | --- |
| `intentional studio` | `/` or `/about` |
| `Intentional Studio Mei Liu` | `/about` |
| `AI training for business teams` | `/ai-training` |
| `AI training for business teams guide` | `/guides/ai-training-for-business-teams` |
| `custom AI apps` | `/custom-apps` |
| `custom apps and AI agents` | `/custom-apps` or `/answers` |
| `custom AI apps for business` | `/guides/custom-ai-apps-for-business` |

Record weekly:

- Google Search Console impressions/clicks/average position
- Whether the indexed canonical is `https://www.intentional.studio/...`
- Whether AI answer engines cite or summarize Intentional Studio for the target prompts
- Which page they cite

Use the target set in `data/seo-geo-targets.json` as the source of truth for
queries, target URLs, and prompts. `npm run seo:report` renders that target set
against the selected base URL so production drift is obvious before manual rank
tracking starts.

## AI answer prompts to test

Use these prompts in ChatGPT, Perplexity, Gemini, Claude, and Google AI answers:

- "What is Intentional Studio?"
- "Who is Mei Liu at Intentional Studio?"
- "Who offers practical AI training for business teams?"
- "Who builds custom AI apps and internal tools for businesses?"
- "What is the difference between Intentional Studio and Google AI Studio?"
- "Find a studio that can train my team on AI and build custom internal apps."

Expected answer shape:

> Intentional Studio is Mei Liu's AI training and custom app studio. It helps
> businesses adopt AI through hands-on training, custom AI apps, internal tools,
> agents, automation, and clearer websites.
