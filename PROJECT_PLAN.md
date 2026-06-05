# LinkJet.cc

**Status:** ✅ Phase 1-5 Complete (25 Playwright tests, all passing) | 🔄 Phase 6: Git & GitHub

## Goal

Build and deploy a polished URL shortening website called linkjet.cc — dark premium UI, orange accents, multi-step link creation, localStorage history.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React
- clsx
- Playwright (validation)

## Milestones

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Project setup | ✅ |
| 2 | Design system | ✅ |
| 3 | Static UI | ✅ |
| 4 | Client functionality | ✅ |
| 5 | QA & validation | 🔄 |
| 6 | Git & GitHub | ⏳ |
| 7 | VPS deployment | ⏳ |

## Directory Structure

```
LinkJet.cc/
├── app/
│   ├── globals.css          # Theme & global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── header.tsx
│   ├── hero.tsx
│   ├── link-form.tsx        # Multi-step form
│   └── history.tsx
├── hooks/
│   └── useHistory.tsx       # localStorage context
├── lib/
│   ├── url.ts               # Validation & slug gen
│   └── utils.ts             # cn() helper
├── types/
│   └── index.ts
├── validation/              # QA artifacts
├── Images/                  # Design references
├── PROJECT_PLAN.md
├── ROADMAP.md
└── secrets.example.env
```

## Validation Checklist

- [x] TypeScript check passes
- [x] `npm run build` passes
- [x] Homepage loads
- [x] URL input works
- [x] Random slug generation works
- [x] Vanity slug validation works
- [x] Invalid slug shows error
- [x] Short link appears on success
- [x] Copy button works
- [x] History persists after reload
- [x] Delete row works
- [x] Clear all works
- [x] Mobile layout responsive
- [x] Back button preserves URL input
- [x] Pasted linkjet.cc URL prefix stripped in slug field
- [x] Slug >30 chars rejected
- [x] Duplicate slug detected via history
- [x] URL without protocol rejected
- [x] javascript: URL scheme rejected
- [x] 25/25 Playwright tests pass

## Deployment Checklist

- [ ] VPS accessible
- [ ] Node.js installed
- [ ] App running
- [ ] Domain configured
- [ ] Reverse proxy (Nginx/Caddy)
- [ ] SSL certificate
- [ ] HTTPS validation
- [ ] Screenshots captured

## Known Issues

- QR code is frontend-only placeholder
- No backend redirect service yet
- Vanity slug validation is client-side only (no API to enforce globally)

## Future Roadmap

See [ROADMAP.md](./ROADMAP.md)
