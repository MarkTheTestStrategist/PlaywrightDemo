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

    test('Landing-page-title', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'description', description: 'The landing page has the tab title "The Internet"' })

        await navigateAndWait(page);
        await expect(page).toHaveTitle("The Internet");
    });

    test('Landing-page-header', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'description', description: 'The landing page has the header 3 title "Dynamic Content"' })

        await navigateAndWait(page);
        await expect(page.getByRole('heading', { name: 'Dynamic Content', level: 3 })).toBeVisible();
    });

    test('Paragraph-text-visibility', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'description', description: 'Validates that the text on the page and that the first two rows have the same text each time.' })

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

    test('Get-long-text-and-refresh', async ({ page }, testInfo) => {
        testInfo.annotations.push({ type: 'description', description: 'Locate third row, get long text, refresh, then verify new text.' });

        await navigateAndWait(page);

        let oldText = '';
        let rowElement;

        while (true) {
            rowElement = page.locator('.row').nth(5);
            oldText = await rowElement.innerText();
            if (oldText.length > 50) {
                console.log(`Found long text: ${oldText}`);
                break;
            } else {
                await page.reload();
                await WaitForPageToLoad;
            }
        }

        await expect(page.locator('a', { hasText: "click here" })).toBeVisible();
        await page.locator('a[href="/dynamic_content?with_content=static"]').click();

        await WaitForPageToLoad;

        const newText = await page.locator('.row').nth(5).innerText();
        expect(newText).not.toEqual(oldText);
        console.log(`New Text: ${newText}`);
    });
});