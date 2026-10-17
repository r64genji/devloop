import { test, expect } from "@playwright/test";

const isMobile = (testInfo) => testInfo.project.name === "mobile";
const card = (page, text) => page.locator("main article", { hasText: text });

// Fail any test that logs a console error or throws in the page.
test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.errors = errors;
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /happening now/i })).toBeVisible();
});

test.afterEach(async ({ page }) => {
  expect(page.errors, "console errors").toEqual([]);
});

test.describe("layout", () => {
  test("renders the feed in the light theme by default", async ({ page }) => {
    await expect(page).toHaveTitle(/devloop/);
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    expect(await page.locator("main article").count()).toBeGreaterThan(4);
  });

  test("has no horizontal overflow", async ({ page }) => {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("shows the bottom tab bar on phones and the sidebar elsewhere", async ({ page }, testInfo) => {
    const bottomNav = page.getByRole("navigation", { name: "Primary" });
    if (isMobile(testInfo)) {
      await expect(bottomNav).toBeVisible();
      await expect(page.locator("aside")).toBeHidden();
    } else {
      await expect(page.locator("aside")).toBeVisible();
      await expect(bottomNav).toBeHidden();
    }
  });

  test("header popovers stay inside the viewport", async ({ page }) => {
    await page.getByRole("button", { name: /Notifications/ }).click();
    await expect(page.getByText("Mark all as read")).toBeVisible();
    const box = await page.locator(".animate-drop").first().boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize().width);
  });

  test("infinite scroll loads every post and ends with a caught-up message", async ({ page }) => {
    const start = await page.locator("main article").count();
    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, 20000);
      await page.waitForTimeout(400);
    }
    await expect(page.getByText("You're all caught up")).toBeVisible({ timeout: 10_000 });
    expect(await page.locator("main article").count()).toBeGreaterThan(start);
  });
});

test.describe("post view", () => {
  test("opens a post, comments on it and browses with the arrow keys", async ({ page }) => {
    await page.getByRole("heading", { name: "So Reddit has decided that plain HTML is unsafe" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { level: 1 })).toHaveText(/plain HTML is unsafe/);
    await expect(dialog.getByText("TL;DR")).toBeVisible();

    await dialog.getByRole("textbox", { name: "Write a comment" }).fill("Great read");
    await dialog.getByRole("button", { name: "Comment", exact: true }).click();
    await expect(dialog.getByText("Great read")).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByRole("heading", { level: 1 })).toHaveText(/React Server Components/);

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("reading a post extends the streak", async ({ page }) => {
    await expect(page.getByRole("button", { name: /8 day reading streak/ })).toBeVisible();
    await page.getByRole("heading", { name: /Tailwind v4/ }).click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: /9 day reading streak/ })).toBeVisible();
  });

  test("deep links open a post and the URL follows the open post", async ({ page }) => {
    await page.goto("/?post=3");
    await expect(page.getByRole("dialog").getByRole("heading", { level: 1 })).toHaveText(/Tailwind v4/);
    await page.keyboard.press("Escape");
    await expect(page).not.toHaveURL(/post=/);
  });

  test("Escape closes only the top dialog and scrolling comes back", async ({ page }, testInfo) => {
    test.skip(isMobile(testInfo), "keyboard shortcut is desktop-only");
    await page.getByRole("heading", { name: /Tailwind v4/ }).click();
    await page.keyboard.press("Control+k");
    await expect(page.getByRole("combobox", { name: "Search" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("combobox", { name: "Search" })).toHaveCount(0);
    await expect(page.getByRole("dialog").getByRole("heading", { level: 1 })).toHaveText(/Tailwind v4/);

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  });
});

test.describe("search", () => {
  test("finds a tag and filters the feed", async ({ page }) => {
    await page.getByRole("button", { name: /Search posts and tags/ }).click();
    await page.getByRole("combobox", { name: "Search" }).fill("rust");
    await expect(page.getByRole("option", { name: /Rewriting our image pipeline/ })).toBeVisible();
    await page.getByRole("option", { name: /^Rust/ }).click();

    await expect(page.getByRole("tab", { name: "Rust", selected: true })).toBeVisible();
    const titles = await page.locator("main article h3").allTextContents();
    expect(titles.length).toBeGreaterThan(0);
    expect(titles.join(" ")).toMatch(/Rust/);
  });

  test("matches every word, not the whole phrase", async ({ page }) => {
    await page.getByRole("button", { name: /Search posts and tags/ }).click();
    await page.getByRole("combobox", { name: "Search" }).fill("tailwind migration");
    await expect(page.getByRole("option", { name: /Tailwind v4/ })).toBeVisible();
  });

  test("Ctrl+K opens search", async ({ page }, testInfo) => {
    test.skip(isMobile(testInfo), "keyboard shortcut is desktop-only");
    await page.keyboard.press("Control+k");
    await expect(page.getByRole("combobox", { name: "Search" })).toBeFocused();
  });
});

test.describe("cards", () => {
  test("upvoting toggles the count", async ({ page }) => {
    const upvote = card(page, "So Reddit has decided").getByRole("button", { name: "Upvote" });
    await expect(upvote).toHaveText("73");
    await upvote.click();
    await expect(upvote).toHaveText("74");
    await expect(upvote).toHaveAttribute("aria-pressed", "true");
    await upvote.click();
    await expect(upvote).toHaveText("73");
  });

  test("bookmarks a post and finds it in Bookmarks", async ({ page }) => {
    await card(page, "Why your Git history is lying to you").getByRole("button", { name: "Bookmark" }).click();
    await expect(page.getByText("Added to bookmarks")).toBeVisible();

    await page.getByRole("button", { name: /^Bookmarks/ }).first().click();
    await expect(page.getByRole("heading", { name: "Bookmarks", level: 1 })).toBeVisible();
    await expect(card(page, "Why your Git history is lying to you")).toBeVisible();
  });

  test("hides a post with Not interested and restores it with Undo", async ({ page }) => {
    const title = "So Reddit has decided that plain HTML is unsafe";
    await card(page, title).getByRole("button", { name: "Post options" }).click();
    await page.getByRole("menuitem", { name: "Not interested" }).click();
    await expect(card(page, title)).toHaveCount(0);

    await page.getByRole("button", { name: "Undo" }).click();
    await expect(card(page, title)).toHaveCount(1);
  });

  test("votes in a poll and shows results", async ({ page }) => {
    const poll = card(page, "Which runtime are you starting");
    await poll.getByRole("button", { name: /^Bun/ }).click();
    await expect(poll.getByText("809 votes", { exact: false })).toBeVisible();
    await expect(poll.getByRole("button", { name: /^Bun/ })).toHaveAttribute("aria-pressed", "true");
  });

  test("shows reading-budget stickers that react to the budget", async ({ page }) => {
    await expect(page.getByText("Fits today").first()).toBeVisible();
    const overBefore = await page.getByText("Over budget").count();

    await page.getByRole("button", { name: "Feed settings" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Feed settings" });
    await dialog.getByRole("tab", { name: "Reading budget" }).click();
    await dialog.getByLabel(/Daily reading budget/).fill("15");
    await page.keyboard.press("Escape");

    expect(await page.getByText("Over budget").count()).toBeGreaterThan(overBefore);
  });
});

test.describe("settings", () => {
  test("follows a tag from Feed settings and it appears as a tab", async ({ page }) => {
    await page.getByRole("button", { name: "Feed settings" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Feed settings" });
    await dialog.getByRole("button", { name: "TypeScript" }).click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("tab", { name: "TypeScript" })).toBeAttached();
  });

  test("arrow keys move between feed tabs", async ({ page }) => {
    await page.getByRole("tab", { name: "For you" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Web Development", selected: true })).toBeFocused();
  });

  test("switches to list layout and remembers it after reload", async ({ page }) => {
    await page.getByRole("button", { name: "Feed settings" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Feed settings" });
    await dialog.getByRole("tab", { name: "Layout" }).click();
    await dialog.getByRole("button", { name: /^List/ }).click();
    await page.keyboard.press("Escape");
    await expect(page.locator("#feed-panel")).toHaveClass(/flex-col/);

    await page.reload();
    await expect(page.locator("#feed-panel")).toHaveClass(/flex-col/);
  });

  test("toggles dark mode from the profile menu", async ({ page }) => {
    await page.getByRole("button", { name: "Open profile menu" }).click();
    await page.getByRole("menuitem", { name: /Appearance/ }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
