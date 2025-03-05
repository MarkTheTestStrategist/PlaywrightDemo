import { test, expect } from '@playwright/test';

module.exports = {
    async assertTextVisibility(page) {
        await expect(page.getByText('This example demonstrates the')).toBeVisible();
        await expect(page.getByText('To make some of the content')).toBeVisible();
        await expect(page.getByText('Accusantium eius ut architecto neque vel voluptatem vel nam eos minus ullam dolores voluptates enim sed voluptatem rerum qui sapiente nesciunt aspernatur et accusamus laboriosam culpa tenetur hic aut placeat error autem qui sunt.')).toBeVisible();
        await expect(page.getByText('Omnis fugiat porro vero quas tempora quis eveniet ab officia cupiditate culpa repellat debitis itaque possimus odit dolorum et iste quibusdam quis dicta autem sint vel quo vel consequuntur dolorem nihil neque sunt aperiam blanditiis.')).toBeVisible();
    }
};