import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Routers from './pages/Routers'
import AddRouter from './pages/AddRouter'
import RouterDetails from './pages/RouterDetails'
import Billing from './pages/Billing'
import AddBalance from './pages/AddBalance'
import Profile from './pages/Profile'
import Pricing from './pages/Pricing'
import Referrals from './pages/Referrals'
import Support from './pages/Support'
import Documents from './pages/Documents'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

function HomeRoute() {
  const { user, loading } = useAuth()
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  }
  return user ? <Navigate to="/dashboard" replace /> : <Home />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
          </Route>
          <Route
            path="/routers"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Routers />} />
            <Route path="add" element={<AddRouter />} />
            <Route path=":id" element={<RouterDetails />} />
          </Route>
          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Billing />} />
            <Route path="add-balance" element={<AddBalance />} />
          </Route>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Profile />} />
          </Route>
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Pricing />} />
          </Route>
          <Route
            path="/referrals"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Referrals />} />
          </Route>
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Support />} />
          </Route>
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Documents />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
