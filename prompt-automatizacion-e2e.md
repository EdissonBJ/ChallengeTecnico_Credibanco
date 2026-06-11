# Prompt estructurado — Generación de automatización E2E

> Prompt reutilizable para generar una suite de automatización end-to-end con
> Playwright sobre el patrón Page Object Model, incluyendo casos happy path y de
> fallo. Diseñado para ser aplicado sobre la aplicación de pagos del challenge,
> pero adaptable a cualquier app web con autenticación + flujo transaccional.

---

## ROL

Actúa como un **QA Automation Engineer senior**. Tu objetivo es construir una
suite de automatización E2E mantenible, escalable y orientada a detectar
defectos reales, no solo a confirmar el happy path.

## CONTEXTO — Aplicación bajo prueba

Aplicación full-stack de pagos:

- **Frontend:** React 18 + Vite + React Router + Axios + TailwindCSS (corre en `http://localhost:5173`)
- **Backend:** Java 17 + Spring Boot 3.2 + Spring Security + JWT + H2 in-memory (corre en `http://localhost:8080`)
- **Autenticación:** JWT almacenado en `localStorage`; el registro auto-loguea al usuario.
- **Flujo de negocio:** registro/login → enrolar tarjeta → comprar producto → procesar pago.
- **Simulación de pago determinística:** el resultado depende de los últimos 4 dígitos de la tarjeta enrolada:
  - termina en `0000` → **DECLINED**
  - termina en `9999` → **FAILED**
  - cualquier otro → **APPROVED**

### Pantallas y rutas

| Ruta | Pantalla | Elementos clave |
|---|---|---|
| `/login` | Login + Register (toggle) | inputs `fullName`, `email`, `password`; botones `Sign In`, `Create Account`, `Register` |
| `/dashboard` | Tienda con producto | botón `Buy Now`, `Logout`, link `My Cards`, texto `Available Products` |
| `/cards` | Enrolamiento de tarjeta | inputs `cardNumber`, `cardholderName`, `expiryDate`, `cvv`; botón `Enroll Card`; mensaje `Card enrolled successfully!` |
| `/checkout` | Pago + resultado | botón `Pay $...`; resultado `Payment Approved!` / `Payment Failed` + statusMessage |

## STACK DE AUTOMATIZACIÓN

- **Framework:** Playwright Test (JavaScript, ES Modules)
- **Patrón:** Page Object Model con herencia (`BasePage`)
- **Inyección:** Playwright Fixtures (provisión de Page Objects por test)
- **Datos:** centralizados en un módulo aparte (emails únicos, tarjetas, mensajes esperados)
- **Navegador:** Chromium

## ARQUITECTURA REQUERIDA

```
e2e/
├── pages/
│   ├── BasePage.js         # navegación y comportamiento común
│   ├── LoginPage.js        # /login
│   ├── DashboardPage.js    # /dashboard
│   ├── CardsPage.js        # /cards
│   └── CheckoutPage.js     # /checkout
├── tests/
│   ├── fixtures.js         # extiende `test` e inyecta las Page Objects
│   ├── testData.js         # emails únicos, tarjetas, mensajes esperados
│   ├── auth.spec.js        # escenarios de autenticación
│   └── payment.spec.js     # escenarios de pago
├── playwright.config.js
├── package.json
└── README.md
```

### Reglas de diseño

1. **Page Objects:** cada clase encapsula los locators y las acciones de su
   pantalla. Sin selectores hardcodeados en los specs. Todas extienden `BasePage`.
2. **Fixtures:** los specs reciben las Page Objects por desestructuración
   (`async ({ loginPage, cardsPage }) => {...}`), sin `new` manual.
3. **Test data:** tarjetas por escenario, generación de email único por corrida
   (timestamp, para evitar colisiones con H2), y mensajes esperados como oráculos.
4. **Ejecución en serie** (`workers: 1`): el backend usa estado compartido (H2
   in-memory); la serialización garantiza determinismo.
5. **Reportería:** HTML (`open: 'never'`) + lista en consola + JSON en
   `test-results/results.json`. Screenshot y video solo en fallo.

## CASOS DE PRUEBA A GENERAR

### auth.spec.js
| # | Escenario | Tipo | Validación |
|---|---|---|---|
| 1 | Registrar usuario nuevo | Happy | Redirige a `/dashboard` y muestra `Available Products` |
| 2 | Registrar con email duplicado | Fallo | Muestra error `already registered`, permanece en `/login` |
| 3 | Login con credenciales inválidas | Fallo | Muestra error `invalid email or password` |
| 4 | Acceder a ruta protegida sin sesión | Fallo | Redirige a `/login` |

### payment.spec.js
| # | Escenario | Tipo | Validación |
|---|---|---|---|
| 5 | E2E: registro → tarjeta → compra → APPROVED | Happy | Muestra `Payment Approved!` + `approved successfully` |
| 6 | Tarjeta `...0000` → DECLINED | Fallo | Muestra `Payment Failed` + `declined by issuer` |
| 7 | Tarjeta `...9999` → FAILED | Fallo | Muestra `Payment Failed` + `processor temporarily unavailable` |

## ENTREGABLES

1. Todos los archivos de la arquitectura, generados **archivo por archivo** con
   su ruta exacta.
2. `package.json` con scripts: `test`, `test:headed`, `test:ui`, `report`.
3. `playwright.config.js` con la reportería y la ejecución en serie configuradas.
4. `README.md` con: estructura, matriz de cobertura, comandos de setup y
   ejecución (incluyendo que backend y frontend deben estar levantados), y
   descripción de los reportes generados.

## REQUISITOS DE CALIDAD

- Locators robustos: preferir `getByRole` y selectores por `name` antes que
  clases CSS frágiles.
- Aprovechar el **auto-waiting** de Playwright; no usar `waitForTimeout` fijos.
- Comentarios concisos solo donde aporten contexto (p. ej. la lógica de las
  tarjetas de prueba).
- Si la automatización revela un defecto en la aplicación (p. ej. un mensaje de
  error que no se renderiza), **repórtalo explícitamente** con: síntoma, causa
  raíz y corrección sugerida. La suite debe servir para detectar defectos, no
  solo para confirmar el happy path.

## FORMATO DE RESPUESTA

Genera el código de cada archivo indicando su ruta, y al final una guía de
ejecución paso a paso (3 terminales: backend, frontend, suite E2E).
