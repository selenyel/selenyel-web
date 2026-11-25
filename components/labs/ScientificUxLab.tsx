"use client";

import React, { useMemo, useState } from "react";
import { KPI_PRESETS, computeUxHealth, type UxKpiInputs } from "@/lib/kpi";
import { useTheme } from "@/components/ThemeProvider";

type ScienceTab = "adaptive" | "lighthouse" | "twins" | "kpi";

const LIGHTHOUSE_COMPARISON = [
  { metric: "Performance Score", legacy: 48, renewed: 96, unit: "/100", better: "higher" },
  { metric: "Largest Contentful Paint (LCP)", legacy: 4.1, renewed: 1.2, unit: "s", better: "lower" },
  { metric: "Interaction to Next Paint (INP)", legacy: 380, renewed: 85, unit: "ms", better: "lower" },
  { metric: "Accessibility (WCAG Audit)", legacy: 74, renewed: 100, unit: "/100", better: "higher" },
];

const TWIN_VS_REAL = [
  {
    signal: "Form completion clarity",
    synthetic: "Predicted smooth 3-step submission; praised clean visual hierarchy.",
    real: "Mid-shift DSPs hesitated on read-only rows thinking they were broken disabled inputs.",
    decision: "Redesigned read-only rows with dashed hairline & attribution text rather than greyed fills.",
  },
  {
    signal: "Login failure recovery",
    synthetic: "Treated generic error toast as acceptable fallback.",
    real: "Real staff retried the same expired credential 4+ times, locking accounts mid-shift.",
    decision: "Defined an explicit frontend/backend error contract naming cause + immediate next step.",
  },
  {
    signal: "WatchOS task logging",
    synthetic: "Accepted a 3-screen confirm dialog as 'safer'.",
    real: "Past 2 taps, real staff abandoned the watch and pulled out their phone.",
    decision: "Kept selection + confirm on one screen to enforce a strict 2-tap ceiling.",
  },
];

export function ScientificUxLab() {
  const {
    theme,
    density,
    textScale,
    motion,
    vision,
    contrastMetrics,
    setTheme,
    setDensity,
    setTextScale,
    setMotion,
    setVision,
    resetAdaptive,
  } = useTheme();

  const [tab, setTab] = useState<ScienceTab>("adaptive");
  const [kpi, setKpi] = useState<UxKpiInputs>(KPI_PRESETS.renewed.inputs);

  const uxHealth = useMemo(() => computeUxHealth(kpi), [kpi]);

  return (
    <div
      style={{
        border: "var(--guide-w) solid var(--guide)",
        borderRadius: "var(--radius)",
        background: "var(--paper-elevated)",
        padding: "clamp(1.2rem, 3vw, 2rem)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="seg" role="tablist" aria-label="Scientific UX methodology modules" style={{ marginBottom: "1.5rem" }}>
        {(
          [
            { id: "adaptive", label: "01 · Adaptive UI" },
            { id: "lighthouse", label: "02 · Lighthouse & Latency" },
            { id: "twins", label: "03 · Real vs. Digital Twins" },
            { id: "kpi", label: "04 · UX KPI Model" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className="seg-btn"
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 01 · Live Adaptive UI Controls */}
      {tab === "adaptive" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p style={{ margin: 0, color: "var(--graphite)", fontSize: "0.9rem" }}>
              Rather than shipping one rigid layout, these controls mutate this page&apos;s live semantic tokens in real time—contrast, density, typography scale, motion, and color-vision preview.
            </p>

            <div>
              <div className="spec" style={{ marginBottom: "0.4rem" }}>Theme & Contrast</div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {(["light", "dark", "contrast"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    className="pill-btn"
                    aria-pressed={theme === m}
                    onClick={() => setTheme(m)}
                    style={{ textTransform: "capitalize" }}
                  >
                    {m === "contrast" ? "High contrast" : m}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.85rem" }}>
              <div>
                <div className="spec" style={{ marginBottom: "0.35rem" }}>Density</div>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  {(["comfortable", "compact"] as const).map((d) => (
                    <button key={d} type="button" className="pill-btn" aria-pressed={density === d} onClick={() => setDensity(d)} style={{ textTransform: "capitalize", padding: "0.32rem 0.72rem" }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="spec" style={{ marginBottom: "0.35rem" }}>Typography Scale</div>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  {(["default", "large"] as const).map((s) => (
                    <button key={s} type="button" className="pill-btn" aria-pressed={textScale === s} onClick={() => setTextScale(s)} style={{ textTransform: "capitalize", padding: "0.32rem 0.72rem" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="spec" style={{ marginBottom: "0.35rem" }}>Motion</div>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  {(["full", "reduced"] as const).map((m) => (
                    <button key={m} type="button" className="pill-btn" aria-pressed={motion === m} onClick={() => setMotion(m)} style={{ textTransform: "capitalize", padding: "0.32rem 0.72rem" }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="spec" style={{ marginBottom: "0.35rem" }}>Color-Vision Preview (Applied to UI Previews)</div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {(
                  [
                    { id: "default", label: "Standard" },
                    { id: "deuteranopia", label: "Deuteranopia" },
                    { id: "achromatopsia", label: "Monochrome" },
                  ] as const
                ).map((v) => (
                  <button key={v.id} type="button" className="pill-btn" aria-pressed={vision === v.id} onClick={() => setVision(v.id)} style={{ padding: "0.32rem 0.72rem" }}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button type="button" className="pill-btn" onClick={resetAdaptive}>
                Reset all preferences
              </button>
            </div>
          </div>

          <div
            data-vision-stage="true"
            style={{
              background: "var(--paper-2)",
              border: "var(--guide-w) solid var(--guide)",
              borderRadius: "var(--radius-s)",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div className="spec">LIVE COMPUTED CONTRAST TELEMETRY</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 500 }}>
                Lc {contrastMetrics.lc}
              </span>
              <span className="tag" data-d="engineering">
                WCAG {contrastMetrics.wcag}:1 ({contrastMetrics.wcagGrade})
              </span>
            </div>
            <div style={{ fontSize: "0.84rem", color: "var(--graphite)" }}>
              Active profile: <strong>{theme}</strong> theme · <strong>{density}</strong> density · <strong>{textScale}</strong> type · <strong>{motion}</strong> motion · <strong>{vision}</strong> vision simulation.
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--graphite)", borderTop: "var(--guide-w) var(--guide-style) var(--guide)", paddingTop: "0.65rem" }}>
              Suitability: <strong>{contrastMetrics.apcaUse}</strong>. Contrast rules execute at token level so every card, badge, and input inherits legibility automatically.
            </div>
          </div>
        </div>
      )}

      {/* 02 · Lighthouse & Latency Audit Breakdown */}
      {tab === "lighthouse" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <p style={{ margin: 0, color: "var(--graphite)", fontSize: "0.9rem", maxWidth: "66ch" }}>
            Before redesigning C2S / PAHM across 12 US states, we benchmarked legacy pages through Lighthouse and interaction-latency traces so layout and component architecture solved real bottlenecks instead of guessing. *(Illustrative audit benchmark structure; real clinical telemetry stays internal.)*
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "0.85rem" }}>
            {LIGHTHOUSE_COMPARISON.map((row) => (
              <div
                key={row.metric}
                style={{
                  background: "var(--paper-2)",
                  border: "var(--guide-w) solid var(--guide)",
                  borderRadius: "var(--radius-s)",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div className="spec" style={{ fontSize: "0.72rem" }}>{row.metric}</div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.84rem", color: "var(--graphite)", textDecoration: "line-through" }}>
                    Legacy: {row.legacy}{row.unit}
                  </span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 600, color: "var(--ok)" }}>
                    {row.renewed}{row.unit}
                  </span>
                </div>
                <div style={{ height: "6px", borderRadius: "999px", background: "var(--guide)", overflow: "hidden" }}>
                  <div
                    style={{
                      width: row.better === "higher" ? `${row.renewed}%` : "84%",
                      height: "100%",
                      background: "var(--ink)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 03 · Real Users vs Digital Twins */}
      {tab === "twins" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={{ margin: 0, color: "var(--graphite)", fontSize: "0.9rem", maxWidth: "68ch" }}>
            Running synthetic AI personas (&quot;digital twins&quot;) alongside real participant interviews using UMUX-Lite and Product Reaction Cards speeds up early sanity checks—and exposes the exact real-world blind spots synthetic users miss:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {TWIN_VS_REAL.map((item) => (
              <div
                key={item.signal}
                style={{
                  border: "var(--guide-w) solid var(--guide)",
                  borderRadius: "var(--radius-s)",
                  background: "var(--paper-2)",
                  padding: "0.95rem 1.05rem",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: "0.85rem",
                }}
              >
                <div>
                  <div className="spec" style={{ fontSize: "0.68rem" }}>STUDY SIGNAL</div>
                  <div style={{ fontWeight: 600, marginTop: "0.2rem", fontSize: "0.9rem" }}>{item.signal}</div>
                </div>
                <div>
                  <div className="spec" style={{ fontSize: "0.68rem" }}>DIGITAL TWIN (SYNTHETIC)</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--graphite)", marginTop: "0.2rem" }}>{item.synthetic}</div>
                </div>
                <div>
                  <div className="spec" style={{ fontSize: "0.68rem" }}>REAL PARTICIPANT INTERVIEW</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--ink)", marginTop: "0.2rem" }}>{item.real}</div>
                </div>
                <div>
                  <div className="spec" style={{ fontSize: "0.68rem", color: "var(--ok)" }}>DESIGN CHANGE SHIPPED</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--ink)", marginTop: "0.2rem" }}>{item.decision}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 04 · Interactive UX KPI & Satisfaction Score Model */}
      {tab === "kpi" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {Object.entries(KPI_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  className="pill-btn"
                  onClick={() => setKpi(preset.inputs)}
                  style={{ padding: "0.3rem 0.72rem", fontSize: "0.76rem" }}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem", fontSize: "0.84rem" }}>
              <span style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Response Latency (25%)</span>
                <strong className="spec">{kpi.taskLatencyMs} ms</strong>
              </span>
              <input
                type="range"
                min={100}
                max={4000}
                step={50}
                value={kpi.taskLatencyMs}
                onChange={(e) => setKpi((p) => ({ ...p, taskLatencyMs: Number(e.target.value) }))}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem", fontSize: "0.84rem" }}>
              <span style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Core Task Tap Budget (25%)</span>
                <strong className="spec">{kpi.tapCount} taps</strong>
              </span>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={kpi.tapCount}
                onChange={(e) => setKpi((p) => ({ ...p, tapCount: Number(e.target.value) }))}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem", fontSize: "0.84rem" }}>
              <span style={{ display: "flex", justifyContent: "space-between" }}>
                <span>First-Try Error Recovery (20%)</span>
                <strong className="spec">{kpi.errorRecoveryRate}%</strong>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={2}
                value={kpi.errorRecoveryRate}
                onChange={(e) => setKpi((p) => ({ ...p, errorRecoveryRate: Number(e.target.value) }))}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem", fontSize: "0.84rem" }}>
              <span style={{ display: "flex", justifyContent: "space-between" }}>
                <span>UMUX-Lite Satisfaction (30%)</span>
                <strong className="spec">{kpi.umuxLiteScore}/100</strong>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={kpi.umuxLiteScore}
                onChange={(e) => setKpi((p) => ({ ...p, umuxLiteScore: Number(e.target.value) }))}
              />
            </label>
          </div>

          <div
            style={{
              background: "var(--paper-2)",
              border: "var(--guide-w) solid var(--guide)",
              borderRadius: "var(--radius-s)",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
            }}
          >
            <div className="spec">COMPOSITE UX HEALTH INDEX</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.85rem" }}>
              <span
                data-testid="ux-health-score"
                style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 500, lineHeight: 1 }}
              >
                {uxHealth.score}
              </span>
              <span className="tag" data-d={uxHealth.score >= 70 ? "engineering" : "design"}>
                {uxHealth.grade}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {uxHealth.factors.map((f) => (
                <div key={f.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                  <span style={{ color: "var(--graphite)" }}>{f.label}</span>
                  <span className="spec" style={{ color: "var(--ink)" }}>
                    {f.normalizedScore}/100 (+{f.weightedPoints})
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: "var(--guide-w) var(--guide-style) var(--guide)",
                paddingTop: "0.65rem",
                fontSize: "0.8rem",
                color: "var(--graphite)",
              }}
            >
              Highest-leverage bottleneck: <strong>{uxHealth.weakestFactor.label}</strong> ({uxHealth.weakestFactor.normalizedScore}/100).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
