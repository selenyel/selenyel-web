"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { evaluateContrast, type ContrastEvaluation } from "@/lib/apca";

export type ThemeMode = "light" | "dark" | "contrast";
export type DensityMode = "comfortable" | "compact";
export type TextScaleMode = "default" | "large";
export type MotionMode = "full" | "reduced";
export type VisionMode = "default" | "deuteranopia" | "achromatopsia";

const PORTRAITS: Record<ThemeMode, string> = {
  light: "/images/profile-big.webp",
  dark: "/images/profile-dark.webp",
  contrast: "/images/profile-contrast.webp",
};

const THEME_HEX: Record<ThemeMode, { ink: string; paper: string }> = {
  light: { ink: "#202A31", paper: "#FEFCFA" },
  dark: { ink: "#EDF2F3", paper: "#141C21" },
  contrast: { ink: "#000000", paper: "#FFFFFF" },
};

interface ThemeContextValue {
  theme: ThemeMode;
  density: DensityMode;
  textScale: TextScaleMode;
  motion: MotionMode;
  vision: VisionMode;
  inspect: boolean;
  cmdOpen: boolean;
  portraitSrc: string;
  contrastMetrics: ContrastEvaluation;
  setTheme: (next: ThemeMode) => void;
  setDensity: (next: DensityMode) => void;
  setTextScale: (next: TextScaleMode) => void;
  setMotion: (next: MotionMode) => void;
  setVision: (next: VisionMode) => void;
  setInspect: (next: boolean) => void;
  setCmdOpen: (next: boolean) => void;
  resetAdaptive: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [density, setDensity] = useState<DensityMode>("comfortable");
  const [textScale, setTextScale] = useState<TextScaleMode>("default");
  const [motion, setMotion] = useState<MotionMode>("full");
  const [vision, setVision] = useState<VisionMode>("default");
  const [inspect, setInspect] = useState<boolean>(false);
  const [cmdOpen, setCmdOpen] = useState<boolean>(false);

  // Sync persisted preferences & OS reduced-motion once on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("sy-theme") as ThemeMode | null;
      if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "contrast") {
        setThemeState(savedTheme);
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setMotion("reduced");
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Reflect attributes onto <html>
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-density", density);
    root.setAttribute("data-text-scale", textScale);
    root.setAttribute("data-motion", motion);
    root.setAttribute("data-vision", vision);
    root.setAttribute("data-inspect", inspect ? "on" : "off");
  }, [theme, density, textScale, motion, vision, inspect]);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const setTheme = useCallback(
    (next: ThemeMode) => {
      try {
        localStorage.setItem("sy-theme", next);
      } catch {
        // ignore
      }
      const apply = () => {
        document.documentElement.setAttribute("data-theme", next);
        setThemeState(next);
      };

      const prefersReduced =
        motion === "reduced" ||
        (typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches);

      if (prefersReduced || typeof document === "undefined" || !("startViewTransition" in document)) {
        apply();
        return;
      }

      // Pre-decode incoming portrait so View Transition never pops late
      let fired = false;
      const run = () => {
        if (fired) return;
        fired = true;
        const doc = document as Document & {
          startViewTransition?: (cb: () => void) => void;
        };
        if (doc.startViewTransition) {
          doc.startViewTransition(apply);
        } else {
          apply();
        }
      };

      const img = new Image();
      img.onload = run;
      img.onerror = run;
      img.src = PORTRAITS[next];
      if (img.complete) run();
      window.setTimeout(run, 180);
    },
    [motion]
  );

  const resetAdaptive = useCallback(() => {
    setTheme("light");
    setDensity("comfortable");
    setTextScale("default");
    setMotion("full");
    setVision("default");
    setInspect(false);
  }, [setTheme]);

  const contrastMetrics = useMemo(() => {
    const pair = THEME_HEX[theme];
    return evaluateContrast(pair.ink, pair.paper);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      density,
      textScale,
      motion,
      vision,
      inspect,
      cmdOpen,
      portraitSrc: PORTRAITS[theme],
      contrastMetrics,
      setTheme,
      setDensity,
      setTextScale,
      setMotion,
      setVision,
      setInspect,
      setCmdOpen,
      resetAdaptive,
    }),
    [
      theme,
      density,
      textScale,
      motion,
      vision,
      inspect,
      cmdOpen,
      contrastMetrics,
      setTheme,
      resetAdaptive,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>
      {/* SVG filter for optional deuteranopia color-vision simulation */}
      <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="vision-deuteranopia">
            <feColorMatrix
              type="matrix"
              values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
