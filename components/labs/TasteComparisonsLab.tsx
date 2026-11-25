"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { apcaLc, blendOverOpaque } from "@/lib/apca";
import { useTheme } from "@/components/ThemeProvider";

type TasteTab = "motion" | "contrast" | "surface" | "agent-rules";

export function TasteComparisonsLab() {
  const { motion: motionPref } = useTheme();
  const [tab, setTab] = useState<TasteTab>("motion");
  const [replayKey, setReplayKey] = useState(0);

  const panelBg = "#9B1611";
  const naiveTintHex = blendOverOpaque("#FFFFFF", 0.55, panelBg);
  const naiveLc = apcaLc(naiveTintHex, panelBg);
  const pinnedLc = apcaLc("#F1ECEC", panelBg);

  const reduced = motionPref === "reduced";

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "1.25rem",
        }}
      >
        <div className="seg" role="group" aria-label="Taste comparison rule">
          {(
            [
              { id: "motion", label: "Scale & Easing" },
              { id: "contrast", label: "Luminance vs. Opacity" },
              { id: "surface", label: "Surface Depth" },
              { id: "agent-rules", label: "AI-Agent Rule Spec" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              className="seg-btn"
              aria-pressed={tab === item.id}
              onClick={() => {
                setTab(item.id);
                setReplayKey((k) => k + 1);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "motion" && (
          <button
            type="button"
            className="pill-btn"
            onClick={() => setReplayKey((k) => k + 1)}
          >
            Replay transition
          </button>
        )}
      </div>

      {tab === "motion" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
          <div
            style={{
              border: "var(--guide-w) var(--guide-style) var(--guide)",
              borderRadius: "var(--radius-s)",
              padding: "1.25rem",
              background: "var(--paper-2)",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="spec">Default AI output</span>
              <span className="spec" style={{ color: "var(--danger)" }}>scale(0) · ease-in · 420ms</span>
            </div>
            <div style={{ minHeight: "104px", display: "grid", placeItems: "center" }}>
              <motion.div
                key={`bad-${replayKey}`}
                initial={reduced ? false : { opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduced ? 0 : 0.42, ease: [0.42, 0, 1, 1] }}
                style={{
                  background: "var(--paper-elevated)",
                  border: "var(--guide-w) solid var(--guide)",
                  borderRadius: "var(--radius-s)",
                  padding: "0.8rem 1rem",
                  width: "100%",
                  maxWidth: "250px",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "0.86rem" }}>Confirm dose logged</div>
                <div style={{ fontSize: "0.74rem", color: "var(--graphite)", marginTop: "0.2rem" }}>
                  Pops out of a microscopic point and accelerates harshly at the end.
                </div>
              </motion.div>
            </div>
          </div>

          <div
            style={{
              border: "var(--guide-w) solid var(--ink)",
              borderRadius: "var(--radius-s)",
              padding: "1.25rem",
              background: "var(--paper)",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="spec" style={{ color: "var(--ink)", fontWeight: 600 }}>Crafted system rule</span>
              <span className="spec" style={{ color: "var(--ok)" }}>scale(0.95) · ease-out · 180ms</span>
            </div>
            <div style={{ minHeight: "104px", display: "grid", placeItems: "center" }}>
              <motion.div
                key={`good-${replayKey}`}
                initial={reduced ? false : { opacity: 0, scale: 0.95, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: "var(--paper-elevated)",
                  border: "var(--guide-w) solid var(--guide)",
                  borderRadius: "var(--radius-s)",
                  padding: "0.8rem 1rem",
                  width: "100%",
                  maxWidth: "250px",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "0.86rem" }}>Confirm dose logged</div>
                <div style={{ fontSize: "0.74rem", color: "var(--graphite)", marginTop: "0.2rem" }}>
                  Retains silhouette from 0.95 and decelerates cleanly to rest.
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {tab === "contrast" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
          <div
            style={{
              background: panelBg,
              borderRadius: "var(--radius-s)",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.55rem",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#FFFFFF" }}>
              Naive alpha tint · rgba(255,255,255,0.55)
            </span>
            <div style={{ fontSize: "1.05rem", fontWeight: 600, color: naiveTintHex }}>
              Cardiology Dashboard Navigation
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.76rem", color: "#FFFFFF" }}>
              Computed APCA: Lc {naiveLc} (Fails body text floor of Lc 75)
            </div>
          </div>

          <div
            style={{
              background: panelBg,
              borderRadius: "var(--radius-s)",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.55rem",
              border: "2px solid #F1ECEC",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#F1ECEC" }}>
              Luminance-pinned ink · #F1ECEC (Y ~ 0.84)
            </span>
            <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "#F1ECEC" }}>
              Cardiology Dashboard Navigation
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.76rem", color: "#F1ECEC" }}>
              Computed APCA: Lc {pinnedLc} (Holds subtle hue lean & passes AA/AAA)
            </div>
          </div>
        </div>
      )}

      {tab === "surface" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
          <div style={{ background: "var(--paper-2)", borderRadius: "var(--radius-s)", padding: "1.25rem" }}>
            <div className="spec" style={{ marginBottom: "0.75rem" }}>Default: Heavy flat 2px border</div>
            <div
              style={{
                background: "var(--paper-elevated)",
                border: "2px solid var(--graphite)",
                borderRadius: "8px",
                padding: "0.9rem",
                fontSize: "0.84rem",
              }}
            >
              Harsh strokes compete visually with labels and dense clinical data tables.
            </div>
          </div>

          <div style={{ background: "var(--paper-2)", borderRadius: "var(--radius-s)", padding: "1.25rem" }}>
            <div className="spec" style={{ marginBottom: "0.75rem", color: "var(--ink)", fontWeight: 600 }}>
              Crafted: Hairline ring + ambient shadow
            </div>
            <div
              style={{
                background: "var(--paper-elevated)",
                border: "var(--guide-w) solid var(--guide)",
                borderRadius: "var(--radius-s)",
                padding: "0.9rem",
                fontSize: "0.84rem",
                boxShadow: "var(--shadow-card)",
              }}
            >
              Soft optical separation keeps focus on content while High Contrast mode promotes borders to 2px solid automatically.
            </div>
          </div>
        </div>
      )}

      {tab === "agent-rules" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={{ margin: 0, color: "var(--graphite)", fontSize: "0.9rem", maxWidth: "66ch" }}>
            UI taste isn&apos;t magic—it&apos;s explicit decisions written down so engineers and coding agents reproduce the right behavior automatically. This mirrors the DESIGN.md and agent skill guardrails I author for OneWell Core:
          </p>
          <pre
            style={{
              margin: 0,
              padding: "1rem 1.15rem",
              borderRadius: "var(--radius-s)",
              background: "var(--paper-2)",
              border: "var(--guide-w) solid var(--guide)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.76rem",
              lineHeight: 1.58,
              overflowX: "auto",
              color: "var(--ink)",
            }}
          >
{`# DESIGN.md — Motion, Contrast & Component Guardrails
1. Entering surfaces start at scale(0.95) + opacity(0), NEVER scale(0).
2. Use ease-out (150-200ms) for entering/exiting UI; respect prefers-reduced-motion.
3. Never simulate tinted glass with alpha white over dark panels; pin Y luminance
   and verify APCA Lc >= 75 in CI before merging token changes.
4. Read-only fields remain distinct from disabled controls and announce cleanly to AT.`}
          </pre>
        </div>
      )}
    </div>
  );
}
