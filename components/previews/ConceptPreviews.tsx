"use client";

import React, { useState } from "react";

export function FieldPosMiniPreview() {
  const ITEMS = [
    { id: "esp", label: "Espresso", price: 4.5 },
    { id: "oat", label: "Oat Latte", price: 5.5 },
    { id: "mat", label: "Matcha", price: 6.0 },
    { id: "cro", label: "Croissant", price: 4.0 },
  ];

  const [counts, setCounts] = useState<Record<string, number>>({ oat: 1 });
  const [confirmVoid, setConfirmVoid] = useState(false);

  const addItem = (id: string) => {
    setConfirmVoid(false);
    setCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  const total = ITEMS.reduce((sum, item) => sum + (counts[item.id] ?? 0) * item.price, 0);
  const itemCount = Object.values(counts).reduce((a, b) => a + b, 0);

  const handleVoid = () => {
    if (!confirmVoid) {
      setConfirmVoid(true);
      return;
    }
    setCounts({});
    setConfirmVoid(false);
  };

  return (
    <div
      style={{
        background: "var(--paper-elevated)",
        border: "var(--guide-w) solid var(--guide)",
        borderRadius: "var(--radius-s)",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="spec" style={{ fontSize: "0.72rem" }}>
          56px+ Ergonomic Targets · Try tapping
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.84rem", fontWeight: 700, color: "var(--ink)" }}>
          {itemCount} items · ${total.toFixed(2)}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.5rem" }}>
        {ITEMS.map((item) => {
          const qty = counts[item.id] ?? 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => addItem(item.id)}
              style={{
                minHeight: "58px",
                padding: "0.65rem 0.75rem",
                borderRadius: "var(--radius-s)",
                border: qty > 0 ? "2px solid var(--ink)" : "var(--guide-w) solid var(--guide)",
                background: qty > 0 ? "var(--sage)" : "var(--paper-2)",
                color: qty > 0 ? "var(--sage-ink)" : "var(--ink)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                font: "inherit",
                fontWeight: 600,
                fontSize: "0.84rem",
                textAlign: "left",
              }}
            >
              <span>{item.label}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.76rem" }}>
                {qty > 0 ? `×${qty}` : `$${item.price.toFixed(2)}`}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="button"
          onClick={handleVoid}
          disabled={itemCount === 0}
          style={{
            minHeight: "44px",
            padding: "0.5rem 0.85rem",
            borderRadius: "var(--radius-s)",
            border: "var(--guide-w) solid var(--danger)",
            background: confirmVoid ? "var(--danger)" : "transparent",
            color: confirmVoid ? "#FFFFFF" : "var(--danger)",
            font: "inherit",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: itemCount === 0 ? "not-allowed" : "pointer",
            opacity: itemCount === 0 ? 0.45 : 1,
          }}
        >
          {confirmVoid ? "Tap again to void" : "Void order"}
        </button>
        <div
          style={{
            flex: 1,
            minHeight: "44px",
            borderRadius: "var(--radius-s)",
            background: "var(--ink)",
            color: "var(--paper)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.82rem",
            fontWeight: 600,
          }}
        >
          Ready to charge ${total.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export function GameHeroMiniPreview() {
  const [hud, setHud] = useState<"lore" | "loadout" | "telemetry">("lore");
  const copy = {
    lore: {
      eyebrow: "SECTOR 04 · SOLSTICE DRIFT",
      title: "Zero-preloader atmospheric world",
      detail: "Expressive display typography and crisp HUD switching without 4-second WebGL locks.",
    },
    loadout: {
      eyebrow: "MODULAR RIG · KEYBOARD READY",
      title: "Tactile 180ms ease-out transitions",
      detail: "Every HUD panel responds cleanly to keyboard focus and reduced-motion preferences.",
    },
    telemetry: {
      eyebrow: "FRAME BUDGET · 60 FPS TARGET",
      title: "High-contrast legibility over drama",
      detail: "Foreground text clears Lc 85+ even over dark atmospheric gradients.",
    },
  }[hud];

  return (
    <div
      style={{
        background: "linear-gradient(140deg, #10161d 0%, #1c2836 55%, #12151a 100%)",
        color: "#F3F6F9",
        borderRadius: "var(--radius-s)",
        padding: "1.1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        border: "1px solid rgba(255,255,255,0.16)",
      }}
    >
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }} role="group" aria-label="Game HUD panels">
        {(["lore", "loadout", "telemetry"] as const).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={hud === k}
            onClick={() => setHud(k)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              padding: "0.26rem 0.65rem",
              borderRadius: "999px",
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.28)",
              background: hud === k ? "#F3F6F9" : "transparent",
              color: hud === k ? "#10161D" : "#E2E8F0",
              fontWeight: 600,
            }}
          >
            {k}
          </button>
        ))}
      </div>

      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#93C5FD" }}>
          {copy.eyebrow}
        </div>
        <h4 style={{ fontSize: "1.12rem", color: "#FFFFFF", marginTop: "0.25rem" }}>
          {copy.title}
        </h4>
        <p style={{ fontSize: "0.78rem", color: "#CBD5E1", margin: "0.35rem 0 0", lineHeight: 1.5 }}>
          {copy.detail}
        </p>
      </div>
    </div>
  );
}
