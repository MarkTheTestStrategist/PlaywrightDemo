// @ts-check
import { test, expect } from '@playwright/test';

test('has title Dynamic Content', async ({ page }) => {
	await page.goto("https://the-internet.herokuapp.com/dynamic_content?with_content=static");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Dynamic Content");
});

//test('get started link', async ({ page }) => {
//  await page.goto('https://playwright.dev/');

//  // Click the get started link.
//  await page.getByRole('link', { name: 'Get started' }).click();

//  // Expects page to have a heading with the name of Installation.
//  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
//   });