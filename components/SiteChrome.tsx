"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { InspectTag } from "./InspectTag";

export function TopUtilityBar() {
  const { setCmdOpen } = useTheme();

  return (
    <div className="top-bar">
      <Link
        href="/"
        className="spec"
        style={{
          textDecoration: "none",
          color: "var(--ink)",
          fontWeight: 500,
        }}
      >
        selenyel.com
      </Link>

      <button
        type="button"
        className="pill-btn"
        onClick={() => setCmdOpen(true)}
        style={{ padding: "0.34rem 0.78rem", fontFamily: "var(--font-mono)", fontSize: "0.74rem" }}
      >
        <span>Quick jump</span>
        <kbd
          aria-hidden="true"
          style={{
            fontFamily: "inherit",
            fontSize: "0.7rem",
            padding: "0.08rem 0.36rem",
            borderRadius: "5px",
            border: "var(--guide-w) solid var(--guide)",
            background: "var(--paper-2)",
          }}
        >
          ⌘K
        </kbd>
      </button>
    </div>
  );
}

export function HeroPortrait() {
  const { portraitSrc } = useTheme();
  return (
    <img
      className="hero-portrait"
      src={portraitSrc}
      alt="Portrait of Selen Yel Temellioğlu"
      width={720}
      height={720}
      decoding="async"
    />
  );
}

export function HeroAppearanceBar() {
  const { theme, setTheme, inspect, setInspect } = useTheme();

  return (
    <div className="hero-appearance">
      <span className="spec" id="appearance-label">
        Appearance
      </span>
      <div className="seg" role="group" aria-labelledby="appearance-label">
        {(
          [
            { id: "light", label: "Light" },
            { id: "dark", label: "Dark" },
            { id: "contrast", label: "High contrast" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="seg-btn"
            aria-pressed={theme === opt.id}
            onClick={() => setTheme(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="pill-btn"
        aria-pressed={inspect}
        onClick={() => setInspect(!inspect)}
        style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", padding: "0.42rem 0.85rem" }}
      >
        <span>Inspect</span>
        <span style={{ opacity: 0.75 }}>{inspect ? "ON" : "OFF"}</span>
      </button>

      <InspectTag token="--paper / --ink" showLiveApca />

      <a href="#work" className="hero-scroll-cue">
        <span>Shipped work</span>
        <span aria-hidden="true">↓</span>
      </a>
    </div>
  );
}

export function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText("hello@selenyel.com").catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      className="pill-btn"
      onClick={handleCopy}
      aria-live="polite"
    >
      <span>{copied ? "Copied hello@selenyel.com" : "Copy hello@selenyel.com"}</span>
    </button>
  );
}
