import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const CASE = "/work/explainable-anomaly-detection/";
const NOTE = "/notes/what-a-shap-value-says/";

test("home states identity, proof and a next step", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("models that explain their own alarms");
  await expect(page.getByRole("link", { name: "Explain a flag" }).first()).toBeVisible();
  await expect(page.getByText("0.9873")).toBeVisible();
  await expect(page).toHaveTitle(/Sahil Tagala/);
});

test("navigation reaches every section and the case study", async ({ page }) => {
  await page.goto("/");
  for (const id of ["background", "work", "flag", "notes", "contact"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  await page.getByRole("link", { name: "Read the case study" }).click();
  await expect(page).toHaveURL(new RegExp(CASE));
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Explainable anomaly detection");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${CASE}$`));
});

test("picking a reading changes the explanation", async ({ page }) => {
  await page.goto("/#flag");
  await expect(page.getByRole("heading", { name: /Minute 52/ })).toBeVisible();
  await page.getByRole("radio", { name: /Minute 78/ }).check();
  await expect(page.getByRole("heading", { name: /Minute 78.*not flagged/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Minute 52/ })).toBeHidden();
});

test("the explainer works from the keyboard", async ({ page }) => {
  await page.goto("/#flag");
  await page.getByRole("radio", { name: /Minute 52/ }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("heading", { name: /Minute 40/ })).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("heading", { name: /Minute 24/ })).toBeVisible();
});

test("unknown addresses get the custom 404", async ({ page }) => {
  const res = await page.goto("/nope/");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("isn't part of the session");
});

test("external links are labelled and safe", async ({ page }) => {
  await page.goto("/");
  const external = page.locator('a[href^="http"]:not([href*="localhost"])');
  for (const a of await external.all()) {
    await expect(a).toHaveAttribute("rel", /noopener/);
    expect((await a.innerText()).trim().length).toBeGreaterThan(5);
  }
});

test("no sideways scroll at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const url of ["/", CASE, "/playground/", NOTE]) {
    await page.goto(url);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, url).toBeLessThanOrEqual(0);
  }
});

test("content and the explainer work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Minute 52/ })).toBeVisible();
  await page.getByRole("radio", { name: /Minute 24/ }).check();
  await expect(page.getByRole("heading", { name: /Minute 24/ })).toBeVisible();
  await context.close();
});

for (const scheme of ["light", "dark"] as const) {
  test(`no accessibility violations (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    for (const url of ["/", CASE, "/playground/", "/notes/", NOTE, "/nope/"]) {
      await page.goto(url);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(results.violations.map((v) => `${url} ${v.id}: ${v.nodes[0]?.html}`)).toEqual([]);
    }
  });
}

test("metadata, sitemap and robots exist", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Dublin/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og\.png/);
  expect((await request.get("/sitemap.xml")).ok()).toBe(true);
  expect((await request.get("/robots.txt")).ok()).toBe(true);
  expect((await request.get("/og.png")).ok()).toBe(true);
});

test("split demo: switching strategy changes the verdict", async ({ page }) => {
  await page.goto("/playground/#split");
  await expect(page.getByText("The two sets disagree.")).toBeVisible();
  await page.getByRole("radio", { name: "Split by date within each garage" }).check();
  await expect(page.getByText("The two sets match.")).toBeVisible();
  await expect(page.getByText("The two sets disagree.")).toBeHidden();
});

test("roaming demo: only NEVER while unreachable is refused", async ({ page }) => {
  await page.goto("/playground/#roaming");
  await expect(page.getByText("✕ Charging refused")).toBeVisible();
  await page.getByRole("radio", { name: "ALLOWED_OFFLINE" }).check();
  await expect(page.getByText("✓ Charging starts").filter({ visible: true })).toBeVisible();
  await page.getByRole("radio", { name: "NEVER" }).check();
  await page.getByRole("radio", { name: "Provider reachable" }).check();
  await expect(page.getByText("the provider, with a live answer.").filter({ visible: true })).toBeVisible();
});

test("notes list, note page and its demo link", async ({ page }) => {
  await page.goto("/notes/");
  await page.getByRole("link", { name: "What a SHAP value says, and what it doesn't" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("What a SHAP value says");
  await page.getByRole("link", { name: "Explain a flag yourself" }).click();
  await expect(page).toHaveURL(/\/playground\/#flag$/);
});

test("palette: opens by shortcut, filters, navigates, and returns focus on Escape", async ({ page }) => {
  await page.goto("/");
  const opener = page.getByRole("button", { name: /Jump to/ });
  await opener.click();
  const box = page.getByRole("combobox");
  await expect(box).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(opener).toBeFocused();

  await page.keyboard.press("Control+k");
  await box.fill("zzzz");
  await expect(page.getByText(/Nothing matches/)).toBeVisible();
  await box.fill("split");
  await expect(page.getByRole("option")).toHaveCount(1);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/playground\/#split$/);
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("palette has no accessibility violations while open", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Jump to/ }).click();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes[0]?.html}`)).toEqual([]);
});

test.describe("contact form (requests are intercepted, nothing is sent)", () => {
  async function fill(page: import("@playwright/test").Page) {
    await page.goto("/#contact");
    await page.getByLabel("Your name").fill("Test Person");
    await page.getByLabel("Your email").fill("test@example.com");
    await page.getByLabel("Message").fill("Hello, this is a test message.");
  }

  test("success clears the form and says so", async ({ page }) => {
    let calls = 0;
    await page.route("https://formspree.io/**", (route) => { calls++; return route.fulfill({ status: 200, json: { ok: true } }); });
    await fill(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText(/Message sent/)).toBeVisible();
    await expect(page.getByLabel("Message")).toHaveValue("");
    expect(calls).toBe(1);
  });

  test("a server error is shown and the message is kept", async ({ page }) => {
    await page.route("https://formspree.io/**", (route) => route.fulfill({ status: 500, json: {} }));
    await fill(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText(/was not sent \(error 500\)/)).toBeVisible();
    await expect(page.getByLabel("Message")).toHaveValue("Hello, this is a test message.");
  });

  test("rate limiting and network failure each get their own message", async ({ page }) => {
    await page.route("https://formspree.io/**", (route) => route.fulfill({ status: 429, json: {} }));
    await fill(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText(/Too many messages/)).toBeVisible();
    await page.unroute("https://formspree.io/**");
    await page.route("https://formspree.io/**", (route) => route.abort());
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText(/could not be sent/)).toBeVisible();
  });

  test("empty required fields are blocked by the browser", async ({ page }) => {
    let calls = 0;
    await page.route("https://formspree.io/**", (route) => { calls++; return route.fulfill({ status: 200, json: {} }); });
    await page.goto("/#contact");
    await page.getByRole("button", { name: "Send message" }).click();
    expect(calls).toBe(0);
    await expect(page.getByText(/Message sent/)).toBeHidden();
  });
});
