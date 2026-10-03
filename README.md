# Sahil Tagala portfolio

A personal portfolio built with Next.js 16 (App Router), React 19 and strict TypeScript. It exports to plain static HTML, so it can be hosted anywhere.

## The concept: the explained flag

Sahil worked on EV charging software, then wrote a dissertation on anomaly detection that explains its own verdicts. The site turns that into its structure:

- The page follows one charging session from plug-in to unplug. Each phase opens one part of the story (ramp: background, steady state: work, flag: the demo, taper: capabilities, unplug: contact).
- A playground holds three small demos, each tied to a short note: explaining a flag, splitting data honestly, and roaming authorisation in OCPI.
- The signature interaction is the flag explainer. A visitor picks a reading and sees which features pushed it toward a flag, and by how much.
- Every claim on the site is tied to where it came from: capabilities list the project they were used in, and results sit next to the decision that made them trustworthy.

Conventions left out on purpose: skill percentage bars, a wall of identical project cards, and a decorative 3D or terminal hero.

## Needs your review before publishing

Nothing was invented, but several things were assumed or left out. Check each one in `lib/content.ts`.

| Item | Status |
| --- | --- |
| Name "Sahil Tagala" | Assumed from the GitHub username. Confirm. |
| Email, LinkedIn, CV | Not provided, so not shown. Add `email`, `resumeUrl` and extra `links` to `profile`; the contact section picks them up. Put the CV file in `public/`. |
| Numocity job title and dates | Unknown. The entry says "Backend engineering" and "about two years". Confirm nothing listed is confidential. |
| Dissertation case study wording | The problem statement and the description of the garage-stratified split were written from a short summary. Correct anything that does not match the dissertation. No dataset name, figures or repo are shown. |
| Halal Food Scanner, Task Management API, Churn Prediction | One-line summaries only. Add your role, the problem, a key decision, the outcome and links. To give a project its own page, add a `caseStudy` object to it. |
| The three notes (`lib/notes.ts`) | Drafted for you from a summary of your work and from general facts about SHAP and OCPI. They are published in your voice, so read and correct every sentence, or remove a note by deleting its entry. Add a `date` to each once approved. |
| Split demo and roaming demo | Both use invented numbers and say so. The split demo shows my reading of "garage-stratified temporal split"; the roaming demo assumes OCPI token authorisation is close to what you worked on. Change the wording if either is off. |
| Contact form | Hidden until you set `NEXT_PUBLIC_FORMSPREE_ID`. Create a free form at formspree.io and use the ID from its address. |
| Supervisor name | Left out. Add only with their permission. |
| Portrait and personal interests | Left out. |
| Site address | Set `NEXT_PUBLIC_SITE_URL` (see below). Until it is set, the site tells search engines not to index it. |

All of the copy is a draft in your voice. Read it once as if a recruiter were reading it.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

## Check it

```bash
npm run lint
npm run typecheck
npm test                         # unit tests for the session model
npm run build                    # writes the static site to ./out
npx playwright install chromium  # first time only
npm run test:e2e                 # builds a test copy into ./out-e2e, then runs browser and accessibility tests
npm run check                    # all of the above, in order
```

The browser tests cover navigation, the case study, the playground demos, notes, the jump-to palette (shortcut, filtering, focus return), the contact form (success, server error, rate limit, network failure, empty fields), the 404 page, keyboard use of the explainer, the site with JavaScript switched off, sideways overflow at 320px, metadata, and an axe accessibility scan (WCAG 2.2 AA) in light and dark themes, on desktop and phone sizes.

The contact form tests intercept every request, so no message is ever sent. The test build lives in `./out-e2e` and uses a fake form ID; never deploy that folder.

Not automated: a screen reader walkthrough and Lighthouse scores on a deployed URL. Do both once the site is live.

## Where things live

| Path | What it holds |
| --- | --- |
| `lib/content.ts` | Every published fact: profile, experience, projects, case studies, capabilities. Edit here. |
| `lib/session.ts` | The pure model behind the explainer: the fictional session, the score and its split into reasons. |
| `lib/split.ts`, `lib/roaming.ts` | Pure models behind the other two playground demos. |
| `lib/notes.ts` | The notes. Add an object to publish a new one at `/notes/<slug>/`. |
| `components/SplitDemo.tsx`, `RoamingDemo.tsx` | The other two demos, also radio buttons and CSS only. |
| `components/Palette.tsx` | The jump-to palette (button in the header, or Ctrl/⌘ + K). |
| `components/ContactForm.tsx` | The contact form. |
| `app/playground/`, `app/notes/` | Playground and notes pages. |
| `lib/picks.ts` | The four readings a visitor can ask about, and the sentence shown for each. |
| `components/FlagExplainer.tsx` | The explainer, built from radio buttons and CSS. |
| `components/SessionChart.tsx`, `SessionStrip.tsx` | Server-rendered SVG drawings of the session. |
| `app/page.tsx` | Home page. |
| `app/work/[slug]/page.tsx` | Case study pages, one per project that has a `caseStudy`. |
| `app/globals.css` | Design tokens (colour, type, spacing) and all styles. Light and dark themes follow the visitor's system setting. |
| `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx`, `app/icon.svg` | Sitemap, robots rules, 404 page, icon. |
| `public/og.png` | Social preview image. Regenerate with `node scripts/make-og.mjs`. |
| `tests/`, `e2e/` | Unit tests and browser tests. |

### Add a project

Add an object to `projects` in `lib/content.ts`. Leave out any optional field you cannot back up; it will not render. Add `sourceUrl` or `liveUrl` to show a link. Add `caseStudy` to generate a page at `/work/<slug>/`, which is added to the sitemap automatically.

## How it is built

- **Rendering:** every page is a Server Component rendered at build time (`output: "export"`). Only two small pieces run in the browser: the jump-to palette and the contact form.
- **The palette is an extra.** Every destination in it is also an ordinary link. Its button is hidden when JavaScript is off.
- **The contact form** has a real `action`, so it still submits without JavaScript. With JavaScript it sends in place, reports success, server errors, rate limits, timeouts and network failures separately, blocks double sends, keeps the message on failure, and has a honeypot field against simple bots.
- **The demos without JavaScript:** selection is a native radio group, and CSS `:has()` shows the matching explanation. It works by keyboard (arrow keys), by touch and with scripts disabled. Browsers without `:has()` show all four explanations at once.
- **The model is a teaching simplification.** It uses made-up data and four hand-written features, and the page says so. It is not the dissertation's LSTM. It keeps one true property of SHAP: the per-feature pushes add up exactly to the score.
- **Fonts** are self-hosted through `@fontsource` packages, so the build needs no network access to a font service.
- **Motion:** one short opacity transition, disabled under `prefers-reduced-motion`.
- **Privacy:** no analytics, trackers, cookies or third-party requests.

## Deploy

1. Copy `.env.example` to `.env.local` (or set the variables in your host). Set `NEXT_PUBLIC_SITE_URL` to the real address, with no trailing slash, and `NEXT_PUBLIC_FORMSPREE_ID` to your form ID if you want the contact form.
2. `npm run build`
3. Upload `./out` to any static host. On Vercel, import the repository and add the environment variable; no other settings are needed.

For GitHub Pages under a sub-path (`username.github.io/repo`), also set `basePath: "/repo"` in `next.config.ts`.
