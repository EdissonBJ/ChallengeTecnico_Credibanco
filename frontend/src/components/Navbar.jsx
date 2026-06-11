import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/dashboard" className="text-lg font-bold text-indigo-600">
        PayChallenge
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/dashboard"   className="text-sm text-gray-600 hover:text-indigo-600">Store</Link>
        <Link to="/cards"       className="text-sm text-gray-600 hover:text-indigo-600">My Cards</Link>
        <span className="text-sm text-gray-500">Hi, {user?.fullName?.split(' ')[0]}</span>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
