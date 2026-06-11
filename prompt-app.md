# Prompt original — Challenge técnico

> Prompt utilizado para generar la aplicación full-stack del challenge.

---

Actúa como un arquitecto de software full-stack senior. Necesito que generes una aplicación completa con las siguientes características:

## REQUISITOS FUNCIONALES
- Sistema de login con JWT
- Catálogo con un producto para comprar
- Simulación de pago con tarjeta de crédito
- Permitir enrolar/registrar una tarjeta de crédito

## STACK TECNOLÓGICO
- **Backend:** Java 17, Spring Boot 3.2, Spring Security, JWT, Maven
- **Frontend:** React 18, Vite, React Router, Axios, TailwindCSS
- **Base de datos:** H2 (en memoria para desarrollo)
- **API:** RESTful con JSON

## ENTREGABLES

### 1. Estructura del proyecto backend (Spring Boot)
- Modelos: User, CreditCard, Product, Transaction
- Repositorios JPA
- Servicios con lógica de negocio
- Controladores REST
- Configuración de Spring Security + JWT
- Endpoints necesarios:
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/credit-cards/enroll
  - GET /api/products
  - POST /api/payments/process
- Data inicial con un producto de ejemplo
- application.yml configurado

### 2. Estructura del proyecto frontend (React)
- Componentes:
  - Login/Register
  - Dashboard con producto
  - Formulario de tarjeta de crédito
  - Simulador de pago
  - Protección de rutas
- Contexto de autenticación
- Servicios API con Axios
- Manejo de tokens JWT

### 3. Instrucciones detalladas
- Comandos exactos para crear y ejecutar cada proyecto
- Dependencias necesarias (pom.xml y package.json completos)
- Scripts de inicialización
- Pasos de validación y testing
- Solución de problemas comunes

## FORMATO DE RESPUESTA
Genera TODO el código archivo por archivo, indicando claramente la ruta donde debe ir cada uno, y después proporciona una guía paso a paso de instalación, ejecución y validación.
