import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5175";

const routes = [
  { path: "/", title: /Saad Barghouth/i },
  { path: "/about", title: /About Saad Barghouth/i },
  { path: "/skills", title: /GIS & Web GIS Skills/i },
  { path: "/projects", title: /GIS Projects/i },
  { path: "/gallery", title: /GIS Gallery/i },
  { path: "/experience", title: /GIS Experience/i },
  { path: "/process", title: /GIS Delivery Process/i },
  { path: "/testimonials", title: /GIS Testimonials/i },
  { path: "/contact", title: /Contact Saad Barghouth/i },
];

for (const route of routes) {
  test(`${route.path} exposes SEO metadata`, async ({ page }) => {
    await page.goto(`${BASE}${route.path}`, { waitUntil: "networkidle" });

    await expect(page).toHaveTitle(route.title);

    const metadata = await page.evaluate(() => {
      const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content ?? "";
      const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content ?? "";
      const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? "";
      const jsonLd = document.querySelector<HTMLScriptElement>('script[data-seo-json-ld="true"]')?.textContent ?? "";

      return { description, robots, canonical, jsonLd };
    });

    expect(metadata.description.length).toBeGreaterThan(70);
    expect(metadata.robots.toLowerCase()).toContain("index");
    expect(metadata.robots.toLowerCase()).not.toContain("noindex");
    expect(metadata.canonical).toBe(`https://barghouth.me${route.path}`);

    const parsedJsonLd = JSON.parse(metadata.jsonLd);
    expect(parsedJsonLd["@context"]).toBe("https://schema.org");
    expect(parsedJsonLd["@graph"].some((item: { "@type"?: string }) => item["@type"] === "Person")).toBe(true);
    expect(parsedJsonLd["@graph"].some((item: { "@type"?: string }) => item["@type"] === "ProfessionalService")).toBe(true);
  });
}
