/**
 * Pure APCA-W3 (0.0.98G-4g) perceptual contrast + WCAG 2.1 cross-check.
 * Zero runtime dependencies; safe for both Cloudflare Workers and browsers.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function parseHex(hex: string): Rgb {
  const clean = hex.trim().replace(/^#/, "");
  const expanded =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    throw new Error(`Invalid hex color: "${hex}"`);
  }
  const num = Number.parseInt(expanded, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function apcaLuminance({ r, g, b }: Rgb): number {
  const lin = (c: number) => Math.pow(c / 255, 2.4);
  let y = 0.2126729 * lin(r) + 0.7151522 * lin(g) + 0.072175 * lin(b);
  if (y < 0.022) {
    y += Math.pow(0.022 - y, 1.414);
  }
  return y;
}

/**
 * Signed APCA Lc contrast of `textHex` on `bgHex`.
 * Positive = dark text on light background; negative = light text on dark background.
 */
export function apcaLcSigned(textHex: string, bgHex: string): number {
  const yTxt = apcaLuminance(parseHex(textHex));
  const yBg = apcaLuminance(parseHex(bgHex));
  if (Math.abs(yBg - yTxt) < 0.0005) return 0;

  if (yBg > yTxt) {
    const sapc = (Math.pow(yBg, 0.56) - Math.pow(yTxt, 0.57)) * 1.14;
    if (sapc < 0.1) return 0;
    return Number(((sapc - 0.027) * 100).toFixed(1));
  } else {
    const sapc = (Math.pow(yBg, 0.65) - Math.pow(yTxt, 0.62)) * 1.14;
    if (sapc > -0.1) return 0;
    return Number(((sapc + 0.027) * 100).toFixed(1));
  }
}

export function apcaLc(textHex: string, bgHex: string): number {
  return Math.abs(apcaLcSigned(textHex, bgHex));
}

function wcagLuminance({ r, g, b }: Rgb): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function wcagRatio(textHex: string, bgHex: string): number {
  const l1 = wcagLuminance(parseHex(textHex));
  const l2 = wcagLuminance(parseHex(bgHex));
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return Number(((hi + 0.05) / (lo + 0.05)).toFixed(2));
}

export interface ContrastEvaluation {
  lc: number;
  signedLc: number;
  wcag: number;
  wcagGrade: "AAA" | "AA" | "AA Large" | "Fail";
  apcaUse: "Body text (14px+)" | "Subhead / UI (16px+)" | "Large / bold only" | "Insufficient";
}

export function evaluateContrast(textHex: string, bgHex: string): ContrastEvaluation {
  const signedLc = apcaLcSigned(textHex, bgHex);
  const lc = Math.abs(signedLc);
  const wcag = wcagRatio(textHex, bgHex);
  const wcagGrade =
    wcag >= 7 ? "AAA" : wcag >= 4.5 ? "AA" : wcag >= 3 ? "AA Large" : "Fail";
  const apcaUse =
    lc >= 75
      ? "Body text (14px+)"
      : lc >= 60
        ? "Subhead / UI (16px+)"
        : lc >= 45
          ? "Large / bold only"
          : "Insufficient";

  return { lc, signedLc, wcag, wcagGrade, apcaUse };
}

/**
 * Blend semi-transparent foreground rgba over opaque background to demonstrate
 * why true alpha transparency degrades perceptual contrast compared to luminance pinning.
 */
export function blendOverOpaque(fgHex: string, alpha: number, bgHex: string): string {
  const fg = parseHex(fgHex);
  const bg = parseHex(bgHex);
  const a = Math.max(0, Math.min(1, alpha));
  const mix = (f: number, b: number) => Math.round(f * a + b * (1 - a));
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(mix(fg.r, bg.r))}${toHex(mix(fg.g, bg.g))}${toHex(mix(fg.b, bg.b))}`;
}

export interface DioscoriumSurface {
  id: string;
  name: string;
  hue: number;
  panelBg: string;
  inactiveText: string;
  activePill: string;
  activeText: string;
  clinicalNote: string;
}

export const DIOSCORIUM_SURFACES: DioscoriumSurface[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    hue: 2,
    panelBg: "#9B1611",
    inactiveText: "#F1ECEC",
    activePill: "#E2D9D9",
    activeText: "#650805",
    clinicalNote: "Position-learned home key with pinned off-white Y ~ 0.84.",
  },
  {
    id: "esc-ai",
    name: "ESC AI",
    hue: 325,
    panelBg: "#5E2A48",
    inactiveText: "#F1EBEF",
    activePill: "#E2D9DE",
    activeText: "#61043B",
    clinicalNote: "Guideline synthesis surface; high headroom without dark-panel halation.",
  },
  {
    id: "cardio-risk",
    name: "Cardio Risk",
    hue: 348,
    panelBg: "#911C36",
    inactiveText: "#F1EBED",
    activePill: "#E2D9DB",
    activeText: "#650518",
    clinicalNote: "Deep crimson end-of-hue active ink clears AAA on tinted chip.",
  },
  {
    id: "med-ai",
    name: "Med AI",
    hue: 150,
    panelBg: "#06602F",
    inactiveText: "#E9EEEC",
    activePill: "#D4DDD9",
    activeText: "#033C1F",
    clinicalNote: "Medication reconciliation; verified for low-halation clinic monitors.",
  },
  {
    id: "lab-ai",
    name: "Lab AI",
    hue: 192,
    panelBg: "#0F5B70",
    inactiveText: "#EAEEEF",
    activePill: "#D5DDDE",
    activeText: "#033947",
    clinicalNote: "Biomarker trend surface; luminance pinned so hue never shifts contrast.",
  },
  {
    id: "hypertension",
    name: "Hypertension",
    hue: 42,
    panelBg: "#6B4304",
    inactiveText: "#EFEDE9",
    activePill: "#DEDCD5",
    activeText: "#473203",
    clinicalNote: "Amber hue pulled into deep ochre band so warm white holds Lc 82+.",
  },
  {
    id: "symptomatic",
    name: "Symptomatic",
    hue: 230,
    panelBg: "#2B3E95",
    inactiveText: "#EDEDF1",
    activePill: "#DADCE2",
    activeText: "#0C2291",
    clinicalNote: "Indigo clinical triage module; active 15px/700 chip hits Lc 77.",
  },
  {
    id: "preoperative",
    name: "Preoperative",
    hue: 212,
    panelBg: "#3C4550",
    inactiveText: "#ECEEEF",
    activePill: "#D9DBDE",
    activeText: "#21354D",
    clinicalNote: "Neutral slate surgical clearance module with low chromatic fatigue.",
  },
  {
    id: "echo-ai",
    name: "Echo AI",
    hue: 262,
    panelBg: "#3E327A",
    inactiveText: "#EEEDF1",
    activePill: "#DDDBE2",
    activeText: "#3D0F8B",
    clinicalNote: "Echocardiography imaging companion tuned for dimmed exam rooms.",
  },
  {
    id: "ecg-ai",
    name: "ECG AI",
    hue: 20,
    panelBg: "#8E3A20",
    inactiveText: "#F0ECEB",
    activePill: "#E1DBD7",
    activeText: "#5C2306",
    clinicalNote: "Waveform interpretation surface; terracotta panel keeps Lc >= 78.",
  },
];
