"use client";

import React, { useEffect, useRef, useState } from "react";
import { DIOSCORIUM_SURFACES, evaluateContrast } from "@/lib/apca";
import type { ShippedProject } from "@/data/work";
import { useTheme } from "@/components/ThemeProvider";

export function ProjectPreview({
  kind,
  interactive = false,
}: {
  kind: ShippedProject["previewKind"];
  interactive?: boolean;
}) {
  switch (kind) {
    case "onewell-core":
      return <OneWellCorePreview interactive={interactive} />;
    case "c2s-pahm":
      return <C2sCommandPreview interactive={interactive} />;
    case "dioscorium":
      return <DioscoriumPreview interactive={interactive} />;
    case "luwian":
      return <LuwianSpherePreview interactive={interactive} />;
    case "onewell-mobile":
      return <OneWellMobilePreview />;
    case "ministry":
      return <MinistryThemePreview interactive={interactive} />;
  }
}

function OneWellCorePreview({ interactive }: { interactive: boolean }) {
  const { theme, contrastMetrics } = useTheme();
  const [activeTab, setActiveTab] = useState<"tokens" | "icons">("tokens");

  return (
    <div
      data-vision-stage="true"
      style={{
        background: "var(--paper-elevated)",
        border: "var(--guide-w) solid var(--guide)",
        borderRadius: "var(--radius-s)",
        padding: interactive ? "1.25rem" : "0.95rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
        <span className="spec" style={{ fontSize: "0.72rem" }}>
          core.tokens · {theme} · Lc {contrastMetrics.lc}
        </span>
        {interactive ? (
          <div style={{ display: "inline-flex", gap: "0.3rem" }}>
            <button
              type="button"
              className="seg-btn"
              aria-pressed={activeTab === "tokens"}
              onClick={() => setActiveTab("tokens")}
              style={{ padding: "0.2rem 0.6rem", fontSize: "0.72rem", border: "var(--guide-w) solid var(--guide)" }}
            >
              Tokens
            </button>
            <button
              type="button"
              className="seg-btn"
              aria-pressed={activeTab === "icons"}
              onClick={() => setActiveTab("icons")}
              style={{ padding: "0.2rem 0.6rem", fontSize: "0.72rem", border: "var(--guide-w) solid var(--guide)" }}
            >
              Monoline Icons
            </button>
          </div>
        ) : (
          <span className="tag" data-d="engineering">WCAG {contrastMetrics.wcagGrade}</span>
        )}
      </div>

      {activeTab === "tokens" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.45rem" }}>
          {[
            { name: "surface", bg: "var(--paper)", fg: "var(--ink)" },
            { name: "muted", bg: "var(--paper-2)", fg: "var(--ink)" },
            { name: "accent", bg: "var(--sage)", fg: "var(--sage-ink)" },
            { name: "signal", bg: "var(--sky)", fg: "var(--sky-ink)" },
          ].map((sw) => (
            <div
              key={sw.name}
              style={{
                background: sw.bg,
                color: sw.fg,
                border: "var(--guide-w) solid var(--guide)",
                borderRadius: "6px",
                padding: "0.55rem 0.5rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.66rem",
              }}
            >
              <div style={{ fontWeight: 600 }}>Aa</div>
              <div style={{ opacity: 0.85, marginTop: "0.15rem" }}>{sw.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", gap: "0.65rem", alignItems: "center", flexWrap: "wrap" }}>
          {[
            { label: "Schedule", d: "M4 7h16M7 3v4M17 3v4M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" },
            { label: "Care log", d: "M9 11l2 2 4-4M6 4h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" },
            { label: "Shield", d: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" },
            { label: "Pulse", d: "M3 12h4l2-5 4 10 2-5h6" },
          ].map((ic) => (
            <div
              key={ic.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                border: "var(--guide-w) solid var(--guide)",
                borderRadius: "8px",
                padding: "0.45rem 0.65rem",
                background: "var(--paper-2)",
                fontSize: "0.74rem",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={ic.d} />
              </svg>
              <span>{ic.label}</span>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          borderTop: "var(--guide-w) var(--guide-style) var(--guide)",
          paddingTop: "0.55rem",
          fontSize: "0.74rem",
          color: "var(--graphite)",
        }}
      >
        <span>12 US states · Brand → Tokens → React 19</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--ink)" }}>
          WCAG CI: PASS
        </span>
      </div>
    </div>
  );
}

function C2sCommandPreview({ interactive }: { interactive: boolean }) {
  const [zone, setZone] = useState<"now" | "today" | "qa">("now");

  const rows: Record<typeof zone, Array<{ task: string; domain: string; sla: string }>> = {
    now: [
      { task: "Annual Nursing Reassessment", domain: "Nursing", sla: "Due today" },
      { task: "24h Critical Incident Review", domain: "EIM", sla: "3h left" },
    ],
    today: [
      { task: "Quarterly Contact Verification", domain: "Service Coord", sla: "3rd Fri" },
      { task: "Candidate Credential Check", domain: "Onboarding", sla: "Pending" },
    ],
    qa: [
      { task: "NCQA Compliance Packet", domain: "QA Audit", sla: "Ready" },
      { task: "Shift Schedule Coverage", domain: "Scheduling", sla: "12 States" },
    ],
  };

  return (
    <div
      data-vision-stage="true"
      style={{
        background: "var(--paper-elevated)",
        border: "var(--guide-w) solid var(--guide)",
        borderRadius: "var(--radius-s)",
        padding: interactive ? "1.25rem" : "0.95rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.65rem",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <span className="spec" style={{ fontSize: "0.72rem" }}>
          C2S Command Center · 6 Suites
        </span>
        {interactive ? (
          <div style={{ display: "inline-flex", gap: "0.25rem" }}>
            {(["now", "today", "qa"] as const).map((z) => (
              <button
                key={z}
                type="button"
                className="seg-btn"
                aria-pressed={zone === z}
                onClick={() => setZone(z)}
                style={{ padding: "0.18rem 0.55rem", fontSize: "0.7rem", border: "var(--guide-w) solid var(--guide)", textTransform: "uppercase" }}
              >
                {z}
              </button>
            ))}
          </div>
        ) : (
          <span className="tag" data-d="research">Lighthouse Audited</span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {rows[zone].map((r) => (
          <div
            key={r.task}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.48rem 0.65rem",
              borderRadius: "6px",
              background: "var(--paper-2)",
              border: "var(--guide-w) solid var(--guide)",
              fontSize: "0.76rem",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: "var(--ink)" }}>{r.task}</div>
              <div style={{ fontSize: "0.68rem", color: "var(--graphite)" }}>{r.domain}</div>
            </div>
            <span className="spec" style={{ fontSize: "0.68rem", color: "var(--ink)" }}>
              {r.sla}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DioscoriumPreview({ interactive }: { interactive: boolean }) {
  const [selectedId, setSelectedId] = useState<string>(DIOSCORIUM_SURFACES[0].id);
  const surface =
    DIOSCORIUM_SURFACES.find((s) => s.id === selectedId) ?? DIOSCORIUM_SURFACES[0];
  const inactiveEval = evaluateContrast(surface.inactiveText, surface.panelBg);
  const activeEval = evaluateContrast(surface.activeText, surface.activePill);

  const visibleList = interactive ? DIOSCORIUM_SURFACES : DIOSCORIUM_SURFACES.slice(0, 5);

  return (
    <div
      data-vision-stage="true"
      style={{
        background: surface.panelBg,
        color: surface.inactiveText,
        borderRadius: "var(--radius-s)",
        padding: interactive ? "1.25rem" : "0.95rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.7rem",
        width: "100%",
        border: "1px solid rgba(255,255,255,0.16)",
        transition: "background-color 0.22s ease-out",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: surface.inactiveText }}>
          SaMD · IEC 62366-1 · Hue {surface.hue}°
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            background: surface.activePill,
            color: surface.activeText,
            padding: "0.14rem 0.5rem",
            borderRadius: "999px",
            fontWeight: 700,
          }}
        >
          Lc {inactiveEval.lc} / {activeEval.lc} · {activeEval.wcagGrade}
        </span>
      </div>

      {interactive ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }} role="group" aria-label="Dioscorium 10 clinical modules">
          {visibleList.map((s) => {
            const on = s.id === surface.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                onClick={() => setSelectedId(s.id)}
                style={{
                  border: on ? "1px solid transparent" : "1px solid rgba(255,255,255,0.28)",
                  borderRadius: "999px",
                  padding: "0.28rem 0.65rem",
                  fontSize: "0.76rem",
                  fontWeight: on ? 700 : 500,
                  cursor: "pointer",
                  background: on ? surface.activePill : "transparent",
                  color: on ? surface.activeText : surface.inactiveText,
                }}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {visibleList.map((s, i) => (
            <span
              key={s.id}
              style={{
                borderRadius: "999px",
                padding: "0.22rem 0.58rem",
                fontSize: "0.72rem",
                fontWeight: i === 0 ? 700 : 500,
                background: i === 0 ? surface.activePill : "rgba(0,0,0,0.16)",
                color: i === 0 ? surface.activeText : surface.inactiveText,
              }}
            >
              {s.name}
            </span>
          ))}
        </div>
      )}

      <div style={{ fontSize: "0.76rem", color: surface.inactiveText, lineHeight: 1.45 }}>
        {interactive
          ? `${surface.name}: ${surface.clinicalNote} (Panel ${surface.panelBg}, Ink ${surface.inactiveText}, Active ${surface.activeText} on ${surface.activePill})`
          : "10 luminance-pinned cardiology AI surfaces across iOS, Android & web."}
      </div>
    </div>
  );
}

function LuwianSpherePreview({ interactive }: { interactive: boolean }) {
  const { motion } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dotGreen, setDotGreen] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ROWS = 18;
    const COLS = 38;
    const LAT_MIN = -0.42;
    const LAT_MAX = 1.28;
    const VIEW_TILT = -1.72;
    const lons = Array.from({ length: COLS }, (_, j) => (2 * Math.PI * j) / COLS);

    const reduced =
      motion === "reduced" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let t = 0.8;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!reduced) t += dt;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const W = Math.max(120, Math.round(rect.width * dpr));
      const H = Math.max(120, Math.round(rect.height * dpr));
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
      }

      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.36;
      const [cr, cg, cb] = dotGreen ? [200, 255, 46] : [255, 255, 255];

      const pts: Array<{ x: number; y: number; z: number }> = [];
      for (let j = 0; j < COLS; j++) {
        const lon = lons[j];
        const rim =
          LAT_MIN +
          0.38 * Math.sin(lon + 0.6 + t * 0.18) +
          0.14 * Math.sin(2 * lon - 1.1 - t * 0.27);
        for (let i = 0; i < ROWS; i++) {
          const lat = rim + ((LAT_MAX - rim) * i) / (ROWS - 1);
          const base = Math.cos(lat) * 0.92 + 0.08;
          const wave =
            1 +
            0.055 * Math.sin(2 * lon + lat * 3.0 - t * 1.3) +
            0.03 * Math.sin(-3 * lon + lat * 1.5 + t * 0.9);
          const r = base * wave;
          const x = r * Math.sin(lon);
          const y = Math.sin(lat);
          const z = r * Math.cos(lon);
          const c = Math.cos(VIEW_TILT);
          const s = Math.sin(VIEW_TILT);
          pts.push({ x, y: y * c - z * s, z: y * s + z * c });
        }
      }

      pts.sort((a, b) => a.z - b.z);
      for (const p of pts) {
        const persp = 2.6 / (2.6 - p.z * 0.7);
        const sx = cx + p.x * R * persp;
        const sy = cy - p.y * R * persp;
        const depthAlpha = Math.max(0.18, Math.min(0.95, (p.z + 1.1) / 2.1));
        const rad = Math.max(1.0, (1.55 * persp * dpr) / 1.35);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${depthAlpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced) {
        raf = window.requestAnimationFrame(draw);
      }
    };

    raf = window.requestAnimationFrame(draw);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [dotGreen, motion]);

  return (
    <div
      style={{
        background: "#131313",
        color: "#F3F4F6",
        borderRadius: "var(--radius-s)",
        padding: interactive ? "1.1rem" : "0.85rem",
        display: "grid",
        gridTemplateColumns: interactive ? "minmax(0, 1fr) minmax(0, 1.15fr)" : "110px minmax(0, 1fr)",
        alignItems: "center",
        gap: "0.85rem",
        width: "100%",
        border: "1px solid rgba(255,255,255,0.14)",
      }}
    >
      <canvas
        ref={canvasRef}
        aria-label="Luwian procedural dotted sphere visualization"
        style={{
          width: "100%",
          height: interactive ? "180px" : "108px",
          display: "block",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.4rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#C8FF2E" }}>
            AI PREDICTION · STEP 2/4
          </span>
          {interactive && (
            <button
              type="button"
              onClick={() => setDotGreen((g) => !g)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.66rem",
                background: "rgba(255,255,255,0.08)",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.28)",
                borderRadius: "999px",
                padding: "0.18rem 0.55rem",
                cursor: "pointer",
              }}
            >
              {dotGreen ? "Luwian green" : "Monochrome"}
            </button>
          )}
        </div>
        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#FFFFFF" }}>
          Cash-flow volatility model
        </div>
        <div style={{ fontSize: "0.72rem", color: "#D1D5DB", lineHeight: 1.45 }}>
          Suggested: apply 90-day seasonal smoothing before threshold alerts.
        </div>
      </div>
    </div>
  );
}

function OneWellMobilePreview() {
  return (
    <div
      data-vision-stage="true"
      style={{
        background: "var(--paper-elevated)",
        border: "var(--guide-w) solid var(--guide)",
        borderRadius: "var(--radius-s)",
        padding: "0.95rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.85rem",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "104px",
          flexShrink: 0,
          borderRadius: "20px",
          border: "var(--guide-w) solid var(--guide)",
          background: "var(--paper-2)",
          padding: "0.55rem",
        }}
      >
        <div className="spec" style={{ fontSize: "0.6rem" }}>watchOS · 2 taps</div>
        <div style={{ fontSize: "0.72rem", fontWeight: 600, marginTop: "0.25rem", color: "var(--ink)" }}>
          Morning meds
        </div>
        <div
          style={{
            marginTop: "0.45rem",
            background: "var(--ink)",
            color: "var(--paper)",
            borderRadius: "6px",
            textAlign: "center",
            fontSize: "0.64rem",
            fontWeight: 600,
            padding: "0.22rem",
          }}
        >
          Log it
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1 }}>
        <span className="tag" data-d="design">Watch · Phone · Web</span>
        <div style={{ fontSize: "0.76rem", color: "var(--graphite)", lineHeight: 1.45 }}>
          One-handed shift documentation built for a 2-second glance window—try the live simulator below.
        </div>
      </div>
    </div>
  );
}

function MinistryThemePreview({ interactive }: { interactive: boolean }) {
  const palettes = [
    { name: "Uzlaşma", bg: "#1B4965", text: "#FFFFFF" },
    { name: "Reklam", bg: "#5A183B", text: "#FFFFFF" },
    { name: "E-Garanti", bg: "#1E5631", text: "#FFFFFF" },
    { name: "TÜBİS", bg: "#4A3B22", text: "#FFFFFF" },
    { name: "High Contrast", bg: "#000000", text: "#FFFFFF" },
    { name: "Colorblind Safe", bg: "#1D3557", text: "#FFFFFF" },
  ];
  const [idx, setIdx] = useState(0);
  const current = palettes[idx];

  return (
    <div
      data-vision-stage="true"
      style={{
        background: "var(--paper-elevated)",
        border: "var(--guide-w) solid var(--guide)",
        borderRadius: "var(--radius-s)",
        padding: interactive ? "1.25rem" : "0.95rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.65rem",
        width: "100%",
      }}
    >
      <div
        style={{
          background: current.bg,
          color: current.text,
          borderRadius: "6px",
          padding: "0.6rem 0.75rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.76rem",
          fontWeight: 600,
        }}
      >
        <span>Tüketici Portal · {current.name}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem" }}>SSO · 13 Services</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        {palettes.map((p, i) =>
          interactive ? (
            <button
              key={p.name}
              type="button"
              aria-pressed={i === idx}
              onClick={() => setIdx(i)}
              style={{
                border: i === idx ? "2px solid var(--ink)" : "var(--guide-w) solid var(--guide)",
                background: "var(--paper-2)",
                color: "var(--ink)",
                borderRadius: "999px",
                padding: "0.2rem 0.55rem",
                fontSize: "0.7rem",
                cursor: "pointer",
              }}
            >
              {p.name}
            </button>
          ) : (
            <span
              key={p.name}
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: p.bg,
                border: "1px solid var(--guide)",
                display: "inline-block",
              }}
              title={p.name}
            />
          )
        )}
      </div>
    </div>
  );
}
