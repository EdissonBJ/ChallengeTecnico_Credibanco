import { BasePage } from './BasePage'

// Encapsula el dashboard / tienda (/dashboard).
export class DashboardPage extends BasePage {
  constructor(page) {
    super(page)
    this.heading      = page.getByText('Available Products')
    this.buyNowButton = page.getByRole('button', { name: 'Buy Now' })
    this.logoutButton = page.getByRole('button', { name: 'Logout' })
    this.cardsNavLink = page.getByRole('link', { name: 'My Cards' })
  }

  async open() {
    await this.goto('/dashboard')
  }

  async buyProduct() {
    await this.buyNowButton.click()
  }

  async logout() {
    await this.logoutButton.click()
  }
}
