import { test, expect } from "@playwright/test";

test("short link shows splash page then redirects", async ({ page }) => {
  // Go to homepage and create a short link
  await page.goto("https://linkjet.cc/");
  await page.waitForLoadState("networkidle");

  // Fill in a URL
  await page.fill("#link-input", "https://en.wikipedia.org/wiki/URL_shortening");
  await page.click("text=Shorten");
  await page.waitForTimeout(500);

  // Get the generated slug
  const slugInput = page.locator("input[type=text]");
  const slug = await slugInput.inputValue();

  // Create the link
  await page.click("text=Create link");
  await page.waitForTimeout(1000);

  // Navigate to the short link
  const shortUrl = `https://linkjet.cc/${slug}`;
  await page.goto(shortUrl);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);

  // Verify splash page is showing
  await expect(page.locator("h1")).toContainText("LinkJet");
  console.log("Splash: LinkJet.cc text visible");

  await expect(page.locator("text=Loading your page")).toBeVisible();
  console.log("Splash: 'Loading your page' visible");

  // Verify the spinning jet icon is present (accent-colored SVG)
  const jetIcon = page.locator("svg.text-accent");
  await expect(jetIcon).toBeVisible();
  console.log("Splash: spinning jet visible");

  // Wait for redirect to Wikipedia
  console.log("Waiting for redirect...");
  await page.waitForURL("**/wikipedia.org/**", { timeout: 15000 });
  console.log("Redirected to Wikipedia");

  // Verify we landed on the Wikipedia page
  await expect(page).toHaveTitle(/URL shortening/);
  console.log("Wikipedia page loaded successfully");
});
