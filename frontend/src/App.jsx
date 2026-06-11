import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import LoginPage    from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CardsPage    from './pages/CardsPage'
import CheckoutPage from './pages/CheckoutPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/cards"     element={<PrivateRoute><CardsPage /></PrivateRoute>} />
          <Route path="/checkout"  element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
          <Route path="*"          element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
