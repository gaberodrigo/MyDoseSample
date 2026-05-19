# MyDose — Premium Landing Page

A production-quality, cinematic landing page demonstrating senior-level frontend engineering. Inspired by the motion design of landonorris.com with a minimal SaaS aesthetic (Linear, Stripe, Vercel-level polish).

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # ESLint
```

## Tech Stack

| Tool | Role |
|---|---|
| Next.js 16 (App Router) | Framework, SSG, file-based routing |
| TypeScript | Type safety throughout |
| Tailwind CSS v4 | CSS-first utility styling, no config file |
| Framer Motion 12 | React-native animations, spring physics, hover effects |
| GSAP 3 + @gsap/react | Scroll-driven parallax, text mask reveals, ScrollTrigger |
| Lenis | Smooth scroll, bridged to GSAP ticker |
| shadcn/ui (base-ui) | Accessible headless primitives |
| next-themes | SSR-safe dark/light mode |

## Architecture

```
src/
├── app/
│   ├── layout.tsx          Root layout — ThemeProvider + LenisProvider + MotionConfig
│   ├── page.tsx            Server component, composes sections
│   ├── ClientSections.tsx  Client boundary for lazy-loaded sections (ssr: false)
│   └── globals.css         Tailwind v4 design tokens, glass utilities, keyframes
├── components/
│   ├── ui/                 shadcn-generated (untouched)
│   ├── layout/
│   │   ├── Navbar.tsx      Sticky blur nav, animated hamburger → X, mobile Sheet
│   │   └── Footer.tsx      Server component, link grid
│   └── sections/
│       ├── HeroSection.tsx          Full-screen hero, GSAP word reveals, blob parallax
│       ├── MarqueeSection.tsx       Infinite ticker, scroll velocity → speed modulation
│       ├── FeaturesSection.tsx      Feature grid + bento, FM stagger reveals
│       ├── FloatingCardsSection.tsx Multi-speed GSAP scroll cards, depth illusion
│       ├── DeckCardsSection.tsx     FM spring deck stack, neighbor-aware hover
│       └── CTASection.tsx           Closing CTA with glow and trust signals
├── hooks/
│   ├── useScrollVelocity.ts  RAF-based velocity with exponential smoothing
│   ├── useInView.ts          IntersectionObserver, one-shot trigger
│   ├── useReducedMotion.ts   OS prefers-reduced-motion listener
│   └── useLenis.ts           Access Lenis instance from context
├── animations/
│   ├── gsapConfig.ts       Register plugins once, shared GSAP config
│   ├── motionVariants.ts   All Framer Motion Variants centralized
│   └── easings.ts          Cubic bezier arrays for consistent easing
├── providers/
│   ├── LenisProvider.tsx   Lenis + GSAP ticker bridge
│   └── ThemeProvider.tsx   next-themes wrapper
└── lib/
    └── utils.ts            cn(), clamp(), mapRange(), lerp()
```

## Key Architecture Decisions

### Why GSAP and Framer Motion coexist without conflict

Each library owns a distinct domain — they never animate the same element simultaneously:

- **GSAP + ScrollTrigger**: Scroll-scrubbed parallax (blobs, floating cards), precise timeline sequencing (hero text reveal). GSAP's `force3D` ensures GPU-composited transforms only.
- **Framer Motion**: Component mount/exit, hover spring physics (CTA buttons, deck cards), stagger reveals on scroll entry.

### Lenis + GSAP ticker bridge

Standard Lenis setup uses `requestAnimationFrame` directly. Connecting Lenis to GSAP's ticker (`gsap.ticker.add(fn)`) ensures ScrollTrigger reads the smooth-scrolled position rather than native `window.scrollY`. Without this, parallax triggers fire at wrong positions.

`gsap.ticker.lagSmoothing(0)` is mandatory — otherwise GSAP's built-in lag smoothing double-smooths alongside Lenis.

### ssr: false boundary

All sections using GSAP or Lenis refs are loaded via `next/dynamic({ ssr: false })` inside `ClientSections.tsx`. This prevents Next.js from attempting to SSR DOM-only code while still letting the Hero render server-side for optimal LCP. The hero renders SSR-safe because its animations are deferred to `useGSAP` (runs after mount only).

### Performance profile

- Only `transform` and `opacity` are animated during scroll scrub — no layout-triggering properties
- GSAP `force3D: true` promotes all animated elements to compositor layers
- `will-change: transform` applied only to actively animating elements
- `IntersectionObserver` disconnects after first trigger (no permanent overhead)
- Scroll velocity hook uses RAF with exponential smoothing — not a scroll event listener

### Scalability

Adding a new section:
1. Create `src/components/sections/NewSection.tsx` with `'use client'`
2. Add a dynamic import to `ClientSections.tsx`
3. Drop `<NewSection />` into the render order

All animation primitives are shared from `animations/` — new sections inherit the same easing curves, variants, and GSAP config without duplication.

## Accessibility

- `<MotionConfig reducedMotion="user">` in layout.tsx — all FM animations disabled when OS setting is active
- GSAP sections check `useReducedMotion()` and skip animation setup
- Semantic HTML: `<header>`, `<main>`, `<footer>`, `<section aria-labelledby="...">`
- Deck cards: `role="button"`, `tabIndex={0}`, keyboard Enter/Space support
- Marquee rows: `aria-hidden="true"` (decorative only)
- All interactive elements have visible focus states
# MyDoseSample
