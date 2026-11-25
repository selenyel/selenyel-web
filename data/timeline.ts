export interface TimelineRole {
  period: string;
  title: string;
  org: string;
  summary: string;
}

export const TIMELINE_ROLES: TimelineRole[] = [
  {
    period: "Oct 2025 - Present",
    title: "Lead Designer & Frontend Engineer",
    org: "OneWell Health Care · Active in 12 US States (Hybrid / Remote)",
    summary:
      "Built OneWell Core from scratch, covering branding, layout, typography, custom iconography, APCA design tokens, Next.js 15 / React 19 UI architecture, and developer & AI-agent guidelines. Led the full C2S / PAHM renewal (latency & Lighthouse audits plus nursing, onboarding, talent, service coordination, scheduling, and HR), served as Lead Designer on Luwian (AI banking), designed Dioscorium (Web, iOS & Android clinical AI under SaMD / IEC 62366-1), and shaped OneWell Mobile (iOS, watchOS, Android) and OneWell Web.",
  },
  {
    period: "Nov 2022 - Jul 2025",
    title: "Lead Frontend Developer & UI Designer",
    org: "LST Yazılım · Client: Ministry of Trade of Türkiye",
    summary:
      "Led Next.js frontend architecture and UI design for Tüketici Portal (13 government services, 6 visual themes, single-session SSO), migrated Reklam Kurulu from CRA to Vite with WCAG and colorblind modes, modernized ESBİS across React and C#/.NET 4.7.2, and contributed Angular/ABP improvements to Koopbis.",
  },
  {
    period: "Jan - Mar 2020",
    title: "Frontend Developer Intern (UI-Focused)",
    org: "BiSoft Bilgi Teknolojileri A.Ş.",
    summary:
      "Built responsive React data-visualization views rendering multi-dimensional seismic readings (depth and magnitude comparisons) with cross-viewport chart and table stability.",
  },
  {
    period: "2017 - 2018",
    title: "Software Engineering & QA Intern",
    org: "LOGO Yazılım (2 Internships · 8 Months Total)",
    summary:
      "Built modular AngularJS UI pages and Tiger 3 / Logo Flow widgets, authored unit and functional test suites, and configured Apache Ant CI/CD release-gating pipelines enforcing test coverage prior to publishing.",
  },
];

export const CRAFT_GROUPS = [
  {
    title: "Product & Visual Craft",
    accent: "var(--sand)",
    items: [
      "Design systems",
      "Brand identity",
      "Semantic design tokens",
      "APCA 0.98G & WCAG 2.1",
      "iOS, watchOS & Android UI",
      "Custom monoline icons",
      "Neurodiversity UX",
      "Figma",
      "Prototyping",
    ],
  },
  {
    title: "Design Engineering",
    accent: "var(--sage)",
    items: [
      "TypeScript (strict)",
      "React 19",
      "Next.js App Router",
      "Tailwind CSS",
      "Motion (Framer Motion)",
      "SCSS / BEM",
      "WAI-ARIA",
      "Playwright WCAG audits",
      "Vitest",
      "SwiftUI",
      "Cloudflare Workers",
    ],
  },
  {
    title: "Research & Scientific UX",
    accent: "var(--sky)",
    items: [
      "Latency & Lighthouse audits",
      "Usability testing",
      "UMUX-Lite & Reaction cards",
      "Real vs. Digital Twin studies",
      "UX KPI scoring models",
      "SaMD / IEC 62366-1",
      "AI-agent design guidelines",
      "GenAI in UX",
    ],
  },
];
