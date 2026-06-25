import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:5175';

const devices = [
  { name: 'iPhone-SE', width: 320, height: 568 },
  { name: 'Small-Android', width: 360, height: 780 },
  { name: 'iPhone-14', width: 390, height: 844 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 900 },
];

const routes = [
  { name: 'home', path: '/', anchor: '#hero' },
  { name: 'about', path: '/about', anchor: '#about' },
  { name: 'skills', path: '/skills', anchor: '#skills' },
  { name: 'projects', path: '/projects', anchor: '#projects' },
  { name: 'gallery', path: '/gallery', anchor: '#gallery' },
  { name: 'experience', path: '/experience', anchor: '#experience' },
  { name: 'process', path: '/process', anchor: '#process' },
  { name: 'testimonials', path: '/testimonials', anchor: '#testimonials' },
  { name: 'contact', path: '/contact', anchor: '#contact' },
];

function routeUrl(path: string) {
  return `${BASE}${path}`;
}

async function expectNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    viewportWidth: window.innerWidth,
  }));

  expect(metrics.documentWidth, 'document overflow').toBeLessThanOrEqual(metrics.viewportWidth + 2);
  expect(metrics.bodyWidth, 'body overflow').toBeLessThanOrEqual(metrics.viewportWidth + 2);
}

async function expectElementsFitViewport(page: Page, selector: string) {
  const overflowing = await page.locator(selector).evaluateAll((elements) =>
    elements
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          id: el.id || el.getAttribute('data-testid') || el.className || el.tagName.toLowerCase(),
          left: rect.left,
          right: rect.right,
          width: rect.width,
          viewport: window.innerWidth,
        };
      })
      .filter((item) => item.width > 0 && (item.left < -2 || item.right > item.viewport + 2))
  );

  expect(overflowing).toEqual([]);
}

async function expectMobileNavButtonFits(page: Page) {
  const button = page.locator('button[aria-controls="mobile-nav"]');
  await expect(button).toBeVisible();

  const rect = await button.evaluate((el) => {
    const box = el.getBoundingClientRect();
    return {
      left: box.left,
      right: box.right,
      top: box.top,
      bottom: box.bottom,
      width: box.width,
      height: box.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  });

  expect(rect.width).toBeGreaterThanOrEqual(40);
  expect(rect.height).toBeGreaterThanOrEqual(40);
  expect(rect.left).toBeGreaterThanOrEqual(0);
  expect(rect.right).toBeLessThanOrEqual(rect.viewportWidth);
  expect(rect.top).toBeGreaterThanOrEqual(0);
  expect(rect.bottom).toBeLessThanOrEqual(rect.viewportHeight);
}

async function expectMainCardsFit(page: Page, routeName: string) {
  const selectorsByRoute: Record<string, string> = {
    about: '#about .mobile-compact-card, #about .highlight-card',
    skills: '#skills .skill-category-card, #skills button',
    projects: '#projects .project-card, #projects [data-testid="projects-grid"]',
    gallery: '#gallery .mobile-compact-card',
    experience: '#experience .mobile-compact-card',
    process: '#process .step-item, #process-details .mobile-compact-card',
    testimonials: '#testimonials .mobile-compact-card',
    contact: '#contact .contact-link-card, #contact form, #contact input, #contact textarea',
    home: '#hero, #home-overview .mobile-compact-card, #home-focus .mobile-compact-card',
  };

  const selector = selectorsByRoute[routeName];
  if (selector) {
    await expectElementsFitViewport(page, selector);
  }
}

for (const device of devices) {
  test.describe(`${device.name} ${device.width}x${device.height}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: device.width, height: device.height });
    });

    for (const route of routes) {
      test(`${route.name} has no horizontal overflow`, async ({ page }) => {
        await page.goto(routeUrl(route.path), { waitUntil: 'networkidle' });
        await expect(page.locator(route.anchor)).toBeVisible({ timeout: 5000 });

        await expectNoHorizontalOverflow(page);
        await expectElementsFitViewport(page, 'nav, main, main section');
        await expectMainCardsFit(page, route.name);

        if (device.width < 1024) {
          await expectMobileNavButtonFits(page);
        }
      });
    }

    if (device.width < 1024) {
      test('mobile nav opens and links remain reachable', async ({ page }) => {
        await page.goto(BASE, { waitUntil: 'networkidle' });

        const button = page.locator('button[aria-controls="mobile-nav"]');
        await expectMobileNavButtonFits(page);
        await button.click();

        const mobileNav = page.locator('#mobile-nav');
        await expect(mobileNav).toBeVisible();
        await expect(mobileNav.locator('a', { hasText: 'Skills' })).toBeVisible();
        await expect(mobileNav.locator('a', { hasText: 'Contact' })).toBeVisible();
        await expectElementsFitViewport(page, '#mobile-nav, #mobile-nav a, #mobile-nav button');
        await expectNoHorizontalOverflow(page);
      });
    }
  });
}
