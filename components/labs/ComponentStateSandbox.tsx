"use client";

import React, { useState } from "react";

type FieldState = "default" | "focus" | "required" | "readonly" | "error";

const SPECS: Record<
  FieldState,
  { border: string; a11y: string; msg: string; req: boolean; val: string }
> = {
  default: {
    border: "1px solid guide",
    a11y: "textbox",
    msg: "",
    req: false,
    val: "08:15 · morning dose",
  },
  focus: {
    border: "1px + 3px focus ring",
    a11y: "textbox, focused",
    msg: "",
    req: false,
    val: "08:15 · morning dose",
  },
  required: {
    border: "1px solid guide",
    a11y: "textbox, required",
    msg: "Needed before the shift can be closed.",
    req: true,
    val: "08:15 · morning dose",
  },
  readonly: {
    border: "1px dashed guide",
    a11y: "text, read only",
    msg: "Recorded earlier by another team member.",
    req: false,
    val: "08:15 · morning dose",
  },
  error: {
    border: "1.5px solid danger",
    a11y: "textbox, invalid, describedby",
    msg: "Time is after the shift ended. Check it.",
    req: false,
    val: "19:40 · morning dose",
  },
};

export function ComponentStateSandbox() {
  const [state, setState] = useState<FieldState>("default");
  const spec = SPECS[state];

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "380px",
    borderRadius: "var(--radius-s)",
    padding: "0.9rem 1rem",
    background:
      state === "readonly"
        ? "var(--paper-2)"
        : state === "error"
          ? "var(--danger-bg)"
          : "var(--paper-elevated)",
    border:
      state === "focus"
        ? "1.5px solid var(--focus)"
        : state === "error"
          ? "1.5px solid var(--danger)"
          : state === "readonly"
            ? "var(--guide-w) dashed var(--guide)"
            : "var(--guide-w) solid var(--guide)",
    boxShadow:
      state === "focus"
        ? "0 0 0 3px color-mix(in srgb, var(--focus) 25%, transparent)"
        : "none",
    transition: "border-color 0.18s ease-out, box-shadow 0.18s ease-out, background-color 0.18s ease-out",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
        gap: "clamp(1.75rem, 4vw, 4rem)",
        alignItems: "start",
      }}
    >
      <div>
        <p className="lede" style={{ marginBottom: "1.4rem", fontSize: "var(--step-0)" }}>
          Most of a designer&apos;s work sits in the states nobody asks for. Switch between them and see how contrast, borders, and screen-reader roles stay explicit.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "1.25rem" }} role="group" aria-label="Component state">
          {(["default", "focus", "required", "readonly", "error"] as const).map((s) => (
            <button
              key={s}
              type="button"
              className="pill-btn"
              aria-pressed={state === s}
              onClick={() => setState(s)}
              style={{ textTransform: "capitalize", padding: "0.35rem 0.8rem" }}
            >
              {s === "readonly" ? "Read-only" : s}
            </button>
          ))}
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["state", state],
              ["border", spec.border],
              ["announced as", spec.a11y],
            ].map(([k, v]) => (
              <tr key={k}>
                <th
                  scope="row"
                  style={{
                    textAlign: "left",
                    padding: "0.48rem 0.2rem",
                    borderBottom: "var(--guide-w) var(--guide-style) var(--guide)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.74rem",
                    fontWeight: 400,
                    color: "var(--graphite-2)",
                    width: "40%",
                  }}
                >
                  {k}
                </th>
                <td
                  style={{
                    padding: "0.48rem 0.2rem",
                    borderBottom: "var(--guide-w) var(--guide-style) var(--guide)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.74rem",
                    color: "var(--ink)",
                  }}
                >
                  {v}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "235px",
          padding: "clamp(1.25rem, 3vw, 2.25rem)",
          border: "var(--guide-w) var(--guide-style) var(--guide)",
          borderRadius: "var(--radius)",
          background:
            "linear-gradient(to right, var(--guide-soft) var(--guide-w), transparent var(--guide-w)) 0 0 / 32px 32px, linear-gradient(to bottom, var(--guide-soft) var(--guide-w), transparent var(--guide-w)) 0 0 / 32px 32px, var(--paper)",
        }}
      >
        <div style={fieldStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "var(--step--1)", color: "var(--graphite)", marginBottom: "0.3rem" }}>
            <span>Medication administered</span>
            {spec.req && (
              <span style={{ color: "var(--sand-ink)", fontWeight: 700 }} aria-hidden="true">
                *
              </span>
            )}
          </div>
          <div style={{ fontSize: "var(--step-0)", color: state === "readonly" ? "var(--graphite)" : "var(--ink)", fontWeight: 500 }}>
            {spec.val}
          </div>
          <div
            role="status"
            aria-live="polite"
            style={{
              fontSize: "0.78rem",
              marginTop: "0.35rem",
              minHeight: "1.25em",
              color: state === "error" ? "var(--danger)" : "var(--graphite)",
            }}
          >
            {spec.msg}
          </div>
        </div>
      </div>
    </div>
  );
}
