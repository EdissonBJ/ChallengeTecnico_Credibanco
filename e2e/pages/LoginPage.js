import { BasePage } from './BasePage'

// Encapsula la pantalla de Login / Register (/login).
export class LoginPage extends BasePage {
  constructor(page) {
    super(page)
    // Locators centralizados: si cambia la UI, se ajusta solo aquí.
    this.fullNameInput     = page.locator('input[name="fullName"]')
    this.emailInput        = page.locator('input[name="email"]')
    this.passwordInput     = page.locator('input[name="password"]')
    this.signInButton      = page.getByRole('button', { name: 'Sign In' })
    this.createAccountBtn  = page.getByRole('button', { name: 'Create Account' })
    this.toggleToRegister  = page.getByRole('button', { name: 'Register' })
    this.errorBox          = page.locator('.bg-red-50')
  }

  async open() {
    await this.goto('/login')
  }

  async switchToRegister() {
    await this.toggleToRegister.click()
  }

  // Registra un usuario nuevo. El registro auto-loguea en el backend.
  async register(fullName, email, password) {
    await this.open()
    await this.switchToRegister()
    await this.fullNameInput.fill(fullName)
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.createAccountBtn.click()
  }

  async login(email, password) {
    await this.open()
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.signInButton.click()
  }

  async getErrorText() {
    return this.errorBox.textContent()
  }
}
