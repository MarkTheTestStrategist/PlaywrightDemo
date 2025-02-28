// @ts-nocheck
import { test, expect } from '@playwright/test';
const { Navigate } = require('../pages/navigate');
const { performClicks } = require('../helpers/dynamicClick');

let navigator; // Declare outside tests

test.beforeEach(async ({ page }) => {
    navigator = new Navigate(page); // Instantiate before each test
});

test('Landing page has title The Internet', async ({ page }) => {
    await navigator.toDynamicContent();
    await expect(page).toHaveTitle("The Internet");
});

test('Landing page has header text "Dynamic Content', async ({ page }) => {
    await navigator.toDynamicContent();
    await expect(page.getByRole('heading', { name: 'Dynamic Content', level: 3 })).toBeVisible();
});

test('Paragraph texts change except for the first paragraph', async ({ page }) => {
    await navigator.toDashboardPage();
    await performClicks(page);
});
