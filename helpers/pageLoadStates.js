import { test, expect } from '@playwright/test';

module.exports = {
	async WaitForLoadStateToComplete(page) {
		await page.waitForLoadState('load');
		await page.waitForLoadState('networkidle');
	}
}