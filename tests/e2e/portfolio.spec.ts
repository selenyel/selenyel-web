import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const WORK_SLUGS = [
  "onewell-core",
  "c2s-pahm",
  "dioscorium",
  "luwian",
  "onewell-mobile",
  "ministry-of-trade",
];

test.describe("selenyel.com flagship verification", () => {
  test("homepage loads cleanly, zero WCAG A/AA violations across Light, Dark, High-Contrast, and zero mobile overflow", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "hands are already full"
    );

    // Check WCAG 2.1 A/AA across all 3 themes
    const themes: Array<[string, string]> = [
      ["Light", "light"],
      ["Dark", "dark"],
      ["High contrast", "contrast"],
    ];
    for (const [themeLabel, expectedAttr] of themes) {
      await page
        .getByRole("group", { name: "Appearance" })
        .getByRole("button", { name: themeLabel })
        .click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", expectedAttr);
      await page.waitForTimeout(420);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(
        results.violations,
        `WCAG violations in ${themeLabel} mode`
      ).toEqual([]);
    }

    // Reset to Light and check Inspect Mode + Cmd+K palette
    await page
      .getByRole("group", { name: "Appearance" })
      .getByRole("button", { name: "Light" })
      .click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.waitForTimeout(420);
    if (process.env.CAPTURE_DIR) {
      await page.screenshot({ path: `${process.env.CAPTURE_DIR}/home-light.png`, fullPage: false });
    }
    await page.getByRole("button", { name: /Inspect/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-inspect", "on");
    if (process.env.CAPTURE_DIR) {
      await page.screenshot({ path: `${process.env.CAPTURE_DIR}/home-inspect.png`, fullPage: false });
    }

    await page.getByRole("button", { name: /Quick jump/i }).click();
    await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Command palette" })).toBeHidden();

    // Check Shift Simulator 2-tap flow
    await page.getByRole("button", { name: /Morning medication/i }).click();
    await page.getByRole("button", { name: "Log it" }).click();
    await expect(page.getByText("Two taps. That is the version")).toBeVisible();

    // Check Scientific UX KPI calculator tab
    await page.getByRole("tab", { name: /04 · UX KPI Model/i }).click();
    await page.getByRole("button", { name: "Legacy Enterprise Form" }).click();
    const legacyScore = Number(await page.getByTestId("ux-health-score").textContent());
    expect(legacyScore).toBeLessThan(60);

    // Capture dark theme desktop view of work + labs
    await page.getByRole("button", { name: /Inspect/i }).click();
    await page
      .getByRole("group", { name: "Appearance" })
      .getByRole("button", { name: "Dark" })
      .click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.waitForTimeout(420);
    if (process.env.CAPTURE_DIR) {
      await page.locator("#work").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${process.env.CAPTURE_DIR}/work-dark.png`, fullPage: false });
    }

    // Mobile 390px horizontal overflow check
    await page.setViewportSize({ width: 390, height: 844 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
    expect(errors).toEqual([]);
  });

  test("opening viewport framing holds across tall desktop, portrait phone, and sideways phone (844x390)", async ({
    page,
  }) => {
    // 1. Tall desktop (1440x1080): Shipped work must NOT peek into opening cover
    await page.setViewportSize({ width: 1440, height: 1080 });
    await page.goto("/", { waitUntil: "networkidle" });
    const tallMetrics = await page.evaluate(() => {
      const workTop = document.getElementById("work")!.getBoundingClientRect().top;
      const barBottom = document.querySelector(".hero-appearance")!.getBoundingClientRect().bottom;
      return { workTop, barBottom, vh: window.innerHeight };
    });
    expect(tallMetrics.workTop).toBeGreaterThanOrEqual(tallMetrics.vh - 1);
    expect(tallMetrics.barBottom).toBeLessThanOrEqual(tallMetrics.vh);
    if (process.env.CAPTURE_DIR) {
      await page.screenshot({ path: `${process.env.CAPTURE_DIR}/cover-desktop-1080.png`, fullPage: false });
    }

    // 2. Portrait phone (390x844): Complete cover fits above the 54px bottom rail, zero overflow
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(120);
    const portraitMetrics = await page.evaluate(() => {
      const workTop = document.getElementById("work")!.getBoundingClientRect().top;
      const barBottom = document.querySelector(".hero-appearance")!.getBoundingClientRect().bottom;
      const overflow = document.documentElement.scrollWidth > window.innerWidth;
      return { workTop, barBottom, overflow, usableH: window.innerHeight - 54 };
    });
    expect(portraitMetrics.overflow).toBe(false);
    expect(portraitMetrics.barBottom).toBeLessThanOrEqual(portraitMetrics.usableH + 2);
    expect(portraitMetrics.workTop).toBeGreaterThanOrEqual(portraitMetrics.usableH - 2);
    if (process.env.CAPTURE_DIR) {
      await page.screenshot({ path: `${process.env.CAPTURE_DIR}/cover-mobile-portrait.png`, fullPage: false });
    }

    // 3. Sideways phone (844x390): Summarized bio active, entire opening cover fits inside 390px height!
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(120);
    const landscapeMetrics = await page.evaluate(() => {
      const workTop = document.getElementById("work")!.getBoundingClientRect().top;
      const barBottom = document.querySelector(".hero-appearance")!.getBoundingClientRect().bottom;
      const extendedDisplay = getComputedStyle(document.querySelector(".hero-lead-extended")!).display;
      const overflow = document.documentElement.scrollWidth > window.innerWidth;
      return { workTop, barBottom, extendedDisplay, overflow, vh: window.innerHeight };
    });
    expect(landscapeMetrics.overflow).toBe(false);
    expect(landscapeMetrics.extendedDisplay).toBe("none");
    expect(landscapeMetrics.barBottom).toBeLessThanOrEqual(landscapeMetrics.vh + 2);
    expect(landscapeMetrics.workTop).toBeGreaterThanOrEqual(landscapeMetrics.vh - 1);
    if (process.env.CAPTURE_DIR) {
      await page.screenshot({ path: `${process.env.CAPTURE_DIR}/cover-mobile-landscape.png`, fullPage: false });
    }

    // 4. Case study on sideways phone (844x390): zero overflow & specimen immediately visible
    await page.goto("/work/dioscorium", { waitUntil: "networkidle" });
    const caseLandscape = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth > window.innerWidth;
      const specimenTop = document.querySelector(".case-specimen-card")!.getBoundingClientRect().top;
      return { overflow, specimenTop, vh: window.innerHeight };
    });
    expect(caseLandscape.overflow).toBe(false);
    expect(caseLandscape.specimenTop).toBeLessThan(caseLandscape.vh);
    if (process.env.CAPTURE_DIR) {
      await page.screenshot({ path: `${process.env.CAPTURE_DIR}/case-mobile-landscape.png`, fullPage: false });
    }
  });

  test("all 6 case studies and /api/health render cleanly with zero WCAG A/AA violations", async ({
    page,
    request,
  }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);

    for (const slug of WORK_SLUGS) {
      await page.goto(`/work/${slug}`, { waitUntil: "networkidle" });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations, `WCAG violations on /work/${slug}`).toEqual([]);
    }

    // Verify /cv legacy redirect
    const cvRes = await request.get("/cv", { maxRedirects: 0 });
    expect([301, 308]).toContain(cvRes.status());
    expect(cvRes.headers()["location"]).toMatch(/\/$/);

    // Verify interactive Dioscorium reimagined clinical cockpit (10-module hue switcher + Cath Lab + SaMD sign-off)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/work/dioscorium", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Echo AI" }).click();
    await expect(page.getByText(/Echo AI: Echocardiography/i)).toBeVisible();
    await expect(page.locator('[data-vision-stage="true"]').first()).toHaveCSS(
      "background-color",
      "rgb(62, 50, 122)"
    );
    if (process.env.CAPTURE_DIR) {
      await page.locator(".case-specimen-card").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${process.env.CAPTURE_DIR}/case-dioscorium.png`, fullPage: false });
    }

    // Switch to Cath Lab obsidian dark + ECG AI waveform + clinician acknowledgement and verify WCAG A/AA
    await page.getByRole("button", { name: "Cath Lab" }).click();
    await page.getByRole("button", { name: "ECG AI" }).click();
    await expect(page.locator('[data-vision-stage="true"]').first()).toHaveCSS(
      "background-color",
      "rgb(142, 58, 32)"
    );
    await page.getByRole("button", { name: "Review & Acknowledge" }).click();
    await expect(page.getByRole("button", { name: /Clinician Reviewed/i })).toBeVisible();
    const cathResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(cathResults.violations, "WCAG violations in Dioscorium Cath Lab mode").toEqual([]);
    if (process.env.CAPTURE_DIR) {
      await page.locator(".case-specimen-card").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${process.env.CAPTURE_DIR}/case-dioscorium-cath.png`, fullPage: false });
    }
  });
});
