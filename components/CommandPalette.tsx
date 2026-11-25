"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SHIPPED_PROJECTS } from "@/data/work";
import { useTheme } from "./ThemeProvider";

interface PaletteCommand {
  id: string;
  group: "Case Studies" | "Jump to Section" | "Actions";
  label: string;
  hint?: string;
  keywords: string;
  run: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const {
    cmdOpen,
    setCmdOpen,
    setTheme,
    inspect,
    setInspect,
    motion,
    setMotion,
  } = useTheme();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!cmdOpen) return;
    setQuery("");
    setActiveIndex(0);
    inputRef.current?.focus();
    const raf = window.requestAnimationFrame(() => inputRef.current?.focus());
    const onGlobalKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setCmdOpen(false);
      }
    };
    window.addEventListener("keydown", onGlobalKey);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onGlobalKey);
    };
  }, [cmdOpen, setCmdOpen]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const commands = useMemo<PaletteCommand[]>(() => {
    const projectCmds: PaletteCommand[] = SHIPPED_PROJECTS.map((p) => ({
      id: `work-${p.slug}`,
      group: "Case Studies",
      label: p.title,
      hint: p.scale,
      keywords: `${p.title} ${p.organization} ${p.platforms.join(" ")}`,
      run: () => {
        setCmdOpen(false);
        router.push(`/work/${p.slug}`);
      },
    }));

    const sectionCmds: PaletteCommand[] = [
      { id: "sec-work", group: "Jump to Section", label: "Shipped Work", hint: "#work", keywords: "projects portfolio grid", run: () => { setCmdOpen(false); router.push("/#work"); } },
      { id: "sec-taste", group: "Jump to Section", label: "Craft & AI-Agent Taste Lab", hint: "#taste", keywords: "emil animations scale ease apca", run: () => { setCmdOpen(false); router.push("/#taste"); } },
      { id: "sec-flow", group: "Jump to Section", label: "Shift Simulator (Watch / Phone / Web)", hint: "#flow", keywords: "taps dsp watchos mobile", run: () => { setCmdOpen(false); router.push("/#flow"); } },
      { id: "sec-science", group: "Jump to Section", label: "Scientific UX & Measurement Lab", hint: "#scientific-ux", keywords: "lighthouse digital twins kpi adaptive", run: () => { setCmdOpen(false); router.push("/#scientific-ux"); } },
      { id: "sec-lab", group: "Jump to Section", label: "Interface Lab (Concept Studies)", hint: "#lab", keywords: "pos cashier game concept", run: () => { setCmdOpen(false); router.push("/#lab"); } },
      { id: "sec-exp", group: "Jump to Section", label: "Experience & Contact", hint: "#experience", keywords: "resume timeline education", run: () => { setCmdOpen(false); router.push("/#experience"); } },
    ];

    const actionCmds: PaletteCommand[] = [
      {
        id: "act-copy",
        group: "Actions",
        label: "Copy hello@selenyel.com",
        hint: "Email",
        keywords: "contact email mail copy",
        run: () => {
          setCmdOpen(false);
          navigator.clipboard?.writeText("hello@selenyel.com").catch(() => {});
          showToast("Copied hello@selenyel.com");
        },
      },
      {
        id: "act-inspect",
        group: "Actions",
        label: inspect ? "Disable Inspect Mode" : "Enable Inspect Mode (Tokens & APCA)",
        hint: inspect ? "ON" : "OFF",
        keywords: "figma dev mode inspect apca tokens",
        run: () => {
          setInspect(!inspect);
          setCmdOpen(false);
        },
      },
      {
        id: "act-light",
        group: "Actions",
        label: "Switch to Light Theme",
        keywords: "appearance light paper",
        run: () => { setTheme("light"); setCmdOpen(false); },
      },
      {
        id: "act-dark",
        group: "Actions",
        label: "Switch to Dark Theme",
        keywords: "appearance dark night",
        run: () => { setTheme("dark"); setCmdOpen(false); },
      },
      {
        id: "act-contrast",
        group: "Actions",
        label: "Switch to High Contrast Theme",
        keywords: "appearance accessibility contrast wcag",
        run: () => { setTheme("contrast"); setCmdOpen(false); },
      },
      {
        id: "act-motion",
        group: "Actions",
        label: motion === "reduced" ? "Enable Full Motion" : "Enable Reduced Motion",
        hint: motion,
        keywords: "motion animation accessibility",
        run: () => { setMotion(motion === "reduced" ? "full" : "reduced"); setCmdOpen(false); },
      },
    ];

    return [...projectCmds, ...sectionCmds, ...actionCmds];
  }, [inspect, motion, router, setCmdOpen, setInspect, setMotion, setTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.keywords.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setCmdOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      e.preventDefault();
      filtered[activeIndex].run();
    }
  };

  return (
    <>
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            zIndex: 150,
            background: "var(--ink)",
            color: "var(--paper)",
            padding: "0.55rem 1rem",
            borderRadius: "999px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          {toast}
        </div>
      )}

      {cmdOpen && (
        <div
          role="presentation"
          onClick={() => setCmdOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 140,
            background: "rgba(15, 22, 27, 0.52)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "min(14vh, 110px) 1rem 1rem",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            style={{
              width: "min(580px, 100%)",
              background: "var(--paper-elevated)",
              color: "var(--ink)",
              border: "var(--guide-w) solid var(--guide)",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow-elevated)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.85rem 1rem",
                borderBottom: "var(--guide-w) solid var(--guide)",
              }}
            >
              <label htmlFor="cmd-search" className="sr-only">
                Search case studies, sections, and actions
              </label>
              <input
                ref={inputRef}
                id="cmd-search"
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a project, toggle Inspect, or copy email..."
                style={{
                  flex: 1,
                  border: 0,
                  outline: "none",
                  background: "transparent",
                  color: "var(--ink)",
                  font: "inherit",
                  fontSize: "0.95rem",
                }}
              />
              <button
                type="button"
                onClick={() => setCmdOpen(false)}
                className="spec"
                style={{
                  border: "var(--guide-w) solid var(--guide)",
                  background: "var(--paper-2)",
                  color: "var(--ink)",
                  borderRadius: "6px",
                  padding: "0.18rem 0.45rem",
                  cursor: "pointer",
                  fontSize: "0.72rem",
                }}
              >
                Esc
              </button>
            </div>

            <div
              role="listbox"
              aria-label="Command results"
              style={{ maxHeight: "360px", overflowY: "auto", padding: "0.45rem" }}
            >
              {filtered.length === 0 ? (
                <p className="spec" style={{ padding: "1.2rem", textAlign: "center", margin: 0 }}>
                  No matching commands.
                </p>
              ) : (
                filtered.map((cmd, idx) => {
                  const active = idx === activeIndex;
                  const showGroupHeader = idx === 0 || filtered[idx - 1].group !== cmd.group;
                  return (
                    <React.Fragment key={cmd.id}>
                      {showGroupHeader && (
                        <div
                          className="spec"
                          style={{
                            padding: "0.45rem 0.65rem 0.2rem",
                            fontSize: "0.68rem",
                            textTransform: "uppercase",
                          }}
                        >
                          {cmd.group}
                        </div>
                      )}
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={cmd.run}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.75rem",
                          padding: "0.58rem 0.72rem",
                          borderRadius: "var(--radius-s)",
                          border: 0,
                          cursor: "pointer",
                          font: "inherit",
                          fontSize: "0.88rem",
                          background: active ? "var(--ink)" : "transparent",
                          color: active ? "var(--paper)" : "var(--ink)",
                        }}
                      >
                        <span>{cmd.label}</span>
                        {cmd.hint && (
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.72rem",
                              opacity: active ? 0.85 : 0.75,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {cmd.hint}
                          </span>
                        )}
                      </button>
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
