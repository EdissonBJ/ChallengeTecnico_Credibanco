import { test, expect } from './fixtures'
import { uniqueEmail, DEFAULT_PASSWORD, CARDS, MESSAGES } from './testData'

test.describe('Flujo de pago', () => {

  // Helper local: deja al usuario logueado con una tarjeta enrolada y en checkout.
  async function setupAndCheckout({ loginPage, cardsPage, dashboardPage, page }, cardNumber) {
    await loginPage.register('Test User', uniqueEmail(), DEFAULT_PASSWORD)
    await page.waitForURL('**/dashboard')

    await cardsPage.enrollCard(cardNumber)
    await expect(cardsPage.successMessage).toBeVisible()

    await dashboardPage.open()
    await dashboardPage.buyProduct()
    await page.waitForURL('**/checkout')
  }

  test('happy path E2E: registrar → enrolar tarjeta → comprar → APPROVED', async ({ loginPage, cardsPage, dashboardPage, checkoutPage, page }) => {
    await setupAndCheckout({ loginPage, cardsPage, dashboardPage, page }, CARDS.approved)
    await checkoutPage.pay()

    await expect(checkoutPage.approvedHeading).toBeVisible()
    await expect(checkoutPage.statusMessage(MESSAGES.approved)).toBeVisible()
  })

  test('fallo: tarjeta terminada en 0000 → DECLINED', async ({ loginPage, cardsPage, dashboardPage, checkoutPage, page }) => {
    await setupAndCheckout({ loginPage, cardsPage, dashboardPage, page }, CARDS.declined)
    await checkoutPage.pay()

    await expect(checkoutPage.failedHeading).toBeVisible()
    await expect(checkoutPage.statusMessage(MESSAGES.declined)).toBeVisible()
  })

  test('fallo: tarjeta terminada en 9999 → FAILED (error del procesador)', async ({ loginPage, cardsPage, dashboardPage, checkoutPage, page }) => {
    await setupAndCheckout({ loginPage, cardsPage, dashboardPage, page }, CARDS.failed)
    await checkoutPage.pay()

    await expect(checkoutPage.failedHeading).toBeVisible()
    await expect(checkoutPage.statusMessage(MESSAGES.failed)).toBeVisible()
  })

})
