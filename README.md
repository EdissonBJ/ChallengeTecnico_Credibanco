# Entrevista Técnica Credibanco — Suite de Automatización E2E

Automatización end-to-end de una aplicación de pagos full-stack, construida con
Playwright sobre el patrón Page Object Model. La suite valida el flujo
crítico de negocio —autenticación, enrolamiento de tarjeta y procesamiento de
pago— cubriendo happy paths y casos de fallo de forma determinística.

> La aplicación bajo prueba (backend Spring Boot + frontend React) se documenta
> al final, como contexto. El foco de este README es la **estrategia y
> arquitectura de pruebas**.

---

## Stack de automatización

| Componente | Tecnología | Rol |
|---|---|---|
| Runner / framework | Playwright Test | Orquestación, auto-waiting, assertions |
| Patrón de diseño | Page Object Model | Encapsulamiento de UI por pantalla |
| Inyección | Playwright Fixtures | Provisión de Page Objects por test |
| Navegador | Chromium | Ejecución headless / headed |
| Reportería | HTML + JSON + screenshots + video | Evidencia de ejecución |

---

## Arquitectura de pruebas

```
e2e/
├── pages/                  # Page Objects — un archivo por pantalla
│   ├── BasePage.js         # navegación y comportamiento común (herencia)
│   ├── LoginPage.js        # /login  → login + register
│   ├── DashboardPage.js    # /dashboard → tienda / producto
│   ├── CardsPage.js        # /cards  → enrolamiento de tarjeta
│   └── CheckoutPage.js     # /checkout → pago + pantalla de resultado
├── tests/
│   ├── fixtures.js         # inyecta las Page Objects en cada test
│   ├── testData.js         # emails, tarjetas y mensajes esperados
│   ├── auth.spec.js        # 4 escenarios de autenticación
│   └── payment.spec.js     # 3 escenarios de pago
└── playwright.config.js    # configuración + reportería
```

### Capas y responsabilidades

**1. Page Objects (`pages/`)** — Cada clase encapsula los locators y las acciones
de una pantalla. Los selectores viven en un único lugar: si la UI cambia, se
ajusta el Page Object, no los tests. Todas extienden `BasePage`, que centraliza
la navegación.

```js
// LoginPage.js — los locators son privados a la página
this.emailInput       = page.locator('input[name="email"]')
this.createAccountBtn = page.getByRole('button', { name: 'Create Account' })

async register(fullName, email, password) {
  await this.open()
  await this.switchToRegister()
  await this.fullNameInput.fill(fullName)
  // ...
}
```

**2. Fixtures (`tests/fixtures.js`)** — Extienden el `test` nativo de Playwright
para inyectar las Page Objects ya instanciadas. El test las recibe por
desestructuración, sin `new` repetido ni setup manual:

```js
test('happy path', async ({ loginPage, dashboardPage }) => {
  await loginPage.register('Test User', uniqueEmail(), DEFAULT_PASSWORD)
  await expect(dashboardPage.heading).toBeVisible()
})
```

**3. Test data (`tests/testData.js`)** — Datos de prueba y oráculos
centralizados: tarjetas por escenario, generación de emails únicos y los
mensajes esperados del backend. Separar el dato del test mantiene los specs
declarativos y facilita el escalado a data-driven.

### Por qué estas decisiones

| Decisión | Razón |
|---|---|
| **Page Object Model** | Mantenibilidad: un cambio de UI impacta un solo archivo. Escala a suites grandes sin duplicar selectores. |
| **Fixtures de Playwright** | Inyección de dependencias nativa; elimina boilerplate de instanciación y garantiza una instancia limpia por test. |
| **Datos centralizados** | Oráculos y datos en un solo punto; base para parametrizar (data-driven) sin tocar la lógica. |
| **Ejecución en serie** (`workers: 1`) | El backend usa H2 in-memory (estado compartido). La serialización elimina interferencia entre tests y hace la suite determinística. |
| **Email único por test** | Aislamiento de datos: cada caso crea su propio usuario, evitando colisiones de estado entre corridas mientras el backend siga arriba. |

---

## Matriz de escenarios

7 casos: 2 happy path + 5 de fallo. Cobertura de las rutas críticas de negocio
y de los caminos de error.

| # | Suite | Escenario | Tipo | Validación |
|---|---|---|---|---|
| 1 | auth | Registro de usuario nuevo | Happy | Redirección a `/dashboard` + producto visible |
| 2 | auth | Registro con email duplicado | Fallo | Mensaje de error + permanece en `/login` |
| 3 | auth | Login con credenciales inválidas | Fallo | Mensaje "Invalid email or password" |
| 4 | auth | Ruta protegida sin sesión | Fallo | Redirección automática a `/login` |
| 5 | payment | E2E completo → APPROVED | Happy | Registro → tarjeta → compra → pago aprobado |
| 6 | payment | Tarjeta `...0000` → DECLINED | Fallo | Estado DECLINED + mensaje del issuer |
| 7 | payment | Tarjeta `...9999` → FAILED | Fallo | Estado FAILED + error de procesador |

### Diseño de casos: simulación determinística

El backend simula el resultado del pago según los **últimos 4 dígitos** de la
tarjeta enrolada. Esto permite ejercitar los tres estados de transacción de
forma 100% reproducible, sin mocks ni dependencias externas:

| Tarjeta termina en | Resultado | Caso que cubre |
|---|---|---|
| `0000` | DECLINED | Rechazo por el banco emisor |
| `9999` | FAILED | Fallo del procesador de pagos |
| cualquier otro | APPROVED | Pago exitoso |

El test #5 recorre el **flujo de negocio completo** (registro → enrolamiento →
compra → confirmación), que es el caso de mayor valor: valida la integración
real entre las cuatro pantallas y los seis endpoints en una sola corrida.

---

## Defecto encontrado durante la automatización

La automatización no solo verificó comportamiento esperado: **detectó un defecto
real** en el frontend.

**Síntoma:** al registrar un email duplicado, la API respondía con el error
correcto pero la pantalla no mostraba ningún mensaje.

**Causa raíz:** el manejo del `catch` en `LoginPage.jsx` tenía un problema de
precedencia de operadores que terminaba ejecutando `setError("")` con string
vacío; el cuadro de error nunca se renderizaba.

**Cómo se detectó:** el test #2 (email duplicado) falló esperando el mensaje de
error visible — evidencia automatizada del defecto.

**Corrección:** se reescribió la lógica para priorizar `fieldErrors` sobre
`message` de forma explícita. El test pasó tras el fix, confirmando la
resolución.

Este es el valor diferencial de la automatización bien diseñada: un caso de
fallo no es solo "verde", es un **detector de regresiones y defectos reales**.

---

## Ejecución

### Setup (una vez)

```bash
cd e2e
npm install
npx playwright install chromium
```

### Correr — requiere la app levantada (3 terminales)

```bash
# Terminal 1 — backend
cd ../backend && mvn spring-boot:run      # espera "Started PaymentApplication"

# Terminal 2 — frontend
cd ../frontend && npm install && npm run dev   # espera "Local: http://localhost:5173"

# Terminal 3 — suite E2E
cd e2e && npm test
```

### Modos de ejecución

| Comando | Uso |
|---|---|
| `npm test` | Headless + reporte HTML/JSON |
| `npm run test:headed` | Navegador visible (observar la ejecución) |
| `npm run test:ui` | Modo interactivo de Playwright (debug visual paso a paso) |
| `npm run report` | Abrir el reporte HTML de la última corrida |

---

## Reportes y evidencia

Tras `npm test` se generan automáticamente:

- **`playwright-report/`** — reporte HTML navegable: resultado por test, pasos,
  tiempos y errores. Es la evidencia principal de ejecución.
- **`test-results/results.json`** — resultado estructurado en JSON, parseable
  para CI o dashboards.
- **Screenshots y video** — solo de los tests que fallen (`only-on-failure` /
  `retain-on-failure`), para diagnóstico rápido sin ruido.
- **Trace** — en reintentos, para inspección detallada del DOM y la red.

---

## Cómo escalar la suite

Decisiones de arquitectura que dejan la base lista para crecer:

- **Data-driven**: `testData.js` ya aísla los datos; parametrizar escenarios
  (p. ej. múltiples tarjetas inválidas) es directo con `for...of` sobre datasets.
- **Cross-browser**: agregar Firefox y WebKit en `projects` de la config.
- **Capa de API**: combinar setup vía API (registro/login por request) con
  validación por UI, para acelerar la preparación de estado.
- **CI/CD**: el reporte JSON y el exit code se integran a un pipeline; Playwright
  trae acción oficial para GitHub Actions.
- **Visual / accesibilidad**: Playwright soporta snapshots visuales y checks de
  a11y como extensión natural de esta base.

---

## Apéndice — Aplicación bajo prueba

### Stack

| Capa | Tecnologías |
|---|---|
| Backend | Java 17, Spring Boot 3.2, Spring Security + JWT, JPA, H2 (in-memory), Maven |
| Frontend | React 18, Vite, React Router, Axios, TailwindCSS |

### Endpoints

| Método | Ruta | Auth |
|---|---|---|
| POST | `/api/auth/register` | — |
| POST | `/api/auth/login` | — |
| GET | `/api/products` | JWT |
| POST | `/api/credit-cards/enroll` | JWT |
| GET | `/api/credit-cards` | JWT |
| POST | `/api/payments/process` | JWT |

### Notas de la app relevantes para testing

- **Sin usuarios por defecto**: cada test crea el suyo vía UI (registro
  auto-loguea). El producto se siembra al arrancar el backend.
- **BD efímera**: `ddl-auto: create-drop` — reiniciar el backend limpia el
  estado y resiembra el producto. Útil para correr la suite desde cero.
- **JWT stateless**: el token se guarda en `localStorage`; las rutas protegidas
  se validan en el frontend (PrivateRoute) y en el backend (filtro JWT).
- **Backend test**: `cd backend && mvn test` corre una prueba de integración de
  auth con MockMvc (complementa la cobertura E2E a nivel de API).
