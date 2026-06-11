// BasePage: comportamiento común a todas las páginas.
// Las demás Page Objects extienden de esta.
export class BasePage {
  constructor(page) {
    this.page = page
  }

  async goto(path) {
    await this.page.goto(path)
  }

  async currentUrl() {
    return this.page.url()
  }
}
