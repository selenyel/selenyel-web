"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

const SECTIONS = [
  { id: "top", label: "Intro" },
  { id: "work", label: "Shipped work" },
  { id: "taste", label: "Craft & taste" },
  { id: "flow", label: "Shift flow" },
  { id: "scientific-ux", label: "Scientific UX" },
  { id: "lab", label: "Interface lab" },
  { id: "experience", label: "Experience" },
];

export function ProgressRail() {
  const pathname = usePathname();
  const { motion } = useTheme();
  const isHome = pathname === "/";
  const [activeId, setActiveId] = useState<string>("top");
  const [poked, setPoked] = useState<boolean>(false);
  const faceRef = useRef<HTMLButtonElement | null>(null);
  const leftPupilRef = useRef<SVGPathElement | null>(null);
  const rightPupilRef = useRef<SVGPathElement | null>(null);

  // Scroll-spy with cached section offsets (zero layout thrash mid-scroll)
  useEffect(() => {
    if (!isHome) return;
    let offsets: Array<{ id: string; top: number }> = [];
    const measure = () => {
      offsets = SECTIONS.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { id: s.id, top: r.top + window.scrollY };
      }).filter((x): x is { id: string; top: number } => Boolean(x));
    };

    let raf = 0;
    const spy = () => {
      raf = 0;
      if (!offsets.length) return;
      const line = window.scrollY + window.innerHeight * 0.35;
      const atEnd =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
      let next = atEnd ? offsets[offsets.length - 1].id : offsets[0].id;
      if (!atEnd) {
        for (const s of offsets) {
          if (s.top <= line) next = s.id;
        }
      }
      setActiveId(next);
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(spy);
    };

    measure();
    spy();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [isHome]);

  // Eye-tracking SVG face with cached center & rAF
  useEffect(() => {
    if (motion === "reduced") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let fx = 0;
    let fy = 0;
    const locate = () => {
      if (!faceRef.current) return;
      const r = faceRef.current.getBoundingClientRect();
      fx = r.left + r.width / 2;
      fy = r.top + r.height / 2;
    };
    locate();

    let px = 0;
    let py = 0;
    let pending = false;
    const REACH = 2.3;

    const look = () => {
      pending = false;
      const dx = px - fx;
      const dy = py - fy;
      const d = Math.hypot(dx, dy);
      if (d < 1) return;
      const k = (Math.min(1, d / 36) * REACH) / d;
      const tr = `translate(${(dx * k).toFixed(2)}px, ${(dy * k).toFixed(2)}px)`;
      if (leftPupilRef.current) leftPupilRef.current.style.transform = tr;
      if (rightPupilRef.current) rightPupilRef.current.style.transform = tr;
    };

    const onMove = (e: MouseEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!pending) {
        pending = true;
        window.requestAnimationFrame(look);
      }
    };

    window.addEventListener("resize", locate);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("resize", locate);
      window.removeEventListener("mousemove", onMove);
    };
  }, [motion]);

  const onPoke = () => {
    setPoked(true);
    window.setTimeout(() => setPoked(false), 1200);
  };

  return (
    <nav className="rail" aria-label="Sections">
      <Link href="/" className="rail-mark">
        design file
      </Link>

      <ul className="rail-meter">
        {SECTIONS.map((s) => {
          const isCurrent = isHome ? activeId === s.id : s.id === "work";
          return (
            <li key={s.id}>
              <Link
                href={isHome ? `#${s.id}` : `/#${s.id}`}
                className="tick"
                data-label={s.label}
                aria-current={isCurrent ? "true" : undefined}
              >
                <i className="bead" aria-hidden="true" />
                <span className="sr-only">{s.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        ref={faceRef}
        type="button"
        className={`face-btn${poked ? " poke" : ""}`}
        onClick={onPoke}
        aria-label="Playful wink interaction"
      >
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="20" r="17" />
          <path ref={leftPupilRef} className="pupil pupil-l" d="M14 16.5 l0.01 0" />
          <path ref={rightPupilRef} className="pupil" d="M26 16.5 l0.01 0" />
          <path className="wink" d="M11.6 17.5 Q14 14.7 16.4 17.5" />
          <path d="M12.5 24.2 Q20 30.4 27.5 24.2" />
          <path className="tongue" pathLength={1} d="M16.8 26.7 C16.8 32.7 23.2 32.7 23.2 26.7" />
        </svg>
      </button>
    </nav>
  );
}
