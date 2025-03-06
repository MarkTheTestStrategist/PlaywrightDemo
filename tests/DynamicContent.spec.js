// @ts-nocheck
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
const { Navigate } = require('../pages/navigate');
const { assertTextVisibility } = require('../helpers/dynamicClick');
const { WaitForPageToLoad } = require('../helpers/pageLoadStates');
const { imageUrls } = require('../config/constants');

let navigator;

async function navigateAndWait(page) {
    await navigator.toDynamicContent();
    await WaitForPageToLoad;
}

test.describe('Test Demo using herokuapp test site.', () => {

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

        await navigateAndWait(page);
        await expect(page).toHaveTitle("The Internet");
    });

    test('Landing page has header text "Dynamic Content', async ({ page }) => {

        await navigateAndWait(page);
        await expect(page.getByRole('heading', { name: 'Dynamic Content', level: 3 })).toBeVisible();
    });

    test('Paragraph text visibility', async ({ page }) => {

        await navigateAndWait(page);
        await assertTextVisibility(page);
    });

    test('Three-table-row-images', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'description', description: 'Validate that each of three rows has an image & it is represented by a url' })

        await navigateAndWait(page);

        const images = await page.locator('#content .row img').all();

        console.log(`Found ${images.length} images`);

        expect(images.length).toBe(3);

        for (const image of images) {
            const src = await image.getAttribute('src');
            console.log(`Image found: ${src}`);

            const imageName = src.split('/').pop();
            const foundMatch = imageUrls.some(url => url.includes(imageName));

            expect(foundMatch).toBeTruthy();
        }
    });

    test('Validate-TableRow-Text-Entries', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'description', description: 'Grab the text from row three, click the link to refresh the entry and compare to ensure it is now different random text.' });

        await navigateAndWait(page);

        const oldText = await page.locator('.row').nth(5).innerText();
        await expect(page.locator('a', { hasText: "click here" })).toBeVisible();
        await page.locator('a[href="/dynamic_content?with_content=static"]').click();

        await WaitForPageToLoad;

        const newText = await page.locator('.row').nth(5).innerText();
        expect(newText).not.toEqual(oldText);
    });

    test('Powered-By', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'description', description: 'Validate powered by... is present.' })

        await navigateAndWait(page);

        await expect(page.locator('#page-footer')).toContainText('Powered by');
        await expect(page.getByText('Powered by')).toBeVisible();
        await expect(page.locator('a[href="http://elementalselenium.com/"]')).toContainText('Elemental Selenium')
    });

    test('Powered-By-link', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'description', description: 'Validate the link is present & correct for Elemental Selenium.' })

        await navigateAndWait(page);

        const seleniumLink = page.locator('a[href="http://elementalselenium.com/"]');
        await expect(seleniumLink).toBeVisible();

        const href = await seleniumLink.getAttribute('href');
        expect(href).toBe('http://elementalselenium.com/');
    });
});