import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard,
  Router,
  Laptop,
  Users,
  LifeBuoy,
  Receipt,
  Wallet,
  Share2,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown as ChevronDownIcon,
  ShieldAlert
} from 'lucide-react'
import { useState } from 'react'

// Dedicated shell for /admin/* - intentionally does not share navigation
// with the customer Layout.
const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Routers', href: '/admin/routers', icon: Router },
  { name: 'Devices', href: '/admin/devices', icon: Laptop },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Income', href: '/admin/income', icon: Wallet },
  { name: 'Transactions', href: '/admin/transactions', icon: Receipt },
  { name: 'Referrals', href: '/admin/referrals', icon: Share2 },
  { name: 'Support', href: '/admin/support', icon: LifeBuoy },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const isActive = (path, exact) => location.pathname === path || (!exact && location.pathname.startsWith(path + '/'))

  const renderNavLinks = (onNavigate) => adminNavigation.map((item) => {
    const Icon = item.icon
    const active = isActive(item.href, item.exact)
    return (
      <Link
        key={item.name}
        to={item.href}
        onClick={onNavigate}
        className={`flex items-center px-3 py-2.5 rounded-lg transition-all text-sm ${
          active
            ? 'bg-gradient-to-r from-cyan-600/80 to-blue-700/80 text-white shadow-lg'
            : 'text-blue-200 hover:bg-blue-800/40 hover:text-white'
        }`}
      >
        <Icon className="w-4 h-4 mr-3" />
        <span>{item.name}</span>
      </Link>
    )
  })

  const sidebarContent = (onNavigate) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-16 px-6 border-b border-blue-800/30 bg-gradient-to-r from-cyan-700/30 via-blue-700/30 to-indigo-700/30 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-700 rounded flex items-center justify-center shadow-lg">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white drop-shadow-sm">Admin Portal</h1>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden text-blue-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 py-3 bg-blue-900/40">
        <p className="text-xs text-cyan-200 uppercase tracking-wider font-semibold">Administration</p>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {renderNavLinks(onNavigate)}

        <button
          onClick={() => {
            logout()
            onNavigate?.()
          }}
          className="w-full flex items-center px-3 py-2.5 rounded-lg transition-all text-sm text-violet-200 hover:bg-red-600/20 hover:text-red-300 border border-transparent hover:border-red-600/30 mt-4"
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span>Logout</span>
        </button>
      </nav>

      <div className="p-4 border-t border-blue-800/30 bg-blue-900/30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-blue-300 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 shadow-2xl border-r border-blue-800/30 -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out">
        {sidebarContent()}
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 shadow-2xl border-r border-blue-800/30" onClick={(e) => e.stopPropagation()}>
            {sidebarContent(() => setMobileMenuOpen(false))}
          </div>
        </>
      )}

      {/* Main content */}
      <div className="lg:pl-64 min-h-screen">
        {/* Top bar */}
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 h-14 flex items-center justify-between px-3 sm:px-4 lg:px-6 shadow-sm">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-full uppercase">
              Admin
            </span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-1 sm:space-x-2 hover:bg-gray-50 rounded-lg px-1 sm:px-2 py-1 transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-700" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 hidden lg:block">{user?.name || 'Admin'}</span>
                <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-xs font-medium text-gray-900">{user?.name || 'Admin'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setUserDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <main className="pt-14 min-h-screen flex flex-col">
          <div className="p-3 sm:p-4 lg:p-6 flex-1">
            <Outlet />
          </div>

          <footer className="mt-auto pb-3 sm:pb-4 px-3 sm:px-4 lg:px-6">
            <p className="text-xs text-gray-500 text-center sm:text-left">2026 © Blackie Networks. Admin Portal.</p>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
