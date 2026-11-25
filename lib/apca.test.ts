import { describe, expect, it } from "vitest";
import {
  DIOSCORIUM_SURFACES,
  apcaLc,
  blendOverOpaque,
  evaluateContrast,
  wcagRatio,
} from "./apca";

describe("APCA 0.98G & WCAG 2.1 contrast engine", () => {
  it("computes high contrast on portfolio Light, Dark, and High-Contrast ink pairs", () => {
    expect(apcaLc("#202A31", "#FEFCFA")).toBeGreaterThan(95);
    expect(apcaLc("#EDF2F3", "#151D22")).toBeGreaterThan(90);
    expect(apcaLc("#000000", "#FFFFFF")).toBeGreaterThan(105);
    expect(wcagRatio("#202A31", "#FEFCFA")).toBeGreaterThan(13);
  });

  it("verifies all 10 Dioscorium clinical surfaces pass APCA Lc >= 75 and WCAG AA/AAA", () => {
    expect(DIOSCORIUM_SURFACES).toHaveLength(10);
    for (const surface of DIOSCORIUM_SURFACES) {
      const inactive = evaluateContrast(surface.inactiveText, surface.panelBg);
      const active = evaluateContrast(surface.activeText, surface.activePill);
      expect(inactive.lc, `${surface.name} inactive Lc`).toBeGreaterThanOrEqual(77);
      expect(inactive.wcag, `${surface.name} inactive WCAG`).toBeGreaterThanOrEqual(6.0);
      expect(active.lc, `${surface.name} active Lc`).toBeGreaterThanOrEqual(75);
      expect(active.wcag, `${surface.name} active WCAG`).toBeGreaterThanOrEqual(8.5);
    }
  });

  it("proves semi-transparent white over dark clinical panel loses contrast vs luminance-pinned ink", () => {
    const naive = blendOverOpaque("#FFFFFF", 0.55, "#9B1611");
    const naiveLc = apcaLc(naive, "#9B1611");
    const pinnedLc = apcaLc("#F1ECEC", "#9B1611");
    expect(pinnedLc - naiveLc).toBeGreaterThan(30);
  });
});
