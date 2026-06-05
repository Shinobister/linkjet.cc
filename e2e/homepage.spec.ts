import { test, expect } from "@playwright/test";

test.describe("LinkJet homepage", () => {
  test("homepage loads with all sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByText("Short links.")).toBeVisible();
    await expect(page.getByText("High speed.")).toBeVisible();
    await expect(page.getByPlaceholder("https://example.com/very-long-link")).toBeVisible();
    await expect(page.getByText("History")).toBeVisible();
    await expect(page.getByText("No links yet")).toBeVisible();
  });

  test("has correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/LinkJet/);
  });
});

test.describe("URL input validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows error for empty URL", async ({ page }) => {
    await page.getByRole("button", { name: "Shorten" }).click();
    await expect(page.getByText("Please enter a URL")).toBeVisible();
  });

  test("shows error for invalid URL", async ({ page }) => {
    await page.getByPlaceholder("https://example.com/very-long-link").fill("not-a-url");
    await page.getByRole("button", { name: "Shorten" }).click();
    await expect(page.getByText("Please enter a valid URL")).toBeVisible();
  });

  test("accepts valid URL and proceeds to vanity step", async ({ page }) => {
    await page.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/test");
    await page.getByRole("button", { name: "Shorten" }).click();
    await expect(page.getByText("Custom slug (optional)")).toBeVisible();
    await expect(page.getByPlaceholder("your-custom-link")).toBeVisible();
  });
});

test.describe("Vanity slug validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/test");
    await page.getByRole("button", { name: "Shorten" }).click();
  });

  test("shows error for invalid characters in slug", async ({ page }) => {
    const slugInput = page.getByPlaceholder("your-custom-link");
    await slugInput.fill("hello world!");
    await expect(page.getByText("Only letters, numbers, and hyphens allowed")).toBeVisible();
  });

  test("shows error for slug that is too short", async ({ page }) => {
    const slugInput = page.getByPlaceholder("your-custom-link");
    await slugInput.fill("ab");
    await expect(page.getByText("Slug must be at least 3 characters")).toBeVisible();
  });

  test("shows green check for valid slug", async ({ page }) => {
    const slugInput = page.getByPlaceholder("your-custom-link");
    await slugInput.fill("my-valid-slug");
    await expect(page.getByText("Slug is available")).toBeVisible();
  });

  test("can generate random slug", async ({ page }) => {
    await page.getByRole("button", { name: "Generate random" }).click();
    const slugInput = page.getByPlaceholder("your-custom-link");
    const value = await slugInput.inputValue();
    expect(value.length).toBeGreaterThanOrEqual(3);
  });
});

test.describe("Short link creation", () => {
  test("creates short link and shows result", async ({ page }) => {
    await page.goto("/");

    // Step 1: Enter URL
    await page.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/test");
    await page.getByRole("button", { name: "Shorten" }).click();

    // Step 2: Create link
    await page.getByRole("button", { name: "Create link" }).click();

    // Step 3: Result screen
    await expect(page.getByText("Your short link")).toBeVisible();
    await expect(page.locator('input[value*="linkjet.cc"]')).toBeVisible();
  });

  test("shows copied confirmation", async ({ page }) => {
    // Grant clipboard permission
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await page.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/test");
    await page.getByRole("button", { name: "Shorten" }).click();
    await page.getByRole("button", { name: "Create link" }).click();
    await page.getByRole("button", { name: "Copy", exact: true }).click();
    await expect(page.getByText("Copied to clipboard!")).toBeVisible({ timeout: 3000 });
  });

  test("can shorten another link after creation", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/test");
    await page.getByRole("button", { name: "Shorten" }).click();
    await page.getByRole("button", { name: "Create link" }).click();
    await page.getByRole("button", { name: "Shorten another link" }).click();
    await expect(page.getByPlaceholder("https://example.com/very-long-link")).toBeVisible();
  });
});

test.describe("History functionality", () => {
  test("shows created link in history", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/history-test");
    await page.getByRole("button", { name: "Shorten" }).click();
    await page.getByRole("button", { name: "Create link" }).click();

    // Go back to URL step and create another to see history
    await page.getByRole("button", { name: "Shorten another link" }).click();
    await page.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/another-test");
    await page.getByRole("button", { name: "Shorten" }).click();
    await page.getByRole("button", { name: "Create link" }).click();

    // History should have entries - use first() to handle desktop+mobile duplicates
    await expect(page.getByText("history-test").first()).toBeVisible();
  });

  test("persists history after page reload", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/persist-test");
    await page.getByRole("button", { name: "Shorten" }).click();
    await page.getByRole("button", { name: "Create link" }).click();

    // Reload
    await page.reload();

    // History should still be there
    await expect(page.getByText("persist-test").first()).toBeVisible();
  });

  test("can delete a history row", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/delete-me");
    await page.getByRole("button", { name: "Shorten" }).click();
    await page.getByRole("button", { name: "Create link" }).click();
    await page.getByRole("button", { name: "Shorten another link" }).click();

    // Click delete button
    await page.getByRole("button", { name: "Delete link" }).first().click();
    await expect(page.getByText("delete-me").first()).not.toBeVisible();
  });

  test("can clear all history", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/clear-test");
    await page.getByRole("button", { name: "Shorten" }).click();
    await page.getByRole("button", { name: "Create link" }).click();
    await page.getByRole("button", { name: "Shorten another link" }).click();

    // Clear all
    await page.getByRole("button", { name: "Clear all" }).click();
    await expect(page.getByText("No links yet")).toBeVisible();
  });
});

test.describe("Mobile layout", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("mobile layout does not overflow", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByText("Short links.")).toBeVisible();

    // Check no horizontal scroll
    const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(pageWidth).toBeLessThanOrEqual(viewportWidth + 2);
  });

  test("mobile header has hamburger menu", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByLabel("Toggle menu")).toBeVisible();
  });

  test("mobile history shows stacked cards", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/mobile-test");
    await page.getByRole("button", { name: "Shorten" }).click();
    await page.getByRole("button", { name: "Create link" }).click();
    // Use nth(1) to skip the hidden desktop row (display:none at mobile viewport)
    await expect(page.getByText("mobile-test").nth(1)).toBeVisible();
  });
});

test.describe("Edge cases", () => {
  test("back button preserves URL input and returns to step 1", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/back-test");
    await page.getByRole("button", { name: "Shorten" }).click();
    await expect(page.getByText("Custom slug (optional)")).toBeVisible();

    // Click Back
    await page.getByRole("button", { name: "Back" }).click();

    // URL step should be shown with preserved input
    await expect(page.getByPlaceholder("https://example.com/very-long-link")).toHaveValue("https://example.com/back-test");
  });

  test("pasted linkjet.cc URL in slug field strips prefix", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/paste-test");
    await page.getByRole("button", { name: "Shorten" }).click();

    const slugInput = page.getByPlaceholder("your-custom-link");
    await slugInput.fill("https://linkjet.cc/my-slug");

    await expect(slugInput).toHaveValue("my-slug");
  });

  test("shows error for slug exceeding 30 characters", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/long-slug-test");
    await page.getByRole("button", { name: "Shorten" }).click();

    const slugInput = page.getByPlaceholder("your-custom-link");
    await slugInput.fill("a".repeat(31));
    await expect(page.getByText("Slug must be at most 30 characters")).toBeVisible();
  });

  test("shows error for duplicate slug", async ({ page }) => {
    await page.goto("/");

    // Create first link with custom slug
    await page.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/dup-test");
    await page.getByRole("button", { name: "Shorten" }).click();
    const slugInput = page.getByPlaceholder("your-custom-link");
    await slugInput.fill("dedup-slug");
    await page.getByRole("button", { name: "Create link" }).click();
    await expect(page.getByText("Your short link")).toBeVisible();

    // Shorten another and try the same slug
    await page.getByRole("button", { name: "Shorten another link" }).click();
    await page.getByPlaceholder("https://example.com/very-long-link").fill("https://example.com/dup-test-2");
    await page.getByRole("button", { name: "Shorten" }).click();
    await slugInput.fill("dedup-slug");
    await expect(page.getByText("This slug is already taken")).toBeVisible();
  });

  test("rejects URL without protocol", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("https://example.com/very-long-link").fill("example.com/test");
    await page.getByRole("button", { name: "Shorten" }).click();
    await expect(page.getByText("Please enter a valid URL")).toBeVisible();
  });

  test("rejects javascript URL scheme", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("https://example.com/very-long-link").fill("javascript:alert(1)");
    await page.getByRole("button", { name: "Shorten" }).click();
    await expect(page.getByText("Please enter a valid URL")).toBeVisible();
  });
});
