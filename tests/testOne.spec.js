// @ts-nocheck
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
const { Navigate } = require('../pages/navigate');
const { assertTextVisibility } = require('../helpers/dynamicClick');
const { WaitForPageToLoad } = require('../helpers/pageLoadStates');

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

    // Ensure trace directory exists
    if (!fs.existsSync(playwrightTraces)) {
        fs.mkdirSync(playwrightTraces, { recursive: true });
    }

    await page.context().tracing.stop({ path: tracePath });
});

test('Landing page has title The Internet', async ({ page }) => {
    await navigator.toDynamicContent();
    await expect(page).toHaveTitle("The Internet");
});

test('Landing page has header text "Dynamic Content', async ({ page }) => {
    await navigator.toDynamicContent();
    await expect(page.getByRole('heading', { name: 'Dynamic Content', level: 3 })).toBeVisible();
});

test('Paragraph text visiblity', async ({ page }) => {
    await navigator.toDynamicContent();
    await assertTextVisibility(page);
});

test('Three images are present', async ({ page }) => {
    await navigator.toDynamicContent();
    await WaitForPageToLoad;
    await expect(page.getByRole('img', { src = "/img/avatars/Original-Facebook-Geek-Profile-Avatar-7.jpg" }).nth(1)).toBeVisible();
    await expect(page.getByRole('img', { src = "https://the-internet.herokuapp.com/img/avatars/Original-Facebook-Geek-Profile-Avatar-7.jpg"}).nth(2)).toBeVisible();
    await expect(page.getByRole('img', {src = ""}).nth(3)).toBeVisible();
});

test('Images have correct urls', async ({ page }) => {
    await navigator.toDynamicContent();
    await page.locator('img[src="/img/avatars/Original-Facebook-Geek-Profile-Avatar-7.jpg"]').toBeVisible;
    await expect(page).toHaveURL('/img/avatars/Original-Facebook-Geek-Profile-Avatar-7.jpg');
});