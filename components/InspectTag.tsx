"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

export function InspectTag({
  token,
  detail,
  showLiveApca = false,
}: {
  token: string;
  detail?: string;
  showLiveApca?: boolean;
}) {
  const { inspect, contrastMetrics } = useTheme();
  if (!inspect) return null;

  return (
    <span className="inspect-pill" aria-hidden="true">
      <span>{token}</span>
      {detail && <span>· {detail}</span>}
      {showLiveApca && (
        <span>
          · Lc {contrastMetrics.lc} ({contrastMetrics.wcagGrade})
        </span>
      )}
    </span>
  );
}
