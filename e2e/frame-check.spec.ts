import { test, expect } from "@playwright/test";

test("framed redirect shows header, info bar, and iframe with original content", async ({ page }) => {
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
  console.log("Generated slug:", slug);

  // Create the link
  await page.click("text=Create link");
  await page.waitForTimeout(1000);

  // Navigate to the short link
  const shortUrl = `https://linkjet.cc/${slug}`;
  console.log("Navigating to:", shortUrl);
  await page.goto(shortUrl);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  // Verify header is visible
  await expect(page.locator("header")).toBeVisible();
  console.log("Header: visible");

  // Verify info bar is visible and shows slug and original URL
  const infoBar = page.locator("main div.border-b");
  await expect(infoBar).toBeVisible();
  const infoText = await infoBar.textContent();
  console.log("Info bar text:", infoText?.trim());

  // Verify the slug is shown
  expect(infoText).toContain(slug);
  // Verify the original URL is shown
  expect(infoText).toContain("wikipedia.org");

  // Verify "Open in new tab" link
  const openLink = page.locator('a[href="https://en.wikipedia.org/wiki/URL_shortening"]');
  await expect(openLink).toBeVisible();
  console.log("Open in new tab link: visible");

  // Verify iframe exists and has the correct src
  const iframe = page.locator("iframe");
  await expect(iframe).toBeVisible();
  const iframeSrc = await iframe.getAttribute("src");
  console.log("Iframe src:", iframeSrc);
  expect(iframeSrc).toBe("https://en.wikipedia.org/wiki/URL_shortening");

  // Take a screenshot
  await page.screenshot({ path: "validation/screenshot-frame.png", fullPage: false });

  // Check if there's any visible error or blocked content
  const pageText = await page.locator("main").textContent();
  console.log("Page main content (first 400 chars):", pageText?.substring(0, 400));

  // Log iframe state
  const iframeBox = await iframe.boundingBox();
  console.log("Iframe bounding box:", iframeBox);
});
