// @ts-nocheck
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
const { Navigate } = require('../pages/navigate');
const { assertTextVisibility } = require('../helpers/dynamicClick');
const { WaitForPageToLoad } = require('../helpers/pageLoadStates');
const { imageUrls } = require('../utils/constants');

let navigator;

test.beforeEach(async ({ page }, testInfo) => {
    navigator = new Navigate(page);

    await page.context().tracing.start({
        title: `${testInfo.title}`,
        screenshots: true,
        snapshots: true,
        sources: true
    });
});

test.afterEach(async ({ page }, testInfo) => {
    const playwrightTraces = 'playwright-traces';
    const tracePath = path.join(
        process.cwd(),
        playwrightTraces,
        `${testInfo.title}.zip`
    );

    try {
        // Ensure trace directory exists
        if (!fs.existsSync(playwrightTraces)) {
            fs.mkdirSync(playwrightTraces, { recursive: true });
        }

        await page.context().tracing.stop({ path: tracePath });
        console.log(`Trace saved to ${tracePath}`);
    } catch (error) {
        console.error(`Failed to save trace: ${error.message}`);
    }
});

test('Landing page has title The Internet', async ({ page }) => {
    await navigator.toDynamicContent();
    await WaitForPageToLoad;
    await expect(page).toHaveTitle("The Internet");
});

test('Landing page has header text "Dynamic Content', async ({ page }) => {
    await navigator.toDynamicContent();
    await WaitForPageToLoad;
    await expect(page.getByRole('heading', { name: 'Dynamic Content', level: 3 })).toBeVisible();
});

test('Paragraph text visibility', async ({ page }) => {
    await navigator.toDynamicContent();
    await WaitForPageToLoad;
    await assertTextVisibility(page);
});

test('Three images are present', async ({ page }) => {
    await navigator.toDynamicContent();
    await WaitForPageToLoad;

    const images = await page.locator('#content .row img').all();

    console.log(`Found ${images.length} images`);

    expect(images.length).toBe(3);

    for (const image of images) {
        const src = await image.getAttribute('src');
        console.log(`Image found: ${src}`);

        expect(imageUrls).toContain(src);
    }
});