export type DisciplineTag = "design" | "engineering" | "research";

export interface ShippedProject {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  tagline: string;
  discipline: DisciplineTag;
  role: string;
  organization: string;
  period: string;
  scale: string;
  platforms: string[];
  hipaaNotice?: string;
  previewKind:
    | "onewell-core"
    | "c2s-pahm"
    | "dioscorium"
    | "luwian"
    | "onewell-mobile"
    | "ministry";
  summaryMetrics: Array<{ label: string; value: string }>;
  brief: string;
  researchAndTelemetry: string[];
  systemAndCraft: string[];
  outcomes: string[];
  /** Optional drop-in curated, PII-free image paths under /media/work/<slug>/ */
  galleryNote: string;
}

export const SHIPPED_PROJECTS: ShippedProject[] = [
  {
    slug: "onewell-core",
    number: "01",
    title: "OneWell Core: Brand to Design System",
    shortTitle: "OneWell Core",
    tagline:
      "Built from scratch across a 12-state healthcare platform: branding, typography, custom monoline iconography, semantic APCA tokens, React 19 UI architecture, and developer & AI-agent guidelines.",
    discipline: "engineering",
    role: "Lead Designer & Frontend Engineer",
    organization: "OneWell Health Care",
    period: "Oct 2025 - Present",
    scale: "Active across 12 US States",
    platforms: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Playwright"],
    hipaaNotice:
      "All live visual specimens below use synthetic operational fixtures; real patient and clinician records are strictly excluded.",
    previewKind: "onewell-core",
    summaryMetrics: [
      { label: "Coverage", value: "12 US States" },
      { label: "Contrast Model", value: "APCA + WCAG 2.1 AA" },
      { label: "Ownership", value: "0-to-1 Brand to Code" },
    ],
    brief:
      "OneWell needed a single, durable design and frontend foundation capable of unifying disparate enterprise modules across 12 US states without letting visual drift or accessibility regressions sneak into rapid multi-team releases.",
    researchAndTelemetry: [
      "Audited existing enterprise surfaces for visual fragmentation, keyboard traps, focus-ring omissions, and large-text mobile overflow before writing token primitives.",
      "Mapped high-frequency care and HR workflows to define a strict spacing, typography, and semantic surface scale that stays legible across desktop and mobile large-text settings.",
    ],
    systemAndCraft: [
      "Established the end-to-end visual foundation from zero: brand identity, layout archetypes, typography scale, custom monoline iconography tuned for optical alignment, and semantic light/dark/high-contrast color tokens.",
      "Engineered accessible WAI-ARIA primitives (dialogs, drawers, tabs, accordions, timelines, tooltips, responsive wizards) on Next.js 15 (App Router), React 19, strict TypeScript, and Tailwind CSS.",
      "Authored DESIGN.md handbooks and AI-agent engineering skill guidelines backed by automated Playwright WCAG 2.1 A/AA and component compliance guardrails in CI.",
    ],
    outcomes: [
      "Unified brand, tokens, iconography, and production React components under one authoritative system powering multi-state healthcare workflows.",
      "Shifted accessibility from late-stage manual QA review into automated contrast math and CI compliance checks.",
      "Codified explicit taste and layout contracts so both human engineers and coding agents ship consistent UI without reinventing primitives.",
    ],
    galleryNote:
      "Curated Figma exports dropped into public/media/work/onewell-core/ render directly below the live interactive token specimen.",
  },
  {
    slug: "c2s-pahm",
    number: "02",
    title: "C2S / PAHM: Multi-State Platform Renewal",
    shortTitle: "C2S / PAHM",
    tagline:
      "End-to-end UX and performance modernization across 12 US states, turning legacy latency and Lighthouse audits into restructured workflows for nursing, onboarding, talent, service coordination, scheduling, and HR.",
    discipline: "research",
    role: "Lead Designer & Frontend Engineer",
    organization: "OneWell Health Care",
    period: "2026",
    scale: "12 US States · 6 Operational Domains",
    platforms: ["Web Platform", "Next.js", "Design Systems", "Lighthouse Audits"],
    hipaaNotice:
      "Workflows shown here represent structural architecture and synthetic SLA states with zero real participant PII.",
    previewKind: "c2s-pahm",
    summaryMetrics: [
      { label: "Domains Renewed", value: "6 Core Suites" },
      { label: "Footprint", value: "12 US States" },
      { label: "Baseline Method", value: "Latency & Lighthouse" },
    ],
    brief:
      "The legacy C2S / PAHM operational platform had grown dense, slow, and inconsistent across clinical and administrative teams. Service Coordinators, Nurses, Supervisors, and HR specialists juggled fragmented screens to track strict statutory deadlines and compliance packets.",
    researchAndTelemetry: [
      "Measured and documented legacy page limitations systematically through Lighthouse performance audits and interaction latency benchmarks before redesigning.",
      "Shadowed role-specific obligations across Service Coordinators, Supervisors, and QA reviewers to unify scattered deadlines (quarterly calls, reassessments, PCSP, critical incidents) into a single obligation-driven queue.",
    ],
    systemAndCraft: [
      "Rolled out the unified OneWell Core design system across the renewed C2S platform to eliminate inconsistent tables, forms, and alert treatments.",
      "Restructured page architecture across nursing assessments, onboarding, talent specialists, service coordination (Command Center: Now / Today / Caseload), scheduling, and HR.",
      "Designed role-tailored views separating immediate coordinator action from supervisor escalation trends and NCQA/QA compliance audits.",
    ],
    outcomes: [
      "Replaced fragmented legacy screens with a cohesive, predictable page hierarchy shared across all six operational departments.",
      "Grounded every layout decision in documented latency/Lighthouse bottlenecks rather than subjective visual re-skinning.",
      "Established a repeatable architecture capable of onboarding state-specific regulatory requirements across 12 US states.",
    ],
    galleryNote:
      "Drop sanitized C2S before/after boards into public/media/work/c2s-pahm/ to expand the visual archive.",
  },
  {
    slug: "dioscorium",
    number: "03",
    title: "Dioscorium: Clinical AI Across Web, iOS & Android",
    shortTitle: "Dioscorium",
    tagline:
      "Mobile (iOS & Android) and web UI architecture for a 10-module cardiology AI suite under SaMD / IEC 62366-1 usability constraints, featuring a luminance-pinned APCA 0.98G color system.",
    discipline: "design",
    role: "Lead UI/UX Designer",
    organization: "Dioscorium (OneWell Ecosystem)",
    period: "2026",
    scale: "10 Clinical Modules · iOS, Android & Web",
    platforms: ["iOS", "Android", "Web", "SaMD / IEC 62366-1", "APCA 0.98G"],
    hipaaNotice:
      "The interactive clinical cockpit below is a reimagined design-system reconstruction using 100% synthetic cardiology telemetry; zero proprietary production screens or real patient PHI are displayed.",
    previewKind: "dioscorium",
    summaryMetrics: [
      { label: "Clinical Surfaces", value: "10 Modules" },
      { label: "APCA Target", value: "Lc 77 - 87" },
      { label: "Regulatory Context", value: "SaMD / IEC 62366-1" },
    ],
    brief:
      "Cardiologists navigating ten specialized AI modules (ESC AI, Cardio Risk, Med AI, Lab AI, Hypertension, Symptomatic, Preoperative, Echo AI, ECG AI, Dashboard) cannot afford consumer-app visual noise, SaaS marketing banners eating prime clinical space, or low-contrast dark surfaces. The live workstation above presents an unconstrained re-architecture of the clinical interface grounded in SaMD / IEC 62366-1 usability engineering and APCA 0.98G color science.",
    researchAndTelemetry: [
      "Audited clinical workspace ergonomics under bright exam-room and dimmed cath-lab viewing conditions—identifying how decorative SaaS hero banners, duplicated rainbow launcher cards, and muddy mid-gray dark surfaces increase cognitive load and alarm fatigue.",
      "Evaluated color-coded navigation drawers where semi-transparent white tints degrade luminance contrast and where >Lc 90 triggers dark-room halation bloom.",
      "Mapped multi-organization tenancy, ESC guideline evidence traceability, and explicit human-in-the-loop sign-off points so AI recommendations stay transparent and auditable.",
    ],
    systemAndCraft: [
      "Designed Dioscorium natively for iOS, Android, and clinical web under SaMD / IEC 62366-1 discipline—then re-architected the showcase above into a telemetry-first cockpit (try switching Exam Room / Cath Lab lighting and APCA Rail / Quiet Rail alarm-fatigue mode live).",
      "Engineered a parametric per-theme color token rule (pinned luminance constants Y ~ 0.84 and Y ~ 0.70 plus a per-module hue parameter) instead of ten fragile hand-picked palettes.",
      "Verified every module's inactive and active text pairs with APCA 0.98G (Lc 78.6-87.3 inactive; Lc ~77 active at 15px/700) and WCAG 2.x AAA/AA cross-checks, while reserving saturated semantic color strictly for clinical thresholds.",
    ],
    outcomes: [
      "Guaranteed contrast by construction across all 10 clinical surfaces—new modules inherit verified accessibility automatically from a single hue parameter.",
      "Replaced decorative launcher clutter with immediate synthetic telemetry (Lead II ECG strip, 14-day BP trend, ESC evidence citations) and explicit clinician sign-off controls.",
      "Delivered consistent multi-platform UX patterns spanning iOS, Android, and multi-tenant clinical web without leaking proprietary production artifacts.",
    ],
    galleryNote:
      "The live interactive clinical cockpit above runs purely on synthetic cardiology data and verified APCA 0.98G tokens.",
  },
  {
    slug: "luwian",
    number: "04",
    title: "Luwian: Lead Designer for AI Banking",
    shortTitle: "Luwian",
    tagline:
      "Lead Designer for an AI-powered banking platform guiding users step-by-step through predictive models and financial algorithms with contextual in-product AI suggestions.",
    discipline: "design",
    role: "Lead Designer",
    organization: "Luwian",
    period: "2026",
    scale: "Product UX, Brand Identity & Motion",
    platforms: ["Web App", "AI Product UX", "Brand Systems", "HTML5 Canvas"],
    previewKind: "luwian",
    summaryMetrics: [
      { label: "Role", value: "Lead Designer" },
      { label: "Domain", value: "AI Banking" },
      { label: "Scope", value: "UX + Brand + Motion" },
    ],
    brief:
      "Predictive financial algorithms are intimidating when presented as black-box dashboards. Luwian needed a product experience and visual identity that demystifies financial forecasting—walking users step by step through model selection and parameters with calm, actionable AI suggestions.",
    researchAndTelemetry: [
      "Structured multi-step algorithmic workflows to surface confidence, inputs, and suggested next moves progressively rather than dumping raw parameters on screen one.",
      "Tested procedural motion prototypes for perceived responsiveness and visual restraint across dark surfaces (`#131313` canvas with `#C8FF2E` kinetic accents).",
    ],
    systemAndCraft: [
      "Served as Lead Designer owning the internal product UX, ongoing design maintenance, brand visual language, and LinkedIn/external communication visual systems.",
      "Designed progressive step-by-step prediction flows where contextual AI suggestions explain *why* a parameter or algorithm fits the user's goal before execution.",
      "Coded custom procedural HTML5 Canvas motion studies (such as the undulating 3D-projected dotted shell shown above) to give the brand an unmistakable living signature.",
    ],
    outcomes: [
      "Aligned product UI, internal tooling, motion language, and public brand visuals under a single coherent design direction.",
      "Turned complex predictive banking models into guided, legible step-by-step user journeys.",
    ],
    galleryNote:
      "Drop sanitized Luwian product screens or LinkedIn visual boards into public/media/work/luwian/ to expand this case study.",
  },
  {
    slug: "onewell-mobile",
    number: "05",
    title: "OneWell Mobile: Watch, Phone & Web Shift Flows",
    shortTitle: "OneWell Mobile",
    tagline:
      "Cross-device care documentation designed for Direct Support Professionals working one-handed mid-shift—compressing task logging to 2 taps on watchOS and aligning frontend/backend error contracts.",
    discipline: "design",
    role: "Lead Designer & Frontend Engineer",
    organization: "OneWell Health Care",
    period: "Oct 2025 - Present",
    scale: "watchOS, iOS, Android & Web",
    platforms: ["watchOS", "iOS", "Android", "Web", "UMUX-Lite Research"],
    hipaaNotice:
      "Shift examples use fictional care tasks and synthetic timestamps; zero real participant records.",
    previewKind: "onewell-mobile",
    summaryMetrics: [
      { label: "Watch Target", value: "2 Taps Max" },
      { label: "Glance Budget", value: "~2 Seconds" },
      { label: "Validation", value: "Real vs. Synthetic" },
    ],
    brief:
      "Direct Support Professionals document care while actively supporting another person. Past two taps on a watch, staff abandon it and pull out a phone—breaking eye contact and delaying documentation until memory fades after a shift.",
    researchAndTelemetry: [
      "Ran desirability studies pairing UMUX-Lite with Product Reaction Cards across both real participants and synthetic personas to expose where synthetic responses diverge from real field behavior.",
      "Interviewed benefits and HR stakeholders to map employee ACA eligibility (measuring vs. stability periods) into a clear mobile status experience.",
    ],
    systemAndCraft: [
      "Designed density as the core cross-device decision: watchOS surfaces only the next task (2 taps, inline confirm), phone displays the flat full shift without extra grouping overhead, and web exposes supervisor audit timestamps.",
      "Specified accessible mobile form components covering forgotten edge states—distinct read-only vs. disabled rows, translation-safe required/optional markers, and screen-reader announcements.",
      "Agreed on a shared frontend/backend login error contract so every failure state explains what actually happened and the next recovery action.",
    ],
    outcomes: [
      "Compressed mid-shift logging to a reliable 2-tap watchOS interaction carried coherently across watch, phone, and web.",
      "Eliminated ambiguous disabled-looking read-only fields and vague login failures across mobile and backend teams.",
    ],
    galleryNote:
      "Drop curated watchOS/iOS mocks into public/media/work/onewell-mobile/ alongside the live Shift Simulator.",
  },
  {
    slug: "ministry-of-trade",
    number: "06",
    title: "Ministry of Trade of Türkiye: National Public Platforms",
    shortTitle: "Ministry of Trade",
    tagline:
      "Lead Frontend Developer & UI Designer across 13 citizen-facing government services—architecting 6 visual themes, single-session SSO, WCAG/colorblind modes, and CRA-to-Vite modernization.",
    discipline: "engineering",
    role: "Lead Frontend Developer & UI Designer",
    organization: "LST Yazılım · Client: Ministry of Trade of Türkiye",
    period: "Nov 2022 - Jul 2025",
    scale: "13 Public Services · 6 Visual Themes",
    platforms: ["Next.js", "React", "TypeScript", "Angular (ABP)", "SCSS / BEM"],
    previewKind: "ministry",
    summaryMetrics: [
      { label: "Public Services", value: "13 Apps" },
      { label: "Visual Themes", value: "6 Customizable" },
      { label: "Build Migration", value: "CRA -> Vite" },
    ],
    brief:
      "National citizen portals under the Ministry of Trade (Tüketici Portal, Reklam Kurulu, ESBİS, Koopbis) needed unified design language, accessible high-contrast/colorblind support, modern build tooling, and seamless single-session authentication across 13 distinct government services.",
    researchAndTelemetry: [
      "Ran Lighthouse performance audits and accessibility evaluations across public citizen portals to identify rendering bottlenecks and visual impairment barriers.",
      "Mapped authenticated vs. unauthenticated citizen entry paths so public announcements and multi-service menus remain accessible without login walls.",
    ],
    systemAndCraft: [
      "Led frontend architecture and UI redevelopment of Tüketici Portal in Next.js, TypeScript, Redux, Context API, and SCSS (BEM)—primary owner across Uzlaşma, Reklam, E-Garanti, and TÜBİS.",
      "Built 6 customizable visual themes and a single-session (SSO) multi-application authentication architecture enabling seamless navigation across 13 services.",
      "Built Reklam Kurulu in React + MUI with dedicated colorblind and high-contrast modes, migrated legacy CRA tooling to Vite, modernized ESBİS from React Class Components to Hooks (+ C#/.NET 4.7.2 reporting), and refined Koopbis on Angular/ABP.",
    ],
    outcomes: [
      "Delivered a cohesive multi-theme public portal unifying 13 government applications under reusable component patterns.",
      "Eliminated legacy CRA build bottlenecks via Vite migration while expanding WCAG and colorblind accessibility for national citizen audiences.",
    ],
    galleryNote:
      "Public-sector case documentation focuses on architecture, multi-theme systems, and WCAG accessibility patterns.",
  },
];

export function getProjectBySlug(slug: string): ShippedProject | undefined {
  return SHIPPED_PROJECTS.find((p) => p.slug === slug);
}
