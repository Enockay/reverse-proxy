import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  LayoutDashboard, 
  Router, 
  CreditCard, 
  LogOut,
  Menu,
  X,
  User,
  DollarSign,
  Share2,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronUp,
  Plus,
  List,
  Search,
  MessageCircle,
  Maximize2,
  Bell,
  ChevronDown as ChevronDownIcon
} from 'lucide-react'
import { useState } from 'react'

function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [routerMenuOpen, setRouterMenuOpen] = useState(true)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    {
      name: 'Router Management',
      href: '/routers',
      icon: Router,
      children: [
        { name: 'Add Router', href: '/routers/add' },
        { name: 'Router List', href: '/routers' }
      ]
    },
    { name: 'Billing and Transactions', href: '/billing', icon: CreditCard },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Pricing', href: '/pricing', icon: DollarSign },
    { name: 'Referrals', href: '/referrals', icon: Share2 },
    { name: 'Support Tickets', href: '/support', icon: MessageSquare },
    { name: 'Documents', href: '/documents', icon: FileText },
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 shadow-2xl border-r border-blue-800/30 transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-blue-800/30 bg-gradient-to-r from-blue-700/30 via-cyan-700/30 to-indigo-700/30 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white drop-shadow-sm">Blackie Networks</h1>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-blue-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Label */}
          <div className="px-6 py-3 bg-blue-900/40">
            <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">MENU</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const hasChildren = item.children && item.children.length > 0
              const isRouterMenu = item.name === 'Router Management'
              const isExpanded = isRouterMenu ? routerMenuOpen : false
              const isItemActive = isActive(item.href) || (hasChildren && item.children.some(child => isActive(child.href)))

              return (
                <div key={item.name}>
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() => setRouterMenuOpen(!routerMenuOpen)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm ${
                          isItemActive
                            ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg'
                            : 'text-blue-200 hover:bg-blue-800/40 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon className="w-4 h-4 mr-3" />
                          <span>{item.name}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="ml-7 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                                isActive(child.href)
                                  ? 'text-white bg-gradient-to-r from-blue-600/60 to-purple-600/60 shadow-md'
                                  : 'text-violet-300 hover:text-white hover:bg-violet-800/50'
                              }`}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                          <Link
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center px-3 py-2.5 rounded-lg transition-all text-sm ${
                              isItemActive
                                ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg'
                                : 'text-blue-200 hover:bg-blue-800/40 hover:text-white'
                            }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              )
            })}
            
            {/* Logout */}
            <button
              onClick={() => {
                logout()
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center px-3 py-2.5 rounded-lg transition-all text-sm text-violet-200 hover:bg-red-600/20 hover:text-red-300 border border-transparent hover:border-red-600/30 mt-4"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span>Logout</span>
            </button>
          </nav>

          {/* User Info at bottom */}
          <div className="p-4 border-t border-blue-800/30 bg-blue-900/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-blue-300 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 min-h-screen">
        {/* Top Navigation Bar */}
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 h-14 flex items-center justify-between px-3 sm:px-4 lg:px-6 shadow-sm">
          {/* Left Side */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32 sm:w-48 md:w-64"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            <div className="hidden lg:flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              <span className="hidden xl:inline">Contact: 254796869402</span>
            </div>
            <button className="hidden sm:block text-gray-500 hover:text-gray-700 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100">
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="relative text-gray-500 hover:text-gray-700 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">5</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-1 sm:space-x-2 hover:bg-gray-50 rounded-lg px-1 sm:px-2 py-1 transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 hidden lg:block">{user?.name || 'User'}</span>
                <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 hidden sm:block" />
              </button>
              
              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-xs font-medium text-gray-900">{user?.name || 'User'}</p>
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

        {/* Mobile Header - Removed as it's now integrated in top nav */}

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <>
            <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 shadow-2xl border-r border-blue-800/30 transform translate-x-0 transition-transform duration-300 ease-in-out" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between h-16 px-6 border-b border-blue-800/30 bg-gradient-to-r from-blue-700/30 via-cyan-700/30 to-indigo-700/30 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">B</span>
                    </div>
                    <div>
                      <h1 className="text-sm font-semibold text-white drop-shadow-sm">Blackie Networks</h1>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-blue-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="px-6 py-3 bg-blue-900/40">
                  <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">MENU</p>
                </div>
                <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const hasChildren = item.children && item.children.length > 0
                    const isRouterMenu = item.name === 'Router Management'
                    const isExpanded = isRouterMenu ? routerMenuOpen : false
                    const isItemActive = isActive(item.href) || (hasChildren && item.children.some(child => isActive(child.href)))

                    return (
                      <div key={item.name}>
                        {hasChildren ? (
                          <>
                            <button
                              onClick={() => setRouterMenuOpen(!routerMenuOpen)}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                                isItemActive
                                  ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg'
                                  : 'text-blue-200 hover:bg-blue-800/40 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center">
                                <Icon className="w-4 h-4 mr-3" />
                                <span>{item.name}</span>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                            {isExpanded && (
                              <div className="ml-7 mt-1 space-y-1">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.name}
                                    to={child.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                                      isActive(child.href)
                                        ? 'text-white bg-gradient-to-r from-blue-600/60 to-purple-600/60 shadow-md'
                                        : 'text-blue-300 hover:text-white hover:bg-blue-800/40'
                                    }`}
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <Link
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center px-3 py-2.5 rounded-lg transition-all text-sm ${
                              isItemActive
                                ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg'
                                : 'text-blue-200 hover:bg-blue-800/40 hover:text-white'
                            }`}
                          >
                            <Icon className="w-4 h-4 mr-3" />
                            <span>{item.name}</span>
                          </Link>
                        )}
                      </div>
                    )
                  })}
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center px-3 py-2.5 rounded-lg transition-all text-sm text-violet-200 hover:bg-red-600/20 hover:text-red-300 border border-transparent hover:border-red-600/30 mt-4"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span>Logout</span>
                  </button>
                </nav>
                <div className="p-4 border-t border-blue-800/30 bg-blue-900/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{user?.name}</p>
                      <p className="text-xs text-blue-300 truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Page Content */}
        <main className="pt-14 min-h-screen flex flex-col">
          <div className="p-3 sm:p-4 lg:p-6 flex-1">
            <Outlet />
          </div>
          
          {/* Footer */}
          <footer className="mt-auto pb-3 sm:pb-4 px-3 sm:px-4 lg:px-6">
            <p className="text-xs text-gray-500 text-center sm:text-left">2026 © Blackie Networks.</p>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default Layout
