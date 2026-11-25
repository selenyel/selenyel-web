"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "@/components/ThemeProvider";

type DeviceKind = "watch" | "phone" | "web";

const TASKS = [
  { id: "t1", name: "Morning medication", chip: "08:00" },
  { id: "t2", name: "Breakfast support", chip: "08:30" },
  { id: "t3", name: "Community outing", chip: "10:00" },
];

const DEVICE_META: Record<
  DeviceKind,
  { dim: string; shown: number; heading: string; density: string; width: string; height: string; radius: string }
> = {
  watch: {
    dim: "watch · 186×232",
    shown: 1,
    heading: "Next up",
    density:
      "One task, because a watch glance is about two seconds. The rest of the shift stays on the phone.",
    width: "190px",
    height: "234px",
    radius: "36px",
  },
  phone: {
    dim: "phone · 240×380",
    shown: 3,
    heading: "Today's shift",
    density: "The full shift fits, so the list stays flat with no grouping to learn.",
    width: "240px",
    height: "360px",
    radius: "26px",
  },
  web: {
    dim: "web · 420×290",
    shown: 3,
    heading: "Today's shift",
    density: "Same list, more room for the timestamps a supervisor reads later.",
    width: "min(100%, 420px)",
    height: "290px",
    radius: "12px",
  },
};

export function ShiftSimulator() {
  const { motion: motionPref } = useTheme();
  const [device, setDevice] = useState<DeviceKind>("watch");
  const [taps, setTaps] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [logged, setLogged] = useState(false);

  const meta = DEVICE_META[device];
  const reduced = motionPref === "reduced";

  const switchDevice = (next: DeviceKind) => {
    setDevice(next);
    setSelected(null);
    setLogged(false);
    setTaps(0);
  };

  const reset = () => {
    setSelected(null);
    setLogged(false);
    setTaps(0);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "clamp(1.75rem, 4vw, 4rem)",
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "380px",
            border: "var(--guide-w) var(--guide-style) var(--guide)",
            borderRadius: "var(--radius)",
            background:
              "linear-gradient(to right, var(--guide-soft) var(--guide-w), transparent var(--guide-w)) 0 0 / 32px 32px, linear-gradient(to bottom, var(--guide-soft) var(--guide-w), transparent var(--guide-w)) 0 0 / 32px 32px, var(--paper)",
            padding: "1.75rem",
          }}
        >
          <motion.div
            layout={!reduced}
            transition={{ duration: reduced ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: meta.width,
              height: meta.height,
              borderRadius: meta.radius,
              background: "var(--paper-elevated)",
              border: "var(--guide-w) solid var(--guide)",
              boxShadow: "var(--shadow-card)",
              padding: device === "watch" ? "14px 12px" : "16px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {logged ? (
              <div style={{ margin: "auto 0", textAlign: "center" }}>
                <strong style={{ display: "block", fontSize: "0.9rem", color: "var(--ink)" }}>
                  Logged
                </strong>
                <span style={{ fontSize: "0.74rem", color: "var(--graphite)" }}>
                  Back to the shift.
                </span>
              </div>
            ) : (
              <>
                <p style={{ fontSize: device === "web" ? "0.86rem" : "0.74rem", fontWeight: 600, margin: "0 0 2px", color: "var(--ink)" }}>
                  {meta.heading}
                </p>
                <p style={{ fontSize: device === "web" ? "0.72rem" : "0.64rem", color: "var(--graphite)", margin: "0 0 0.65rem" }}>
                  {selected ? "Confirm to log it." : "Pick what you just finished."}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {TASKS.slice(0, meta.shown).map((t) => {
                    const active = selected === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setSelected(t.id);
                          setTaps((n) => n + 1);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          font: "inherit",
                          cursor: "pointer",
                          background: active ? "var(--sage)" : "var(--paper-2)",
                          color: active ? "var(--sage-ink)" : "var(--ink)",
                          border: active ? "1.5px solid var(--sage-ink)" : "var(--guide-w) solid var(--guide)",
                          borderRadius: "var(--radius-s)",
                          padding: device === "web" ? "0.55rem 0.72rem" : "0.45rem 0.55rem",
                          fontSize: device === "web" ? "0.78rem" : "0.68rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>{t.name}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem" }}>{t.chip}</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  disabled={!selected}
                  onClick={() => {
                    setLogged(true);
                    setTaps((n) => n + 1);
                  }}
                  style={{
                    marginTop: "auto",
                    width: "100%",
                    font: "inherit",
                    fontWeight: 600,
                    cursor: selected ? "pointer" : "not-allowed",
                    background: "var(--ink)",
                    color: "var(--paper)",
                    border: 0,
                    borderRadius: "var(--radius-s)",
                    padding: "0.55rem",
                    fontSize: "0.74rem",
                    opacity: selected ? 1 : 0.4,
                  }}
                >
                  Log it
                </button>
              </>
            )}
          </motion.div>

          <span
            className="spec"
            style={{ position: "absolute", bottom: "10px", right: "14px", fontSize: "0.68rem" }}
          >
            {meta.dim}
          </span>
        </div>

        <p style={{ margin: "0.85rem 0 0", color: "var(--graphite)", fontSize: "var(--step--1)", maxWidth: "48ch" }}>
          {meta.density}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.35rem", alignItems: "flex-start" }}>
        <div className="seg" role="group" aria-label="Device size">
          {(["watch", "phone", "web"] as const).map((d) => (
            <button
              key={d}
              type="button"
              className="seg-btn"
              aria-pressed={device === d}
              onClick={() => switchDevice(d)}
              style={{ textTransform: "capitalize" }}
            >
              {d}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.7rem",
            borderBottom: "var(--guide-w) var(--guide-style) var(--guide)",
            paddingBottom: "0.9rem",
            width: "100%",
          }}
        >
          <strong style={{ fontFamily: "var(--font-display)", fontSize: "var(--step-3)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
            {taps}
          </strong>
          <span style={{ color: "var(--graphite)", fontSize: "var(--step--1)" }}>
            {taps === 1 ? "tap so far" : "taps so far"}
          </span>
        </div>

        <p style={{ margin: 0, color: "var(--graphite)", maxWidth: "52ch" }}>
          {logged
            ? taps <= 2
              ? "Two taps. That is the version that actually gets used mid-shift, and it is why the confirm step stays on the same screen instead of pushing people to a second one."
              : `${taps} taps. Every extra tap here is attention taken from the person being supported. That is the number I design against.`
            : "Pick a task, confirm it, and the shift log updates. Two taps is the target on the watch. Past that, people abandon the watch and pull out their phone instead."}
        </p>

        <button type="button" className="pill-btn" onClick={reset}>
          Reset the flow
        </button>
      </div>
    </div>
  );
}
