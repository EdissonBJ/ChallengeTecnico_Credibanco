import { test as base } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { CardsPage } from '../pages/CardsPage'
import { CheckoutPage } from '../pages/CheckoutPage'

// Extiende el `test` de Playwright para inyectar las Page Objects ya
// instanciadas. Cada test las recibe por desestructuración:
//   test('...', async ({ loginPage, dashboardPage }) => { ... })
export const test = base.extend({
  loginPage:     async ({ page }, use) => { await use(new LoginPage(page)) },
  dashboardPage: async ({ page }, use) => { await use(new DashboardPage(page)) },
  cardsPage:     async ({ page }, use) => { await use(new CardsPage(page)) },
  checkoutPage:  async ({ page }, use) => { await use(new CheckoutPage(page)) },
})

export { expect } from '@playwright/test'
