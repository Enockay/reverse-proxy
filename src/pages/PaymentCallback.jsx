import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { Loader, CheckCircle, XCircle, ArrowRight } from 'lucide-react'

function PaymentCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('checking') // checking | success | pending | failed
  const [amount, setAmount] = useState(null)
  const [error, setError] = useState('')

  const reference = searchParams.get('reference') || searchParams.get('trxref')

  useEffect(() => {
    if (!reference) {
      setStatus('failed')
      setError('No payment reference found')
      return
    }
    verify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference])

  const verify = async () => {
    try {
      const response = await api.get(`/api/billing/verify/${reference}`)
      if (response.data.status === 'completed') {
        setStatus('success')
        setAmount(response.data.amount)
      } else if (response.data.status === 'pending') {
        setStatus('pending')
      } else {
        setStatus('failed')
      }
    } catch (err) {
      setStatus('failed')
      setError(err.response?.data?.error || 'Failed to verify payment')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center max-w-sm w-full">
        {status === 'checking' && (
          <>
            <Loader className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Verifying Payment</h3>
            <p className="text-xs text-gray-600">Please wait while we confirm your payment...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment Successful</h3>
            <p className="text-xs text-gray-600 mb-6">
              {amount ? `$${amount.toFixed(2)} has been added to your balance.` : 'Your balance has been updated.'}
            </p>
            <button
              onClick={() => navigate('/billing')}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              Go to Billing
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </>
        )}
        {status === 'pending' && (
          <>
            <Loader className="w-12 h-12 text-amber-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment Still Processing</h3>
            <p className="text-xs text-gray-600 mb-6">This can take a moment. Refresh this page or check your billing history shortly.</p>
            <button
              onClick={verify}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Check Again
            </button>
          </>
        )}
        {status === 'failed' && (
          <>
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment Not Completed</h3>
            <p className="text-xs text-gray-600 mb-6">{error || 'Your payment could not be confirmed.'}</p>
            <button
              onClick={() => navigate('/billing/add-balance')}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentCallback
