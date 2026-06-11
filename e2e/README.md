# E2E Tests — Playwright + Page Object Model

Suite end-to-end que valida el flujo completo por la UI: registro, login,
enrolamiento de tarjeta y pago (approved / declined / failed).
Arquitectura: **Page Object Model (POM)** con fixtures y datos centralizados.

## Estructura

```
e2e/
├── pages/                  # Page Objects (un archivo por pantalla)
│   ├── BasePage.js         # comportamiento común
│   ├── LoginPage.js        # /login (login + register)
│   ├── DashboardPage.js    # /dashboard (tienda)
│   ├── CardsPage.js        # /cards (enrolar tarjeta)
│   └── CheckoutPage.js     # /checkout (pago + resultado)
├── tests/
│   ├── fixtures.js         # inyecta las Page Objects en cada test
│   ├── testData.js         # emails, tarjetas y mensajes esperados
│   ├── auth.spec.js        # 4 casos de autenticación
│   └── payment.spec.js     # 3 casos de pago
└── playwright.config.js
```

## Cobertura (7 casos)

| Spec | Caso | Tipo |
|---|---|---|
| auth | Registrar usuario nuevo → dashboard | happy |
| auth | Email duplicado → error | fallo |
| auth | Credenciales inválidas → error | fallo |
| auth | Ruta protegida sin sesión → redirect login | fallo |
| payment | Registro → tarjeta → compra → APPROVED | happy E2E |
| payment | Tarjeta `...0000` → DECLINED | fallo |
| payment | Tarjeta `...9999` → FAILED | fallo |

## Setup (una sola vez)

```bash
cd e2e
npm install
npx playwright install chromium
```

## Correr — 3 terminales

```bash
# Terminal 1 — backend
cd ../backend && mvn spring-boot:run     # espera "Started PaymentApplication"

# Terminal 2 — frontend
cd ../frontend && npm run dev            # espera "Local: http://localhost:5173"

# Terminal 3 — tests
cd e2e && npm test
```

Otros modos:
```bash
npm run test:headed   # ver el navegador en vivo
npm run test:ui       # modo interactivo (debug visual)
npm run report        # abrir el reporte HTML de la última corrida
```

## Reportes generados

Tras `npm test` se generan en `e2e/`:
- `playwright-report/` — reporte HTML navegable (ábrelo con `npm run report`)
- `test-results/results.json` — resultado en JSON (para adjuntar/parsear)
- screenshots y video solo de los tests que fallen

## Notas técnicas

- Tests en **serie** (`workers: 1`): H2 en memoria es estado compartido.
- Cada test usa **email único** (timestamp) para no chocar con registros previos.
- Reiniciar el backend limpia la BD (`ddl-auto: create-drop`) y resiembra el producto.

## Requisito previo (frontend)

El spec de "email duplicado" y el de "credenciales inválidas" verifican el
texto de error en pantalla. Asegúrate de tener aplicado el fix del `catch` en
`frontend/src/pages/LoginPage.jsx` (manejo correcto de `message` vs `fieldErrors`),
o esos dos casos fallarán porque el error no se renderiza.
