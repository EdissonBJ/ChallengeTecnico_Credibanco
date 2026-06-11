// Datos de prueba centralizados.

// Email único por corrida: H2 persiste el usuario mientras el backend
// siga arriba, así evitamos choques de "email ya registrado".
export function uniqueEmail() {
  return `test_${Date.now()}_${Math.floor(Math.random() * 10000)}@challenge.com`
}

export const DEFAULT_PASSWORD = 'secret123'

// Tarjetas de prueba: el último grupo de dígitos dispara cada escenario.
export const CARDS = {
  approved: '4111111111111111',
  declined: '4111111111110000',
  failed:   '4111111111119999',
}

// Mensajes esperados del backend (statusMessage por escenario).
export const MESSAGES = {
  approved: /approved successfully/i,
  declined: /declined by issuer/i,
  failed:   /processor temporarily unavailable/i,
}
