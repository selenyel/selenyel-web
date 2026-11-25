import { describe, expect, it } from "vitest";
import { KPI_PRESETS, KPI_WEIGHTS, computeUxHealth } from "./kpi";

describe("UX KPI & Satisfaction Score model", () => {
  it("weights sum strictly to 1.0", () => {
    const total =
      KPI_WEIGHTS.latency +
      KPI_WEIGHTS.taps +
      KPI_WEIGHTS.recovery +
      KPI_WEIGHTS.umux;
    expect(total).toBeCloseTo(1.0, 5);
  });

  it("scores renewed flow as Exemplary and legacy form as Friction Risk / Redesign Required", () => {
    const legacy = computeUxHealth(KPI_PRESETS.legacy.inputs);
    const renewed = computeUxHealth(KPI_PRESETS.renewed.inputs);

    expect(legacy.score).toBeLessThan(55);
    expect(renewed.score).toBeGreaterThanOrEqual(90);
    expect(renewed.grade).toBe("Exemplary");
  });

  it("identifies the weakest factor deterministically", () => {
    const result = computeUxHealth({
      taskLatencyMs: 200,
      tapCount: 9,
      errorRecoveryRate: 95,
      umuxLiteScore: 90,
    });
    expect(result.weakestFactor.id).toBe("taps");
  });
});
