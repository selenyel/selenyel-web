export interface ConceptStudy {
  id: string;
  badge: "Concept Study";
  phase: "Phase 2 Subdomain Planned";
  plannedUrl: string;
  title: string;
  domain: string;
  summary: string;
  designHypothesis: string;
  constraints: string[];
  previewKind: "field-pos" | "game-site";
}

export const CONCEPT_STUDIES: ConceptStudy[] = [
  {
    id: "field-pos",
    badge: "Concept Study",
    phase: "Phase 2 Subdomain Planned",
    plannedUrl: "pos.selenyel.com",
    title: "Field-Ops & Cashier Ergonomic POS",
    domain: "High-Touch Physical Environments",
    summary:
      "Oversized, stylish tap targets designed for rushed field workers and cashiers—pairing Fitts's Law ergonomics with zero-misclick confirmation and clear visual contrast under glare.",
    designHypothesis:
      "Large buttons don't have to look crude. Tight typographic hierarchy, tactile press states, and thumb-zone clustering let high-speed operators complete orders with one hand without sacrificing visual calm.",
    constraints: [
      "Minimum 56px+ primary touch targets for gloved or hurried taps",
      "Hold-or-double-confirm guard on destructive/void actions",
      "High-luminance contrast tokens legible under harsh indoor/outdoor glare",
    ],
    previewKind: "field-pos",
  },
  {
    id: "game-site",
    badge: "Concept Study",
    phase: "Phase 2 Subdomain Planned",
    plannedUrl: "game.selenyel.com",
    title: "Atmospheric Game Website & HUD",
    domain: "Expressive Interactive Editorial",
    summary:
      "An exploration of visual range beyond enterprise SaaS—combining expressive display typography, responsive HUD micro-interactions, and motion-safe atmospheric framing.",
    designHypothesis:
      "Game web experiences often trade legibility and accessibility for heavy WebGL shaders. Crisp CSS/Canvas layers, deliberate ease-out timing, and keyboard-safe HUD switches deliver drama without 4-second preloaders.",
    constraints: [
      "Zero blocking preloader; sub-second first meaningful paint",
      "Full keyboard navigation and reduced-motion static fallbacks",
      "Expressive display typography anchored by disciplined contrast ratios",
    ],
    previewKind: "game-site",
  },
];
