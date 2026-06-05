import { chromium } from "@playwright/test";

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ deviceScaleFactor: 2 });

  // --- Desktop screenshots ---
  const desktop = await context.newPage();
  await desktop.setViewportSize({ width: 1280, height: 800 });
  await desktop.goto("http://localhost:3000");
  await desktop.waitForTimeout(1000); // let animations settle
  await desktop.screenshot({ path: "validation/homepage-desktop.png", fullPage: true });

  // Desktop - link creation flow
  await desktop.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/screenshot-test");
  await desktop.getByRole("button", { name: "Shorten" }).click();
  await desktop.waitForTimeout(500);
  await desktop.screenshot({ path: "validation/step2-vanity-desktop.png", fullPage: true });

  await desktop.getByRole("button", { name: "Create link" }).click();
  await desktop.waitForTimeout(500);
  await desktop.screenshot({ path: "validation/step3-result-desktop.png", fullPage: true });

  // Desktop - history with items
  await desktop.getByRole("button", { name: "Shorten another link" }).click();
  await desktop.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/another-test");
  await desktop.getByRole("button", { name: "Shorten" }).click();
  await desktop.getByRole("button", { name: "Create link" }).click();
  await desktop.waitForTimeout(500);
  await desktop.screenshot({ path: "validation/history-desktop.png", fullPage: true });

  await desktop.close();

  // --- Mobile screenshots ---
  const mobile = await context.newPage();
  await mobile.setViewportSize({ width: 375, height: 812 });
  await mobile.goto("http://localhost:3000");
  await mobile.waitForTimeout(1000);
  await mobile.screenshot({ path: "validation/homepage-mobile.png", fullPage: true });

  // Mobile - hamburger menu open
  await mobile.getByLabel("Toggle menu").click();
  await mobile.waitForTimeout(300);
  await mobile.screenshot({ path: "validation/mobile-menu-open.png", fullPage: true });
  await mobile.getByLabel("Toggle menu").click();

  // Mobile - create link
  await mobile.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/mobile-shot");
  await mobile.getByRole("button", { name: "Shorten" }).click();
  await mobile.waitForTimeout(500);
  await mobile.getByRole("button", { name: "Create link" }).click();
  await mobile.waitForTimeout(500);
  await mobile.screenshot({ path: "validation/step3-result-mobile.png", fullPage: true });

  await mobile.close();
  await browser.close();

  console.log("Screenshots captured in validation/");
})();
