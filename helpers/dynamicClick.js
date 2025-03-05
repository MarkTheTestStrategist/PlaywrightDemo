import { test, expect } from '@playwright/test';

module.exports = {
    async assertTextVisibility(page) {
        await expect(page.getByText('This example demonstrates the')).toBeVisible();
        await expect(page.getByText('To make some of the content')).toBeVisible();
        await expect(page.getByText('Accusantium eius ut')).toBeVisible();
        await expect(page.getByText('Omnis fugiat porro vero quas')).toBeVisible();
    }
};