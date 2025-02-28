const urls = require('../config/urlLibrary');

class Navigate {
    constructor(page) {
        this.page = page;
    }

    async toDynamicContent() {
        await this.page.goto(urls.baseUrl);
    }

    async toDashboardPage() {
        await this.page.goto(urls.dashboard);
    }

    async toSettingsPage() {
        await this.page.goto(urls.settings);
    }
}

module.exports = { Navigate };