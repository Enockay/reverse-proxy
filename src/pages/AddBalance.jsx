import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { ArrowLeft, Wallet, CreditCard, Loader } from 'lucide-react'

function AddBalance() {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('paystack')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/api/billing/add-balance', {
        amount: parseFloat(amount),
        paymentMethod
      })

      if (response.data.success) {
        setProcessing(true)
        // In production, redirect to payment gateway
        // For now, simulate payment processing
        setTimeout(() => {
          alert(`Payment initiated. In production, you would be redirected to ${paymentMethod === 'paystack' ? 'PayStack' : 'PayPal'}`)
          navigate('/billing')
        }, 2000)
      }
    } catch (error) {
      console.error('Failed to add balance:', error)
      setError(error.response?.data?.error || 'Failed to initiate payment')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/billing')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Add Balance</h1>
          <p className="text-xs text-gray-600 mt-1">Add funds to your account using PayPal or PayStack</p>
        </div>
      </div>

      {processing ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Loader className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Processing Payment</h3>
          <p className="text-xs text-gray-600">Redirecting to payment gateway...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Amount to Add
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Minimum amount: $0.01</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'paystack' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paystack"
                    checked={paymentMethod === 'paystack'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">PayStack</div>
                      <div className="text-xs text-gray-500">Secure payment via PayStack</div>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'paypal' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">PayPal</div>
                      <div className="text-xs text-gray-500">Pay securely with PayPal</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Amount</span>
                <span className="text-sm font-semibold text-gray-900">${parseFloat(amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Processing Fee</span>
                <span className="text-sm font-semibold text-gray-900">$0.00</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-900">Total</span>
                <span className="text-sm font-bold text-gray-900">${parseFloat(amount || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate('/billing')}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !amount || parseFloat(amount) <= 0}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Proceed to Payment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default AddBalance
