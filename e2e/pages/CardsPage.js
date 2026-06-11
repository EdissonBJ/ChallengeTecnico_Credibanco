import { BasePage } from './BasePage'

// Encapsula la pantalla de tarjetas (/cards).
export class CardsPage extends BasePage {
  constructor(page) {
    super(page)
    this.cardNumberInput     = page.locator('input[name="cardNumber"]')
    this.cardholderNameInput = page.locator('input[name="cardholderName"]')
    this.expiryDateInput     = page.locator('input[name="expiryDate"]')
    this.cvvInput            = page.locator('input[name="cvv"]')
    this.enrollButton        = page.getByRole('button', { name: 'Enroll Card' })
    this.successMessage      = page.getByText('Card enrolled successfully!')
  }

  async open() {
    await this.goto('/cards')
  }

  // El último dígito del número define el resultado del pago posterior:
  //   ...0000 -> DECLINED | ...9999 -> FAILED | resto -> APPROVED
  async enrollCard(cardNumber, cardholderName = 'TEST USER', expiry = '12/2027', cvv = '123') {
    await this.open()
    await this.cardNumberInput.fill(cardNumber)
    await this.cardholderNameInput.fill(cardholderName)
    await this.expiryDateInput.fill(expiry)
    await this.cvvInput.fill(cvv)
    await this.enrollButton.click()
  }
}
