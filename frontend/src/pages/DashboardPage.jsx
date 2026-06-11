import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productApi, cardApi } from '../services/api'
import Navbar from '../components/Navbar'

export default function DashboardPage() {
  const [products, setProducts] = useState([])
  const [cards,    setCards]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([productApi.getAll(), cardApi.getCards()])
      .then(([prods, cds]) => { setProducts(prods); setCards(cds) })
      .catch(() => setError('Failed to load store data'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Available Products</h2>
          {cards.length === 0 && (
            <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
              ⚠️ Enroll a card to purchase
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                  <span className="text-indigo-600 font-bold text-xl ml-3">
                    ${product.price} <span className="text-sm font-normal">{product.currency}</span>
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{product.description}</p>
                <button
                  onClick={() => navigate('/checkout', { state: { product, cards } })}
                  disabled={!product.available}
                  className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
