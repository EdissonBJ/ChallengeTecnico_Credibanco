import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { paymentApi, cardApi } from '../services/api'
import Navbar from '../components/Navbar'

export default function CheckoutPage() {
  const { state }  = useLocation()
  const navigate   = useNavigate()

  const product     = state?.product
  const initialCards = state?.cards || []

  const [cards,     setCards]     = useState(initialCards)
  const [selectedCard, setSelectedCard] = useState(initialCards[0]?.id || '')
  const [result,    setResult]    = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-gray-500">No product selected.</p>
          <button onClick={() => navigate('/dashboard')} className="text-indigo-600 hover:underline text-sm">
            Back to Store
          </button>
        </div>
      </div>
    )
  }

  const handlePay = async () => {
    if (!selectedCard) { setError('Please select a card'); return }
    setLoading(true)
    setError('')
    try {
      const data = await paymentApi.process({ productId: product.id, creditCardId: Number(selectedCard) })
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Payment request failed')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    const approved = result.status === 'APPROVED'
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className={`text-5xl mb-4 ${approved ? 'text-green-500' : 'text-red-500'}`}>
            {approved ? '✓' : '✗'}
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${approved ? 'text-green-700' : 'text-red-700'}`}>
            {approved ? 'Payment Approved!' : 'Payment Failed'}
          </h2>
          <p className="text-gray-500 text-sm mb-6">{result.statusMessage}</p>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-left text-sm space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">Product</span>
              <span className="font-medium">{result.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold text-indigo-600">${result.amount} {result.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Card</span>
              <span>•••• {result.cardLastFour}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ref</span>
              <span className="font-mono text-xs">{result.transactionRef.slice(0, 16)}…</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition text-sm font-medium"
          >
            Back to Store
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-indigo-600 mb-4">
          ← Back
        </button>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">Checkout</h2>

          {/* Product summary */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
            )}
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{product.name}</p>
              <p className="text-indigo-600 font-bold">${product.price} {product.currency}</p>
            </div>
          </div>

          {/* Card selector */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pay with</label>
            {cards.length === 0 ? (
              <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3 rounded-lg">
                No cards enrolled.{' '}
                <button onClick={() => navigate('/cards')} className="font-medium underline">
                  Enroll one first
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {cards.map(card => (
                  <label key={card.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="card"
                      value={card.id}
                      checked={String(selectedCard) === String(card.id)}
                      onChange={(e) => setSelectedCard(e.target.value)}
                      className="accent-indigo-600"
                    />
                    <span className="text-sm">
                      <span className="font-mono">{card.cardBrand} •••• {card.lastFourDigits}</span>
                      <span className="text-gray-400 ml-2">{card.expiryDate}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={loading || cards.length === 0}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Processing payment...' : `Pay $${product.price} ${product.currency}`}
          </button>
        </div>
      </main>
    </div>
  )
}
