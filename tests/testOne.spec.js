// @ts-nocheck
import { test, expect } from '@playwright/test';

const { gotoDynamicContentPage } = require('./pages/navigate');
const { performClicks } = require('../helpers/dynamicClick'); 

test('Landing page has title Dynamic Content', async ({ page }) => {

	await gotoDynamicContentPage(page);
	await expect(page).to("Dynamic Content");
});


test('Paragraph texts change except for the first paragraph', async ({ page }) => {

	await gotoDynamicContentPage(page);
	await performClicks(page);
});