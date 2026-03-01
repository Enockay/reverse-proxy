import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { 
  Router, 
  Loader, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle, 
  Info,
  DollarSign,
  Calendar,
  FileText,
  Shield
} from 'lucide-react'

function AddRouter() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    notes: '',
    location: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [billingInfo, setBillingInfo] = useState(null)
  const [loadingBilling, setLoadingBilling] = useState(true)

  useEffect(() => {
    fetchBillingInfo()
  }, [])

  const fetchBillingInfo = async () => {
    try {
      const response = await api.get('/api/billing/summary')
      if (response.data.success) {
        // Map the response to match expected structure
        const summary = response.data.summary || response.data.billing
        setBillingInfo({
          ...summary,
          balance: summary.userBalance || summary.balance || 0,
          isFirstRouter: summary.isFirstRouter !== undefined 
            ? summary.isFirstRouter 
            : (summary.totalRouters === 0 || summary.totalRouters === undefined)
        })
      }
    } catch (error) {
      console.error('Failed to fetch billing info:', error)
      // On error, assume first router to allow creation (better UX)
      setBillingInfo({ balance: 0, isFirstRouter: true, totalRouters: 0 })
    } finally {
      setLoadingBilling(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/api/routers', {
        name: formData.name,
        notes: formData.notes || `${formData.description ? formData.description + ' | ' : ''}Location: ${formData.location || 'Not specified'}`
      })

      if (response.data.success) {
        navigate('/routers')
      }
    } catch (error) {
      // Extract detailed error message
      const errorMessage = error.response?.data?.error || 'Failed to create router'
      const errorDetails = error.response?.data?.details
      
      // Format error message with details if available
      let fullErrorMessage = errorMessage
      if (errorDetails) {
        fullErrorMessage = `${errorMessage}\n\nDetails: ${errorDetails}`
      }
      
      // Check for specific error types
      if (errorMessage.includes('Insufficient balance')) {
        fullErrorMessage = `${errorMessage}\n\nPlease add balance to your account to create additional routers.`
      } else if (errorMessage.includes('verify your email')) {
        fullErrorMessage = `${errorMessage}\n\nPlease verify your email address before creating routers.`
      }
      
      setError(fullErrorMessage)
    } finally {
      setLoading(false)
    }
  }

  const isFirstRouter = billingInfo?.isFirstRouter || false
  const hasBalance = billingInfo?.balance >= 1 || false
  const canCreate = isFirstRouter || hasBalance

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/routers')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Add New Router</h1>
            <p className="text-xs text-gray-600 mt-1">Create a new MikroTik router configuration</p>
          </div>
        </div>
      </div>

      {/* Billing Info Card */}
      {!loadingBilling && billingInfo && (
        <div className={`bg-white rounded-lg shadow-sm border p-4 ${
          canCreate ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-start space-x-3">
            {canCreate ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {isFirstRouter ? 'Free Trial Available' : 'Billing Information'}
              </h3>
              <div className="space-y-1 text-xs text-gray-700">
                {isFirstRouter ? (
                  <div>
                    <p className="mb-2">Your first router is <strong>free for 7 days</strong>! After the trial expires, you'll be charged $1/month per router.</p>
                    <div className="bg-white rounded p-2 border border-green-300">
                      <div className="flex items-center justify-between mb-1">
                        <span>Trial Period:</span>
                        <span className="font-semibold">7 days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>After Trial:</span>
                        <span className="font-semibold">$1.00/month</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Current Balance:
                      </span>
                      <span className="font-semibold">${billingInfo.balance?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Router Cost:</span>
                      <span className="font-semibold">$1.00/month</span>
                    </div>
                    {!hasBalance && (
                      <p className="text-red-600 font-medium mt-2">
                        Insufficient balance. Please add funds to create a router.
                      </p>
                    )}
                  </>
                )}
              </div>
              {!hasBalance && !isFirstRouter && (
                <button
                  onClick={() => navigate('/billing/add-balance')}
                  className="mt-3 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Balance
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 mb-1">Error Creating Router</h3>
              <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Router Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Router Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Router className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="e.g., Office Router, Home Router"
                required
                maxLength={50}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">A unique name to identify this router</p>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                placeholder="e.g., New York Office, Home Network"
                maxLength={100}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Physical location or network location of this router</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all resize-none"
                placeholder="Additional details about this router (optional)"
                maxLength={500}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Internal Notes
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <Info className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all resize-none"
                placeholder="Internal notes for your reference (optional)"
                maxLength={300}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Private notes that won't be shared with the router configuration
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-xs text-blue-800">
                <p className="font-semibold mb-1">What happens next?</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>A WireGuard configuration will be generated for this router</li>
                  <li>Unique ports will be allocated for Winbox, SSH, and API access</li>
                  <li>You'll receive an email with connection details</li>
                  <li>Once connected, you can access the router via the allocated ports</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Disabled Reason */}
          {(!canCreate || !formData.name.trim()) && !loading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-yellow-900 mb-1">Cannot Create Router</h3>
                  <ul className="space-y-1 text-xs text-yellow-800">
                    {!formData.name.trim() && (
                      <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>Router name is required</span>
                      </li>
                    )}
                    {!canCreate && !isFirstRouter && !hasBalance && (
                      <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>Insufficient balance. Required: $1.00, Available: ${billingInfo?.balance?.toFixed(2) || '0.00'}</span>
                      </li>
                    )}
                    {loadingBilling && (
                      <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span>Checking billing information...</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/routers')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {!canCreate && !isFirstRouter && !hasBalance ? (
              <button
                type="button"
                onClick={() => navigate('/billing/add-balance')}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all flex items-center"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Recharge Account
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !canCreate || !formData.name.trim()}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center relative"
                title={
                  !formData.name.trim()
                    ? 'Router name is required'
                    : loadingBilling
                    ? 'Checking billing information...'
                    : loading
                    ? 'Creating router...'
                    : ''
                }
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Router className="w-4 h-4 mr-2" />
                    Create Router
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRouter
