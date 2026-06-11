import { useState, useEffect } from 'react'
import { cardApi } from '../services/api'
import Navbar from '../components/Navbar'

const EMPTY_FORM = { cardNumber: '', cardholderName: '', expiryDate: '', cvv: '' }

function formatCardNumber(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function detectBrand(number) {
  const n = number.replace(/\s/g, '')
  if (n.startsWith('4')) return '💳 VISA'
  if (n.startsWith('5') || n.startsWith('2')) return '💳 MASTERCARD'
  if (n.startsWith('3')) return '💳 AMEX'
  return '💳'
}

export default function CardsPage() {
  const [cards,    setCards]    = useState([])
  const [form,     setForm]     = useState(EMPTY_FORM)
  const [loading,  setLoading]  = useState(false)
  const [fetching, setFetching] = useState(true)
  const [success,  setSuccess]  = useState('')
  const [error,    setError]    = useState('')

  useEffect(() => {
    cardApi.getCards()
      .then(setCards)
      .finally(() => setFetching(false))
  }, [])

  const handleChange = (e) => {
    let { name, value } = e.target
    if (name === 'cardNumber') value = formatCardNumber(value)
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '').slice(0, 6)
      if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2)
    }
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 4)
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const payload = {
        cardNumber:     form.cardNumber.replace(/\s/g, ''),
        cardholderName: form.cardholderName,
        expiryDate:     form.expiryDate,
        cvv:            form.cvv,
      }
      const newCard = await cardApi.enroll(payload)
      setCards(prev => [...prev, newCard])
      setForm(EMPTY_FORM)
      setSuccess('Card enrolled successfully!')
    } catch (err) {
      const data = err.response?.data
      if (data?.fieldErrors) {
        setError(Object.values(data.fieldErrors).join(', '))
      } else {
        setError(data?.message || 'Failed to enroll card')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* Enroll Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">Enroll New Card</h2>

          {success && (
            <div className="mb-4 bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg border border-green-200">
              ✓ {success}
            </div>
          )}
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number {form.cardNumber && <span className="text-indigo-500 ml-1">{detectBrand(form.cardNumber)}</span>}
              </label>
              <input
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleChange}
                placeholder="4111 1111 1111 1111"
                maxLength={19}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">💡 Tip: ending in 0000 = declined, 9999 = failed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input
                name="cardholderName"
                value={form.cardholderName}
                onChange={handleChange}
                placeholder="JANE DOE"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YYYY)</label>
                <input
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  placeholder="12/2027"
                  maxLength={7}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  name="cvv"
                  type="password"
                  value={form.cvv}
                  onChange={handleChange}
                  placeholder="•••"
                  maxLength={4}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? 'Enrolling...' : 'Enroll Card'}
            </button>
          </form>
        </div>

        {/* Card List */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">My Cards ({cards.length})</h3>
          {fetching ? (
            <p className="text-gray-400 text-sm">Loading cards...</p>
          ) : cards.length === 0 ? (
            <p className="text-gray-400 text-sm">No cards enrolled yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {cards.map(card => (
                <div
                  key={card.id}
                  className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-5 shadow"
                >
                  <div className="text-xs opacity-70 mb-3">{card.cardBrand}</div>
                  <div className="text-xl font-mono tracking-widest mb-3">
                    •••• •••• •••• {card.lastFourDigits}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{card.cardholderName}</span>
                    <span>{card.expiryDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
