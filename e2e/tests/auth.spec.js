import { test, expect } from './fixtures'
import { uniqueEmail, DEFAULT_PASSWORD } from './testData'

test.describe('Autenticación', () => {

  test('happy path: registrar un usuario nuevo cae en el dashboard', async ({ loginPage, dashboardPage, page }) => {
    await loginPage.register('Test User', uniqueEmail(), DEFAULT_PASSWORD)

    await page.waitForURL('**/dashboard')
    await expect(dashboardPage.heading).toBeVisible()
  })

  test('fallo: registrar con un email ya existente muestra error', async ({ loginPage, dashboardPage, page }) => {
    const email = uniqueEmail()

    // primer registro OK
    await loginPage.register('Test User', email, DEFAULT_PASSWORD)
    await page.waitForURL('**/dashboard')

    // logout y reintento con el mismo email
    await dashboardPage.logout()
    await page.waitForURL('**/login')
    await loginPage.register('Dup User', email, DEFAULT_PASSWORD)

    await expect(page.getByText(/already registered/i)).toBeVisible()
    await expect(page).toHaveURL(/.*login/)
  })

  test('fallo: login con credenciales inválidas muestra error', async ({ loginPage, page }) => {
    await loginPage.login('nonexistent@challenge.com', 'wrongpassword')

    await expect(page.getByText(/invalid email or password/i)).toBeVisible()
  })

  test('fallo: ruta protegida sin sesión redirige a login', async ({ dashboardPage, page }) => {
    await dashboardPage.open()   // sin token
    await expect(page).toHaveURL(/.*login/)
  })

})
