import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',

  // Sequential: el backend usa H2 en memoria (estado compartido),
  // correr en serie evita interferencia entre tests.
  fullyParallel: false,
  workers: 1,
  retries: 0,

  // Reporte HTML (no se auto-abre) + lista en consola + JSON para el correo.
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

})
