"use client";

import React, { useMemo, useState } from "react";
import { DIOSCORIUM_SURFACES, evaluateContrast } from "@/lib/apca";

interface ModuleSpec {
  id: string;
  guideline: string;
  confidence: string;
  visualKind: "ecg" | "trend" | "metrics";
  headline: string;
  advisory: string;
  kpis: Array<{ label: string; value: string; delta?: string; status?: "ok" | "warn" | "neutral" }>;
  evidence: Array<{ signal: string; rule: string; weight: string }>;
  iconPath: string;
}

const MODULE_SPECS: Record<string, ModuleSpec> = {
  dashboard: {
    id: "dashboard",
    guideline: "ESC 2024 · Unified Cockpit",
    confidence: "98.1%",
    visualKind: "ecg",
    headline: "Active Telemetry & Priority Clinical Queue",
    advisory:
      "Sinus rhythm stable across synthetic Lead II strip (HR 71 bpm, QTcF 414 ms). 1 non-urgent hypertension follow-up flagged for clinician review.",
    kpis: [
      { label: "Heart Rate", value: "71 bpm", delta: "Sinus", status: "ok" },
      { label: "QTcF Interval", value: "414 ms", delta: "< 450 ms", status: "ok" },
      { label: "Home BP Avg", value: "129/81", delta: "14d cohort", status: "neutral" },
      { label: "Pending Review", value: "1 Flag", delta: "Non-urgent", status: "warn" },
    ],
    evidence: [
      { signal: "Lead II Rhythm", rule: "Regular R-R variance < 42 ms, upright P-wave", weight: "Primary" },
      { signal: "BP Morning Log", rule: "Mean 129/81 mmHg vs. ESC 130/80 target", weight: "Watch" },
    ],
    iconPath: "M4 13h4l2-6 4 12 2-6h4",
  },
  "esc-ai": {
    id: "esc-ai",
    guideline: "ESC 2024 CCS · Class I, Level A",
    confidence: "97.4%",
    visualKind: "metrics",
    headline: "Guideline Synthesis & Evidence Traceability",
    advisory:
      "First-line anti-ischemic regimen aligned with ESC 2024 Chronic Coronary Syndromes §5.3. Source citations pinned inline—no ungrounded summary text.",
    kpis: [
      { label: "Evidence Class", value: "Class I", delta: "Level A", status: "ok" },
      { label: "Citation Grounding", value: "100%", delta: "3 ESC §§", status: "ok" },
      { label: "Contraindications", value: "0 Found", delta: "Checked", status: "ok" },
      { label: "Guideline Sync", value: "2024.2", delta: "Verified", status: "neutral" },
    ],
    evidence: [
      { signal: "ESC §5.3.1", rule: "Beta-blocker or CCB for symptom control in stable angina", weight: "Class I · A" },
      { signal: "ESC §6.1.2", rule: "High-intensity statin target LDL-C < 55 mg/dL for very high risk", weight: "Class I · A" },
    ],
    iconPath: "M6 4h12a1 1 0 0 1 1 1v14l-7-3-7 3V5a1 1 0 0 1 1-1Z",
  },
  "cardio-risk": {
    id: "cardio-risk",
    guideline: "SCORE2 / ESC 2021 · Low-Risk Region",
    confidence: "95.8%",
    visualKind: "trend",
    headline: "10-Year Cardiovascular Event Risk Model",
    advisory:
      "Synthetic baseline projects 6.4% 10-year CVD risk (moderate band). Controlling SBP below 130 mmHg yields the largest single modifiable risk reduction (-1.8%).",
    kpis: [
      { label: "10-Yr SCORE2", value: "6.4%", delta: "Moderate", status: "warn" },
      { label: "Non-HDL-C", value: "136 mg/dL", delta: "Modifiable", status: "neutral" },
      { label: "Systolic BP", value: "128 mmHg", delta: "Near goal", status: "ok" },
      { label: "Projected Delta", value: "-1.8%", delta: "If SBP <125", status: "ok" },
    ],
    evidence: [
      { signal: "Lipid Panel", rule: "LDL-C 118 mg/dL; ApoB optional secondary marker", weight: "+1.9% risk" },
      { signal: "BP Load", rule: "Borderline systolic trajectory over 14-day home readings", weight: "+1.4% risk" },
    ],
    iconPath: "M12 20V10M18 20V4M6 20v-4",
  },
  "med-ai": {
    id: "med-ai",
    guideline: "ESC Pharmacotherapy · Renal & QT Guard",
    confidence: "96.9%",
    visualKind: "metrics",
    headline: "Medication Reconciliation & Interaction Screen",
    advisory:
      "Zero major contraindications across current regimen. 1 moderate QTc prolongation watch noted if adding macrolide antibiotics; renal dose adjustment not required.",
    kpis: [
      { label: "Critical Conflicts", value: "0", delta: "Clear", status: "ok" },
      { label: "Moderate Flags", value: "1 Watch", delta: "QTc pair", status: "warn" },
      { label: "Renal Clearance", value: "74 mL/m", delta: "eGFR OK", status: "ok" },
      { label: "Active Agents", value: "4 Rx", delta: "Reconciled", status: "neutral" },
    ],
    evidence: [
      { signal: "QTc Interaction Check", rule: "Baseline QTcF 414 ms provides safe margin; monitor if macrolide initiated", weight: "Moderate" },
      { signal: "ACEi + K+ Check", rule: "Serum K+ 4.2 mmol/L & Cr stable within 14d window", weight: "Cleared" },
    ],
    iconPath: "M9 3h6M10 3v5l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3",
  },
  "lab-ai": {
    id: "lab-ai",
    guideline: "ESC 0h/1h hs-cTn Algorithm",
    confidence: "97.9%",
    visualKind: "metrics",
    headline: "Cardiac Biomarker & Metabolic Trend Panel",
    advisory:
      "High-sensitivity Troponin I (6 ng/L) and NT-proBNP (92 pg/mL) remain comfortably below rule-in thresholds. Electrolytes stable for ongoing RAAS therapy.",
    kpis: [
      { label: "hs-cTnI", value: "6 ng/L", delta: "< 19 ref", status: "ok" },
      { label: "NT-proBNP", value: "92 pg/mL", delta: "< 125 ref", status: "ok" },
      { label: "Potassium (K+)", value: "4.2 mEq", delta: "3.5-5.0", status: "ok" },
      { label: "HbA1c", value: "5.6%", delta: "Normal", status: "neutral" },
    ],
    evidence: [
      { signal: "0h/1h Troponin Delta", rule: "Change < 2 ng/L — meets ESC rule-out safety criteria", weight: "Normal" },
      { signal: "Electrolyte Stability", rule: "No hyperkalemia signal across last 3 synthetic panels", weight: "Stable" },
    ],
    iconPath: "M9 3v6l-4 7a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 16l-4-7V3M8 3h8",
  },
  hypertension: {
    id: "hypertension",
    guideline: "ESC 2024 Elevated BP & HTN · Target <130/80",
    confidence: "96.4%",
    visualKind: "trend",
    headline: "14-Day Home BP Trajectory & Morning Surge",
    advisory:
      "14-day seated home average is 129/81 mmHg (within 1 mmHg of ESC systolic target). Mild +6 mmHg morning surge suggests evaluating evening dosing timing.",
    kpis: [
      { label: "14d Home Avg", value: "129/81", delta: "mmHg", status: "ok" },
      { label: "Morning Surge", value: "+6 mmHg", delta: "06:30-08:30", status: "warn" },
      { label: "ESC Target", value: "<130/80", delta: "Class I", status: "neutral" },
      { label: "Log Adherence", value: "93%", delta: "26/28 logs", status: "ok" },
    ],
    evidence: [
      { signal: "Circadian Split", rule: "AM mean 132/83 vs. PM mean 126/79 across 14 synthetic days", weight: "Insight" },
      { signal: "Cuff Calibration", rule: "Validated upper-arm oscillometric protocol confirmed", weight: "Verified" },
    ],
    iconPath: "M3 17l5-5 4 4 9-9M15 7h6v6",
  },
  symptomatic: {
    id: "symptomatic",
    guideline: "ESC Pre-Test Probability · RF-CL Model",
    confidence: "94.6%",
    visualKind: "metrics",
    headline: "Structured Symptom Intake & Red-Flag Triage",
    advisory:
      "Mild exertional dyspnea (NYHA II) without rest angina or syncope. Risk-factor-weighted clinical likelihood estimates 18% obstructive CAD—non-invasive functional imaging advised.",
    kpis: [
      { label: "RF-CL Likelihood", value: "18%", delta: "Low-Mod", status: "warn" },
      { label: "NYHA Class", value: "Class II", delta: "Exertional", status: "neutral" },
      { label: "Red Flags", value: "None", delta: "No rest pain", status: "ok" },
      { label: "Suggested Workup", value: "CCTA / Echo", delta: "Non-invasive", status: "neutral" },
    ],
    evidence: [
      { signal: "Symptom Profile", rule: "Exertional onset, relieved within 5 min rest, non-pleuritic", weight: "Score +2" },
      { signal: "Red-Flag Exclusion", rule: "Negative for orthopnea, syncope, or diaphoresis", weight: "Cleared" },
    ],
    iconPath: "M12 3l8 4v6c0 5-3.5 7.8-8 9-4.5-1.2-8-4-8-9V7l8-4Z",
  },
  preoperative: {
    id: "preoperative",
    guideline: "ESC 2022 Non-Cardiac Surgery · Class I",
    confidence: "96.2%",
    visualKind: "metrics",
    headline: "Perioperative Cardiac Clearance Matrix",
    advisory:
      "RCRI Score 1 with functional capacity >= 4 METs indicates low-to-intermediate perioperative risk. Continue chronic beta-blocker; routine invasive testing not indicated.",
    kpis: [
      { label: "RCRI Index", value: "1 / 6", delta: "Low-Int", status: "ok" },
      { label: "Functional Cap.", value: ">= 4 METs", delta: "2 flights", status: "ok" },
      { label: "Surgical Tier", value: "Intermediate", delta: "1-5% MACE", status: "warn" },
      { label: "Beta-Blocker", value: "Continue", delta: "Class I", status: "ok" },
    ],
    evidence: [
      { signal: "Functional Reserve", rule: "Sustained >= 4 METs without angina lowers stress-test yield", weight: "ESC §4.2" },
      { signal: "Antithrombotic Plan", rule: "Standardized hold/bridge checklist attached for surgical sign-off", weight: "Ready" },
    ],
    iconPath: "M9 11l2 2 4-4M6 4h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z",
  },
  "echo-ai": {
    id: "echo-ai",
    guideline: "EACVI / ASE Chamber Quantification",
    confidence: "97.2%",
    visualKind: "metrics",
    headline: "Transthoracic Echocardiography Companion",
    advisory:
      "Preserved systolic function (LVEF 58% Simpson biplane; GLS -19.2%) with normal filling pressures (E/e' 8.4). Surface tuned to dimmed exam-room luminance (Hue 262°).",
    kpis: [
      { label: "LVEF (Biplane)", value: "58%", delta: "Preserved", status: "ok" },
      { label: "Global GLS", value: "-19.2%", delta: "Normal", status: "ok" },
      { label: "E / e' Ratio", value: "8.4", delta: "Grade 0", status: "ok" },
      { label: "Wall Motion", value: "16/16", delta: "Normokinetic", status: "neutral" },
    ],
    evidence: [
      { signal: "Apical 4C / 2C View", rule: "Automated endocardial border tracking quality score 0.94", weight: "High QC" },
      { signal: "Dimmed Room Optics", rule: "Panel #3E327A holds Lc 87.3 inactive / Lc 77 active without bloom", weight: "APCA AAA" },
    ],
    iconPath: "M4 12a8 8 0 0 1 16 0M7.5 12a4.5 4.5 0 0 1 9 0M11 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0",
  },
  "ecg-ai": {
    id: "ecg-ai",
    guideline: "ESC / AHA 12-Lead Explainable Rhythm",
    confidence: "98.4%",
    visualKind: "ecg",
    headline: "Explainable 12-Lead Rhythm & ST-Segment Analysis",
    advisory:
      "Normal Sinus Rhythm at 71 bpm. Isoelectric ST segments across leads II, V2-V6; PR 158 ms, QRS 88 ms, QTcF 414 ms. Morphology saliency highlights R-peak regularity.",
    kpis: [
      { label: "Rhythm Class", value: "NSR", delta: "98.4% conf", status: "ok" },
      { label: "PR / QRS", value: "158 / 88", delta: "ms", status: "ok" },
      { label: "QTcF", value: "414 ms", delta: "Normal", status: "ok" },
      { label: "ST Deviation", value: "0.0 mV", delta: "Isoelectric", status: "ok" },
    ],
    evidence: [
      { signal: "Beat-to-Beat Regularity", rule: "P-wave precedes every QRS with constant 158 ms PR interval", weight: "98.4%" },
      { signal: "Ischemia Screen", rule: "No J-point elevation >= 0.1 mV across contiguous synthetic leads", weight: "Cleared" },
    ],
    iconPath: "M2 12h4l2-5 3 10 3-8 2 3h6",
  },
};

function EcgTraceSvg({
  accent,
  dark,
  compact = false,
}: {
  accent: string;
  dark: boolean;
  compact?: boolean;
}) {
  const gridMajor = dark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)";
  const gridMinor = dark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.03)";
  const labelCol = dark ? "#9FB0C3" : "#475569";

  // Crisp realistic 5-beat Lead II ECG strip (synthetic waveform spanning full width)
  const beat = (x0: number) =>
    `L${x0 + 20} 44 Q${x0 + 25} 44 ${x0 + 29} 39 Q${x0 + 33} 35 ${x0 + 37} 44 ` +
    `L${x0 + 47} 44 L${x0 + 51} 49 L${x0 + 57} 13 L${x0 + 63} 58 L${x0 + 68} 44 ` +
    `L${x0 + 84} 44 Q${x0 + 94} 33 ${x0 + 106} 44 L${x0 + 136} 44`;
  const wavePath = compact
    ? `M0 44 ${beat(0)} ${beat(136)} ${beat(272)} L408 44`
    : `M0 44 ${beat(0)} ${beat(136)} ${beat(272)} ${beat(408)} ${beat(544)} L680 44`;
  const vbW = compact ? 408 : 680;

  return (
    <div
      style={{
        borderRadius: "8px",
        border: `1px solid ${dark ? "#243040" : "#E2E8F0"}`,
        background: dark ? "#0B0F14" : "#FFFFFF",
        padding: compact ? "0.45rem 0.6rem" : "0.65rem 0.8rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: compact ? "0.6rem" : "0.66rem",
          color: labelCol,
          marginBottom: "0.25rem",
        }}
      >
        <span>LEAD II · 25 mm/s · 10 mm/mV (SYNTHETIC)</span>
        <span>NSR · 71 BPM</span>
      </div>
      <svg
        viewBox={`0 0 ${vbW} 72`}
        width="100%"
        height={compact ? "46" : "74"}
        preserveAspectRatio="none"
        role="img"
        aria-label="Synthetic Lead II electrocardiogram waveform showing normal sinus rhythm"
        style={{ display: "block" }}
      >
        <defs>
          <pattern id={compact ? "ecg-sm" : "ecg-lg"} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={gridMajor} strokeWidth="0.8" />
            <path d="M 10 0 L 10 20 M 0 10 L 20 10" fill="none" stroke={gridMinor} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={vbW} height="72" fill={`url(#${compact ? "ecg-sm" : "ecg-lg"})`} />
        <path
          d={wavePath}
          fill="none"
          stroke={accent}
          strokeWidth={compact ? "2.1" : "2.1"}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function TrendChartSvg({ accent, dark }: { accent: string; dark: boolean }) {
  const lineCol = dark ? "#243040" : "#E2E8F0";
  const labelCol = dark ? "#9FB0C3" : "#475569";
  // Synthetic 14-day SBP points (136 -> 127 trending down toward 130 ESC target line)
  const ys = [22, 25, 20, 28, 30, 26, 33, 31, 36, 34, 39, 37, 41, 40];
  const pts = ys.map((y, i) => [Math.round(20 + (i * 640) / (ys.length - 1)), y]);
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");

  return (
    <div
      style={{
        borderRadius: "8px",
        border: `1px solid ${lineCol}`,
        background: dark ? "#0B0F14" : "#FFFFFF",
        padding: "0.65rem 0.8rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: "0.66rem",
          color: labelCol,
          marginBottom: "0.25rem",
        }}
      >
        <span>14-DAY SYNTHETIC TRAJECTORY</span>
        <span>DASHED = ESC TARGET (130 mmHg)</span>
      </div>
      <svg
        viewBox="0 0 680 72"
        width="100%"
        height="74"
        role="img"
        aria-label="Synthetic 14-day blood pressure and cardiovascular risk trend line approaching ESC target"
        style={{ display: "block" }}
      >
        <line x1="0" y1="36" x2="680" y2="36" stroke={dark ? "#52657A" : "#94A3B8"} strokeDasharray="5 5" strokeWidth="1.2" />
        <path d={d} fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map(([x, y], idx) => (
          <circle key={idx} cx={x} cy={y} r={idx === pts.length - 1 ? 4.4 : 2.8} fill={accent} />
        ))}
      </svg>
    </div>
  );
}

/**
 * Compact homepage Bento Card preview for Dioscorium:
 * Split mini-cockpit combining the luminance-pinned APCA rail with an obsidian ECG strip.
 */
export function DioscoriumCardThumbnail() {
  const surface = DIOSCORIUM_SURFACES[0];
  const inactiveEval = evaluateContrast(surface.inactiveText, surface.panelBg);
  const activeEval = evaluateContrast(surface.activeText, surface.activePill);

  return (
    <div
      data-vision-stage="true"
      style={{
        display: "grid",
        gridTemplateColumns: "92px minmax(0, 1fr)",
        borderRadius: "var(--radius-s)",
        overflow: "hidden",
        border: "1px solid rgba(15, 23, 42, 0.16)",
        background: "#0E131A",
        width: "100%",
      }}
    >
      {/* Left APCA-pinned mini rail */}
      <div
        style={{
          background: surface.panelBg,
          color: surface.inactiveText,
          padding: "0.6rem 0.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.02em" }}>
          DIOSCORIUM
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.22rem" }}>
          {["Dashboard", "ESC AI", "Echo AI", "ECG AI"].map((label, i) => (
            <div
              key={label}
              style={{
                fontSize: "0.62rem",
                fontWeight: i === 0 ? 700 : 500,
                padding: "0.14rem 0.36rem",
                borderRadius: "4px",
                background: i === 0 ? surface.activePill : "transparent",
                color: i === 0 ? surface.activeText : surface.inactiveText,
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", opacity: 0.92 }}>
          Lc {inactiveEval.lc}/{activeEval.lc}
        </div>
      </div>

      {/* Right calm obsidian clinical cockpit preview */}
      <div
        style={{
          padding: "0.65rem 0.75rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "0.45rem",
          color: "#F3F4F6",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.35rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "#CBD5E1" }}>
            SaMD · IEC 62366-1
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              background: "#1B2634",
              color: "#E2E8F0",
              border: "1px solid #334155",
              padding: "0.1rem 0.42rem",
              borderRadius: "999px",
            }}
          >
            10 Modules · AAA
          </span>
        </div>

        <EcgTraceSvg accent="#F87171" dark compact />

        <div style={{ fontSize: "0.7rem", color: "#CBD5E1", lineHeight: 1.35 }}>
          Reimagined telemetry-first cockpit — zero SaaS hero clutter, APCA 0.98G color discipline.
        </div>
      </div>
    </div>
  );
}

/**
 * Full interactive "Design Director's Cut" Clinical Cockpit on /work/dioscorium.
 * Zero original production screenshots; 100% synthetic clinical telemetry + APCA 0.98G live math.
 */
export function DioscoriumCockpit() {
  const [selectedId, setSelectedId] = useState<string>(DIOSCORIUM_SURFACES[0].id);
  const [roomMode, setRoomMode] = useState<"cath" | "exam">("exam");
  const [railMode, setRailMode] = useState<"apca" | "quiet">("apca");
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});

  const surface = useMemo(
    () => DIOSCORIUM_SURFACES.find((s) => s.id === selectedId) ?? DIOSCORIUM_SURFACES[0],
    [selectedId]
  );
  const spec = MODULE_SPECS[surface.id] ?? MODULE_SPECS.dashboard;
  const inactiveEval = evaluateContrast(surface.inactiveText, surface.panelBg);
  const activeEval = evaluateContrast(surface.activeText, surface.activePill);

  const isDark = roomMode === "cath";
  const canvasBg = isDark ? "#0D1117" : "#F8FAFB";
  const cardBg = isDark ? "#151B23" : "#FFFFFF";
  const borderCol = isDark ? "#25303F" : "#E2E8F0";
  const inkPrimary = isDark ? "#F3F4F6" : "#0F172A";
  const inkMuted = isDark ? "#A3B1C2" : "#475569";

  // High-contrast chart trace color matched to room brightness (never muddy)
  const traceAccent = isDark ? "#93C5FD" : surface.panelBg;
  const isAck = Boolean(acknowledged[surface.id]);

  // Quiet-rail palette eliminates peripheral color fatigue while keeping a precision 3px APCA indicator bar
  const railBg =
    railMode === "apca" ? surface.panelBg : isDark ? "#11161E" : "#F1F5F9";
  const railFg =
    railMode === "apca" ? surface.inactiveText : isDark ? "#CBD5E1" : "#334155";
  const railActiveBg =
    railMode === "apca" ? surface.activePill : isDark ? "#1F2937" : "#FFFFFF";
  const railActiveFg =
    railMode === "apca" ? surface.activeText : isDark ? "#FFFFFF" : "#0F172A";

  return (
    <div
      className="dioscorium-shell"
      style={{
        borderRadius: "var(--radius-s)",
        overflow: "hidden",
        border: `1px solid ${borderCol}`,
        background: canvasBg,
        color: inkPrimary,
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* LEFT CLINICAL NAVIGATION RAIL (APCA 0.98G Hue Mode or Quiet Alarm-Fatigue-Free Mode) */}
      <aside
        data-vision-stage="true"
        aria-label="Dioscorium clinical rail"
        style={{
          backgroundColor: railBg,
          color: railFg,
          padding: "0.95rem 0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          borderRight: `1px solid ${railMode === "apca" ? "rgba(255,255,255,0.14)" : borderCol}`,
          transition: "background-color 0.22s ease-out, color 0.22s ease-out",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 21s-7-4.5-9-9a5.5 5.5 0 0 1 9-6 5.5 5.5 0 0 1 9 6c-2 4.5-9 9-9 9Z" />
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.86rem", fontWeight: 600 }}>
              Dioscorium
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              padding: "0.1rem 0.42rem",
              borderRadius: "999px",
              background: railActiveBg,
              color: railActiveFg,
              fontWeight: 700,
            }}
          >
            Lc {inactiveEval.lc}
          </span>
        </div>

        <div
          role="group"
          aria-label="Dioscorium 10 clinical modules"
          className="dioscorium-nav-list"
        >
          {DIOSCORIUM_SURFACES.map((s) => {
            const on = s.id === surface.id;
            const mSpec = MODULE_SPECS[s.id];
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                onClick={() => setSelectedId(s.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "100%",
                  textAlign: "left",
                  border:
                    railMode === "quiet" && on
                      ? `1px solid ${borderCol}`
                      : "1px solid transparent",
                  borderLeft:
                    railMode === "quiet"
                      ? `3px solid ${on ? s.panelBg : "transparent"}`
                      : "1px solid transparent",
                  borderRadius: "7px",
                  padding: "0.36rem 0.55rem",
                  fontSize: "0.76rem",
                  fontWeight: on ? 700 : 500,
                  cursor: "pointer",
                  background: on ? railActiveBg : "transparent",
                  color: on ? railActiveFg : railFg,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flexShrink: 0 }}
                >
                  <path d={mSpec.iconPath} />
                </svg>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.name}
                </span>
              </button>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: "0.6rem",
            borderTop: `1px solid ${railMode === "apca" ? "rgba(255,255,255,0.18)" : borderCol}`,
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            lineHeight: 1.45,
          }}
        >
          <div>Hue {surface.hue}° · {activeEval.wcagGrade}</div>
          <div style={{ opacity: 0.9 }}>
            Panel {surface.panelBg} · Active Lc {activeEval.lc}
          </div>
        </div>
      </aside>

      {/* RIGHT CALM TELEMETRY-FIRST CLINICAL WORKSPACE */}
      <div
        style={{
          padding: "0.95rem 1.05rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem",
          minWidth: 0,
        }}
      >
        {/* Top Command Strip — replaces bloated SaaS marketing hero */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.6rem",
            flexWrap: "wrap",
            paddingBottom: "0.65rem",
            borderBottom: `1px solid ${borderCol}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.66rem",
                padding: "0.18rem 0.5rem",
                borderRadius: "6px",
                background: cardBg,
                border: `1px solid ${borderCol}`,
                color: inkPrimary,
                fontWeight: 600,
              }}
            >
              SYNTHETIC CASE #DC-408
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: inkMuted }}>
              62M · Outpatient Cardiology · No PHI
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
            <div role="group" aria-label="Clinical lighting mode" style={{ display: "inline-flex", gap: "0.2rem" }}>
              {(
                [
                  { id: "exam", label: "Exam Room" },
                  { id: "cath", label: "Cath Lab" },
                ] as const
              ).map((opt) => {
                const on = roomMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setRoomMode(opt.id)}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.66rem",
                      padding: "0.2rem 0.52rem",
                      borderRadius: "999px",
                      cursor: "pointer",
                      border: `1px solid ${on ? inkPrimary : borderCol}`,
                      background: on ? inkPrimary : cardBg,
                      color: on ? canvasBg : inkMuted,
                      fontWeight: on ? 600 : 500,
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div role="group" aria-label="Sidebar chromatic mode" style={{ display: "inline-flex", gap: "0.2rem" }}>
              {(
                [
                  { id: "apca", label: "APCA Rail" },
                  { id: "quiet", label: "Quiet Rail" },
                ] as const
              ).map((opt) => {
                const on = railMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setRailMode(opt.id)}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.66rem",
                      padding: "0.2rem 0.52rem",
                      borderRadius: "999px",
                      cursor: "pointer",
                      border: `1px solid ${on ? inkPrimary : borderCol}`,
                      background: on ? inkPrimary : cardBg,
                      color: on ? canvasBg : inkMuted,
                      fontWeight: on ? 600 : 500,
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Clinical Module Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
              <span
                aria-hidden="true"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: surface.panelBg,
                  display: "inline-block",
                }}
              />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: inkMuted }}>
                {spec.guideline}
              </span>
            </div>
            <h3 style={{ fontSize: "1.02rem", fontWeight: 600, color: inkPrimary, margin: 0 }}>
              {surface.name} — {spec.headline}
            </h3>
          </div>

          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.66rem",
              padding: "0.22rem 0.55rem",
              borderRadius: "6px",
              background: cardBg,
              border: `1px solid ${borderCol}`,
              color: inkPrimary,
            }}
          >
            Model confidence: <strong>{spec.confidence}</strong>
          </div>
        </div>

        {/* KPI Strip (zero rainbow card gradients — pure scannable typography + semantic status dot) */}
        <div className="dioscorium-kpi-grid">
          {spec.kpis.map((kpi) => {
            const badgeBg =
              kpi.status === "ok"
                ? isDark
                  ? "#122B1E"
                  : "#ECFDF3"
                : kpi.status === "warn"
                  ? isDark
                    ? "#33220D"
                    : "#FEF3C7"
                  : isDark
                    ? "#1E293B"
                    : "#F1F5F9";
            const badgeFg =
              kpi.status === "ok"
                ? isDark
                  ? "#86EFAC"
                  : "#166534"
                : kpi.status === "warn"
                  ? isDark
                    ? "#FDE68A"
                    : "#92400E"
                  : inkMuted;

            return (
              <div
                key={kpi.label}
                style={{
                  background: cardBg,
                  border: `1px solid ${borderCol}`,
                  borderRadius: "8px",
                  padding: "0.58rem 0.7rem",
                }}
              >
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: inkMuted, textTransform: "uppercase" }}>
                  {kpi.label}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.35rem", marginTop: "0.22rem" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 600, color: inkPrimary }}>
                    {kpi.value}
                  </span>
                  {kpi.delta && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6rem",
                        padding: "0.08rem 0.36rem",
                        borderRadius: "999px",
                        background: badgeBg,
                        color: badgeFg,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {kpi.delta}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Context-Aware Visual Telemetry or Explainable Evidence Trace */}
        {spec.visualKind === "ecg" && <EcgTraceSvg accent={traceAccent} dark={isDark} />}
        {spec.visualKind === "trend" && <TrendChartSvg accent={traceAccent} dark={isDark} />}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "0.55rem",
          }}
        >
          {spec.evidence.map((ev) => (
            <div
              key={ev.signal}
              style={{
                background: cardBg,
                border: `1px solid ${borderCol}`,
                borderRadius: "8px",
                padding: "0.58rem 0.72rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 600, color: inkPrimary }}>{ev.signal}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: inkMuted }}>{ev.weight}</span>
              </div>
              <p style={{ margin: 0, fontSize: "0.73rem", color: inkMuted, lineHeight: 1.42 }}>
                {ev.rule}
              </p>
            </div>
          ))}
        </div>

        {/* Human-in-the-Loop SaMD / IEC 62366-1 Clinician Sign-Off Strip */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderCol}`,
            borderLeft: `3px solid ${surface.panelBg}`,
            borderRadius: "8px",
            padding: "0.68rem 0.8rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 260px", minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: inkMuted, marginBottom: "0.16rem" }}>
              AI ADVISORY · HUMAN-IN-THE-LOOP (IEC 62366-1)
            </div>
            <p style={{ margin: 0, fontSize: "0.76rem", color: inkPrimary, lineHeight: 1.45 }}>
              {spec.advisory}
            </p>
          </div>
          <button
            type="button"
            aria-pressed={isAck}
            onClick={() =>
              setAcknowledged((prev) => ({ ...prev, [surface.id]: !prev[surface.id] }))
            }
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              fontWeight: 600,
              padding: "0.42rem 0.78rem",
              borderRadius: "999px",
              cursor: "pointer",
              border: `1px solid ${isAck ? (isDark ? "#86EFAC" : "#166534") : inkPrimary}`,
              background: isAck ? (isDark ? "#122B1E" : "#ECFDF3") : inkPrimary,
              color: isAck ? (isDark ? "#86EFAC" : "#166534") : canvasBg,
              whiteSpace: "nowrap",
            }}
          >
            {isAck ? "✓ Clinician Reviewed" : "Review & Acknowledge"}
          </button>
        </div>

        {/* Live APCA Architecture Footnote (preserves exact token traceability) */}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: inkMuted, lineHeight: 1.45 }}>
          {surface.name}: {surface.clinicalNote} (Panel {surface.panelBg}, Ink {surface.inactiveText}, Active{" "}
          {surface.activeText} on {surface.activePill} · Lc {inactiveEval.lc} / {activeEval.lc})
        </div>
      </div>
    </div>
  );
}
