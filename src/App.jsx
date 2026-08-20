import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Devices from './pages/Devices'
import Routers from './pages/Routers'
import AddRouter from './pages/AddRouter'
import RouterDetails from './pages/RouterDetails'
import Billing from './pages/Billing'
import AddBalance from './pages/AddBalance'
import PaymentCallback from './pages/PaymentCallback'
import Profile from './pages/Profile'
import Pricing from './pages/Pricing'
import Referrals from './pages/Referrals'
import Support from './pages/Support'
import SupportDetails from './pages/SupportDetails'
import Documents from './pages/Documents'
import AdminRouters from './pages/AdminRouters'
import AdminDevices from './pages/AdminDevices'
import AdminRouterDetails from './pages/AdminRouterDetails'
import AdminDashboard from './pages/AdminDashboard'
import AdminIncome from './pages/AdminIncome'
import AdminUsers from './pages/AdminUsers'
import AdminUserDetails from './pages/AdminUserDetails'
import AdminSupport from './pages/AdminSupport'
import AdminSupportDetails from './pages/AdminSupportDetails'
import AdminTransactions from './pages/AdminTransactions'
import AdminReferrals from './pages/AdminReferrals'
import AdminSettings from './pages/AdminSettings'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

function HomeRoute() {
  const { user, loading } = useAuth()
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  }
  if (!user) return <Home />
  return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />
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
            path="/devices"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Devices />} />
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
            <Route path="callback" element={<PaymentCallback />} />
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
            <Route path=":id" element={<SupportDetails />} />
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

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="income" element={<AdminIncome />} />
            <Route path="routers" element={<AdminRouters />} />
            <Route path="routers/:id" element={<AdminRouterDetails />} />
            <Route path="devices" element={<AdminDevices />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<AdminUserDetails />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="support/:id" element={<AdminSupportDetails />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="referrals" element={<AdminReferrals />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
