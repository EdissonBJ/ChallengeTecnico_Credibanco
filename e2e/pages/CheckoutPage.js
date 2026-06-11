import { BasePage } from './BasePage'

// Encapsula la pantalla de checkout y el resultado del pago (/checkout).
export class CheckoutPage extends BasePage {
  constructor(page) {
    super(page)
    this.payButton       = page.getByRole('button', { name: /Pay \$/ })
    this.approvedHeading = page.getByText('Payment Approved!')
    this.failedHeading   = page.getByText('Payment Failed')
  }

  async pay() {
    await this.payButton.click()
  }

  // Mensaje de estado de la transacción (statusMessage del backend).
  statusMessage(text) {
    return this.page.getByText(text)
  }
}
