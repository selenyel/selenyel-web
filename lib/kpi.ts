/**
 * Transparent weighted UX KPI & Satisfaction Score model.
 * Combines real behavioral telemetry (latency, tap friction, error recovery)
 * with perceived usability (UMUX-Lite) into a 0-100 UX Health Index.
 */

export interface UxKpiInputs {
  /** Median interaction/task response latency in ms (100 - 5000). */
  taskLatencyMs: number;
  /** Median taps/clicks required to complete the core action (1 - 10). */
  tapCount: number;
  /** Percentage of users who recover from validation/system errors on first retry (0 - 100). */
  errorRecoveryRate: number;
  /** UMUX-Lite perceived usability & usefulness score (0 - 100). */
  umuxLiteScore: number;
}

export interface UxKpiFactor {
  id: "latency" | "taps" | "recovery" | "umux";
  label: string;
  weight: number;
  normalizedScore: number;
  weightedPoints: number;
}

export interface UxKpiResult {
  score: number;
  grade: "Exemplary" | "Healthy" | "Friction Risk" | "Redesign Required";
  weakestFactor: UxKpiFactor;
  factors: UxKpiFactor[];
}

export const KPI_WEIGHTS = {
  latency: 0.25,
  taps: 0.25,
  recovery: 0.2,
  umux: 0.3,
} as const;

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function computeUxHealth(inputs: UxKpiInputs): UxKpiResult {
  // Latency: <= 250ms = 100, >= 4000ms = 0 (linear piecewise after perceived instant threshold)
  const latencyNorm =
    inputs.taskLatencyMs <= 250
      ? 100
      : clamp(100 - ((inputs.taskLatencyMs - 250) / 3750) * 100, 0, 100);

  // Tap budget: <= 2 taps = 100 (mid-shift target), each extra tap drops 12.5 points
  const tapsNorm =
    inputs.tapCount <= 2
      ? 100
      : clamp(100 - (inputs.tapCount - 2) * 12.5, 0, 100);

  const recoveryNorm = clamp(inputs.errorRecoveryRate, 0, 100);
  const umuxNorm = clamp(inputs.umuxLiteScore, 0, 100);

  const factors: UxKpiFactor[] = [
    {
      id: "latency",
      label: "Response Latency",
      weight: KPI_WEIGHTS.latency,
      normalizedScore: Math.round(latencyNorm),
      weightedPoints: Number((latencyNorm * KPI_WEIGHTS.latency).toFixed(1)),
    },
    {
      id: "taps",
      label: "Interaction Tap Budget",
      weight: KPI_WEIGHTS.taps,
      normalizedScore: Math.round(tapsNorm),
      weightedPoints: Number((tapsNorm * KPI_WEIGHTS.taps).toFixed(1)),
    },
    {
      id: "recovery",
      label: "First-Try Error Recovery",
      weight: KPI_WEIGHTS.recovery,
      normalizedScore: Math.round(recoveryNorm),
      weightedPoints: Number((recoveryNorm * KPI_WEIGHTS.recovery).toFixed(1)),
    },
    {
      id: "umux",
      label: "UMUX-Lite Satisfaction",
      weight: KPI_WEIGHTS.umux,
      normalizedScore: Math.round(umuxNorm),
      weightedPoints: Number((umuxNorm * KPI_WEIGHTS.umux).toFixed(1)),
    },
  ];

  const score = Math.round(
    factors.reduce((sum, f) => sum + f.normalizedScore * f.weight, 0)
  );

  const grade: UxKpiResult["grade"] =
    score >= 85
      ? "Exemplary"
      : score >= 70
        ? "Healthy"
        : score >= 50
          ? "Friction Risk"
          : "Redesign Required";

  const weakestFactor = [...factors].sort(
    (a, b) => a.normalizedScore - b.normalizedScore
  )[0];

  return { score, grade, weakestFactor, factors };
}

export const KPI_PRESETS: Record<
  string,
  { name: string; description: string; inputs: UxKpiInputs }
> = {
  legacy: {
    name: "Legacy Enterprise Form",
    description: "Slow client hydration, 7-step flow, vague error banners.",
    inputs: {
      taskLatencyMs: 2650,
      tapCount: 7,
      errorRecoveryRate: 48,
      umuxLiteScore: 54,
    },
  },
  renewed: {
    name: "Renewed Core Flow",
    description: "Sub-300ms response, 2-tap confirm, explicit recovery contract.",
    inputs: {
      taskLatencyMs: 240,
      tapCount: 2,
      errorRecoveryRate: 94,
      umuxLiteScore: 89,
    },
  },
  watchShift: {
    name: "Mid-Shift WatchOS Target",
    description: "2-second glance window, 2 taps max, zero second-screen detours.",
    inputs: {
      taskLatencyMs: 180,
      tapCount: 2,
      errorRecoveryRate: 96,
      umuxLiteScore: 92,
    },
  },
};
