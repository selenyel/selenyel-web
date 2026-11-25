# selenyel.com (`selenyel-web`)

Flagship personal portfolio and interactive design-engineering showcase for **Selen Yel Temellioğlu**, built with **Next.js App Router + React 19 + TypeScript (strict) + Tailwind CSS + `motion/react`** and deployed to **Cloudflare Workers** via **`vinext`**.

## Highlights

- **Warm Architectural Blueprint System**: Three WCAG-verified appearance modes (`Light`, `Dark`, `High contrast`) with View Transition radial wipes and an opt-in Figma Dev-Mode **`Inspect`** overlay displaying live token bindings and computed APCA `Lc` scores.
- **Craft & AI-Agent Taste Lab**: Interactive side-by-side Default vs. Crafted comparisons covering entrance scale (`scale(0)` vs `scale(0.95)`), easing curves (`ease-in` vs `ease-out`), luminance-pinned APCA palettes, surface depth, and machine-readable AI-agent UI rules.
- **Scientific UX & Measurement Lab**:
  1. Live Adaptive UI Controls (theme, density, typography scale, motion, and color-vision simulation)
  2. Before/After Lighthouse & Latency Audit (C2S modernization)
  3. Real Users vs. Synthetic Digital Twins divergence comparison
  4. Interactive UX KPI & Satisfaction Score calculator (UMUX-Lite / SUS / SEQ / Task Success)
- **Full-Width Case Studies (`/work/[slug]`)**: Six shipped production systems (`onewell-core`, `c2s-pahm`, `dioscorium`, `luwian`, `onewell-mobile`, `ministry-of-trade`), kept cleanly separated from the experimental **Interface Lab** concept studies.
- **Quiet `⌘K` Command Palette**: Instant jump to case studies, sections, theme toggles, Inspect Mode, and email copy.

## Adding Real Project Media

Drop approved screenshots or short looping `.mp4` / `.webm` clips into the matching folder under `public/media/work/<slug>/` (`onewell-core`, `c2s-pahm`, `dioscorium`, `luwian`, `onewell-mobile`, `ministry-of-trade`) and reference them in `data/work.ts`. Interactive live specimens render automatically as zero-broken-image fallbacks until media files are added.

## Commands

```bash
npm run dev            # Start local vinext dev server
npm run verify         # Typecheck + Vitest unit tests + production Cloudflare Worker build
npm run test:e2e       # Playwright E2E + axe-core WCAG 2.1 A/AA audit across Light/Dark/High-Contrast
npm run deploy:preview # Deploy a Cloudflare Workers preview URL
npm run deploy         # Deploy production selenyel-web Worker to Cloudflare
```
