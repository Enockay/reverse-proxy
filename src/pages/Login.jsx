import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { Mail, Lock, Loader, ArrowRight, Shield, ShieldAlert, ShieldCheck, Sparkles, Users, Router, LineChart, Zap, Headphones } from 'lucide-react'

// True when this login should present the admin-flavored screen: reached via
// /admin/login directly, bounced here from a protected /admin/* route, or
// loaded from the admin subdomain itself.
function useIsAdminLogin(location) {
  if (location.pathname.startsWith('/admin/login')) return true
  if (location.state?.from?.pathname?.startsWith('/admin')) return true
  if (typeof window !== 'undefined' && /^(www\.)?admin\./.test(window.location.hostname)) return true
  return false
}

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const VERIFICATION_ERROR_MESSAGES = {
    missing_token: 'That verification link is missing its token. Please use the link from your email.',
    invalid_token: 'That verification link is invalid or has expired. Please request a new one after logging in.',
    server_error: 'Something went wrong verifying your email. Please try the link again.'
  }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdminLogin = useIsAdminLogin(location)
  // Set when the backend redirects here after an email-verification link
  // click (routes/auth.js's GET /api/auth/verify-email) - the visitor isn't
  // necessarily authenticated in this browser context (the link is typically
  // opened from an email client, which may be a different session than the
  // one that signed up), so this can't rely on the /verify-email page's own
  // auth-gated polling view.
  const searchParams = new URLSearchParams(location.search)
  const justVerified = searchParams.get('verified') === '1'
  const verificationError = searchParams.get('verification_error')
  const verificationErrorMessage = verificationError
    ? (VERIFICATION_ERROR_MESSAGES[verificationError] || 'We couldn\'t verify your email. Please try the link again.')
    : ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        if (result.user && result.user.role === 'admin') {
          navigate(location.state?.from?.pathname || '/admin')
        } else if (isAdminLogin) {
          // Non-admin credentials used on the admin screen - the login call
          // already stored a valid session, so tear it down rather than
          // leaving them silently authenticated on an error screen.
          logout()
          setError('This account does not have admin access.')
        } else if (result.user && !result.user.emailVerified) {
          // Check if email is verified, redirect accordingly
          navigate('/verify-email')
        } else {
          // Fetch latest user data to ensure we have emailVerified status
          try {
            const userResponse = await api.get('/api/auth/me')
            if (userResponse.data.user && !userResponse.data.user.emailVerified) {
              navigate('/verify-email')
            } else {
              navigate('/dashboard')
            }
          } catch (error) {
            // If we can't fetch user, proceed to dashboard (will be checked by ProtectedRoute)
            navigate('/dashboard')
          }
        }
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  if (isAdminLogin) {
    const features = [
      { icon: Users, label: 'User accounts & access control' },
      { icon: Router, label: 'MikroTik router fleet & connectivity' },
      { icon: LineChart, label: 'Income, subscriptions & support' }
    ]

    return (
      <div className="min-h-screen flex bg-white">
        {/* Branding panel */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '22px 22px' }}
          />
          <div className="absolute -top-32 -left-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between p-12 w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">Blackie Networks</span>
            </div>

            <div>
              <span className="inline-block px-3 py-1 mb-5 text-[11px] font-semibold tracking-wider text-cyan-300 bg-cyan-400/10 border border-cyan-400/30 rounded-full uppercase">
                Admin Portal
              </span>
              <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                Run the platform<br />from one place.
              </h1>
              <p className="text-blue-200 text-sm mb-8 max-w-sm">
                Manage users, MikroTik routers, billing, and support without leaving the console.
              </p>

              <div className="space-y-3">
                {features.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 text-sm text-blue-100">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-blue-400/60">© 2026 Blackie Networks. All rights reserved.</p>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white">
          <div className="w-full max-w-sm">
            {/* Mobile-only compact header */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-2xl shadow-lg shadow-blue-900/30 mb-4">
                <ShieldAlert className="w-8 h-8 text-white" />
              </div>
              <span className="inline-block px-2.5 py-0.5 mb-2 text-[10px] font-semibold tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-full uppercase">
                Admin Portal
              </span>
              <h1 className="text-2xl font-bold text-gray-900">Blackie Networks</h1>
            </div>

            <div className="hidden lg:block mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
              <p className="text-sm text-gray-500 mt-1.5">Enter your admin credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {justVerified && !error && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 text-sm">
                  <span className="mr-2">✅</span>
                  <span>Email verified successfully! You can now log in.</span>
                </div>
              )}

              {(error || verificationErrorMessage) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
                  <span className="mr-2">⚠️</span>
                  <span>{error || verificationErrorMessage}</span>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                    placeholder="Enter your admin email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-medium rounded-lg hover:from-cyan-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Admin
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            <p className="lg:hidden mt-8 text-center text-xs text-gray-400">
              Restricted access. Admin accounts only.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const loginFeatures = [
    { icon: Shield, title: 'Secure Access', text: 'Your data is protected with industry-leading security.' },
    { icon: Zap, title: 'Fast & Reliable', text: 'Experience seamless performance and 99.9% uptime.' },
    { icon: Headphones, title: '24/7 Support', text: 'Our team is always here to help you succeed.' }
  ]

  return (
    <div className="min-h-screen flex bg-white">
      {/* Branding panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="absolute top-10 -right-10 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 font-bold text-lg">Blackie Networks</span>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-5 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Secure. Reliable. Always.
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">Welcome back!</h1>
            <p className="text-gray-600 text-base mb-10 max-w-sm">
              Sign in to your account and continue managing your network with ease.
            </p>

            {/* Illustration */}
            <div className="relative h-56 flex items-center justify-center mb-10">
              <div className="absolute w-40 h-40 bg-gradient-to-br from-indigo-200/60 to-purple-200/60 rounded-full blur-2xl" />
              <div className="absolute left-2 top-4 w-16 h-20 bg-white/80 rounded-xl shadow-md flex items-center justify-center -rotate-[8deg]">
                <Lock className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="absolute right-2 top-10 w-16 h-20 bg-white/80 rounded-xl shadow-md flex items-center justify-center rotate-[8deg]">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="relative w-28 h-28 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-xl shadow-indigo-600/30 flex items-center justify-center">
                <ShieldCheck className="w-14 h-14 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {loginFeatures.map(({ icon: Icon, title, text }) => (
                <div key={title}>
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400">© 2026 Blackie Networks. All rights reserved.</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-600/20 mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {justVerified && !error && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 text-sm">
                  <span className="mr-2">✅</span>
                  <span>Email verified successfully! You can now log in.</span>
                </div>
              )}

              {(error || verificationErrorMessage) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
                  <span className="mr-2">⚠️</span>
                  <span>{error || verificationErrorMessage}</span>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">© 2026 Blackie Networks. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
