# LinkJet.cc

A polished URL shortening website — dark premium UI, orange accents, multi-step link creation, and localStorage history.

Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

## Features

- **Multi-step link shortener** — enter a long URL, customize your slug (or auto-generate), get a short link
- **Client-side validation** — URL format check, slug rules (3–30 chars, alphanumeric + hyphens), duplicate detection
- **History with localStorage** — links persist across sessions, delete individual entries or clear all
- **Copy to clipboard** — one-click copy with visual feedback
- **Responsive design** — desktop grid layout and mobile card layout with hamburger menu
- **Framer Motion animations** — smooth step transitions, fade/scale effects

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (`@theme inline`) |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Testing | Playwright 19 (25 E2E tests) |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |
| `npm run test` | Run Playwright E2E tests |
| `npm run test:ui` | Run Playwright with UI mode |
| `npm run screenshots` | Capture validation screenshots |

## Project Structure

```
LinkJet.cc/
├── app/
│   ├── globals.css          # Theme & Tailwind v4 custom properties
│   ├── layout.tsx           # Root layout with fonts & metadata
│   └── page.tsx             # Home page (Hero + LinkForm + History)
├── components/
│   ├── ui/                  # Design system primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── header.tsx           # Navigation (logo, links, mobile hamburger)
│   ├── hero.tsx             # Hero section with jet animation
│   ├── link-form.tsx        # Multi-step form (URL → vanity → result)
│   └── history.tsx          # History list (desktop grid / mobile cards)
├── hooks/
│   └── useHistory.tsx       # React Context + localStorage persistence
├── lib/
│   ├── url.ts               # URL validation, slug validation & generation
│   └── utils.ts             # cn() classname helper
├── types/
│   └── index.ts             # HistoryItem type definition
├── e2e/
│   └── homepage.spec.ts     # 25 Playwright tests
├── validation/              # QA artifacts (report + screenshots)
├── PROJECT_PLAN.md          # Build tracking
└── ROADMAP.md               # Future plans
```

## Validation

25 Playwright E2E tests covering:
- Homepage load & structure
- URL input validation (empty, invalid, missing protocol, javascript: scheme)
- Vanity slug validation (invalid chars, too short, too long, duplicate)
- Short link creation flow + copy button
- History CRUD (persist, delete, clear)
- Mobile responsive layout
- Edge cases (back button, URL prefix stripping, duplicate slug detection)

[View full report](./validation/validation-report.md)

## Deployment

Deployed on a VPS behind Nginx with Let's Encrypt SSL.

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for milestone tracking and [ROADMAP.md](./ROADMAP.md) for future plans.

## License

MIT
