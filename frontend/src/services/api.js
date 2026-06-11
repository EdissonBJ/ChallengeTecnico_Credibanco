import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('payment_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('payment_token')
      localStorage.removeItem('payment_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data).then(r => r.data),
  login:    (data) => api.post('/auth/login',    data).then(r => r.data),
}

// ─── Products ────────────────────────────────────────────────────────────────
export const productApi = {
  getAll: () => api.get('/products').then(r => r.data),
}

// ─── Credit Cards ────────────────────────────────────────────────────────────
export const cardApi = {
  enroll:   (data) => api.post('/credit-cards/enroll', data).then(r => r.data),
  getCards: ()     => api.get('/credit-cards').then(r => r.data),
}

// ─── Payments ────────────────────────────────────────────────────────────────
export const paymentApi = {
  process: (data) => api.post('/payments/process', data).then(r => r.data),
}

export default api
