import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

function VerifyEmail() {
  const { user, logout, isAuthenticated, loading } = useAuth()
  const [resending, setResending] = useState(false)
  const [checking, setChecking] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Redirect to dashboard if already verified
  if (user && user.emailVerified) {
    return <Navigate to="/dashboard" replace />
  }

  const handleResendVerification = async () => {
    setError('')
    setMessage('')
    setResending(true)

    try {
      const response = await api.post('/api/auth/resend-verification')
      if (response.data.success) {
        setMessage('Verification email sent! Please check your inbox.')
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to resend verification email')
    } finally {
      setResending(false)
    }
  }

  const handleCheckVerification = async () => {
    setError('')
    setMessage('')
    setChecking(true)

    try {
      // Refresh user data to check if verified
      const response = await api.get('/api/auth/me')
      if (response.data.user?.emailVerified) {
        setMessage('Email verified! Redirecting to dashboard...')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      } else {
        setMessage('Email not yet verified. Please check your inbox and click the verification link.')
      }
    } catch (error) {
      console.error('Failed to check verification:', error)
      setError('Failed to check verification status. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  // Auto-check verification status periodically (silent, no spinner)
  useEffect(() => {
    if (user && !user.emailVerified) {
      const autoCheck = async () => {
        try {
          const response = await api.get('/api/auth/me')
          if (response.data.user?.emailVerified) {
            setMessage('Email verified! Redirecting to dashboard...')
            setTimeout(() => {
              window.location.href = '/dashboard'
            }, 2000)
          }
        } catch (error) {
          // Silent fail for auto-check
          console.error('Auto-check verification failed:', error)
        }
      }
      
      const interval = setInterval(autoCheck, 5000) // Check every 5 seconds
      return () => clearInterval(interval)
    }
  }, [user])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a verification email to
            </p>
            <p className="text-gray-900 font-medium mt-1">{user?.email}</p>
          </div>

          {message && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">What to do next:</h3>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the verification link in the email</li>
                <li>You'll be automatically redirected to the dashboard</li>
              </ol>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleResendVerification}
                disabled={resending || checking}
                className="flex-1 btn btn-primary flex items-center justify-center"
              >
                {resending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Resend Email
                  </>
                )}
              </button>
              <button
                onClick={handleCheckVerification}
                disabled={checking || resending}
                className="flex-1 btn btn-secondary flex items-center justify-center"
              >
                {checking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600 mr-2"></div>
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Check Status
                  </>
                )}
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={logout}
                className="w-full text-sm text-gray-600 hover:text-gray-800"
              >
                Sign out and use a different account
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
