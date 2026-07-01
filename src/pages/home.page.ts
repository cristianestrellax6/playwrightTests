import { Page, Locator } from '@playwright/test';

export class HomePage {
	readonly page: Page;
	private successNotice: Locator;

	readonly newProductsTab: Locator;
	readonly servicesTab: Locator;
	readonly apiKeysTab: Locator;
	readonly billingPlansTab: Locator;
	readonly paymentsTab: Locator;
	readonly blockLogsTab: Locator;
	readonly myOrdersTab: Locator;
	readonly myProfileTab: Locator;
	readonly askQuestionTab: Locator;

	constructor(page: Page) {
		this.page = page;
		// Adjust selectors as needed for the application under test
		this.successNotice = page.getByText('Signed in successfully.');

		this.newProductsTab = page.getByRole('link', { name: /New Products/i });
		this.servicesTab = page.getByRole('link', { name: /Services/i });
		this.apiKeysTab = page.getByRole('link', { name: /API Keys/i });
		this.billingPlansTab = page.getByRole('link', { name: /Billing Plans/i });
		this.paymentsTab = page.getByRole('link', { name: /Payments/i });
		this.blockLogsTab = page.getByRole('link', { name: /Block Logs/i });
		this.myOrdersTab = page.getByRole('link', { name: /My Orders/i });
		this.myProfileTab = page.getByRole('link', { name: /My profile/i, exact: false });
		this.askQuestionTab = page.getByRole('link', { name: /Ask a question/i });
	}

	async getSuccessText(): Promise<string> {
		return await this.successNotice.innerText();
	}

	async successVisible(): Promise<boolean> {
		return await this.successNotice.isVisible();
	}

	async clickTab(tabName: string): Promise<void> {
		const map: Record<string, Locator> = {
			'New Products': this.newProductsTab,
			Services: this.servicesTab,
			'API Keys': this.apiKeysTab,
			'Billing Plans': this.billingPlansTab,
			Payments: this.paymentsTab,
			'Block Logs': this.blockLogsTab,
			'My Orders': this.myOrdersTab,
			'My profile': this.myProfileTab,
			'Ask a question': this.askQuestionTab,
		};

		const locator = map[tabName];
		if (!locator) throw new Error(`Unknown tab: ${tabName}`);
		await locator.click();
	}
}
