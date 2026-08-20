import { Link } from 'react-router-dom'
import {
  Shield,
  Zap,
  Globe,
  Lock,
  Router,
  Server,
  CheckCircle,
  ArrowRight,
  Settings,
  Star,
  Network,
  Users,
  Clock,
  Award,
  TrendingUp,
  Headphones,
  Monitor,
  Laptop,
  Smartphone,
  Wallet,
  Share2,
  MessageSquare,
  HelpCircle,
  Wifi,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function Home() {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Animate stats on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-count')
        }
      })
    }, { threshold: 0.5 })

    const statElements = document.querySelectorAll('.stat-number')
    statElements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Built for MikroTik Hardware",
      description: "Native support for the full MikroTik RouterOS lineup. Connect your hEX, RB, or CCR series router and get a secure tunnel running in minutes.",
      image: "/mikrotikdevice.png",
      big: true
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise-Grade Security",
      description: "Military-grade WireGuard encryption with ChaCha20Poly1305 cipher. Each router gets unique encryption keys and an isolated VPN tunnel.",
      image: "/security.png"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Public Access Ports",
      description: "Access your routers remotely via Winbox, SSH, and API through dedicated public ports on our secure infrastructure.",
      image: "/publicaccesspoints.png"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Zero Trust Architecture",
      description: "Each router gets its own isolated VPN connection with unique encryption keys. No shared resources, complete network isolation.",
      image: "/zerotrustacch.png"
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "Scalable Infrastructure",
      description: "Our cloud-based platform scales with your needs. Add unlimited routers on enterprise-grade servers with a 99.9% uptime guarantee.",
      image: "/scalableinfrasturcture.png"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Easy Management",
      description: "Intuitive dashboard to manage all your routers, monitor real-time status, view connection history, and configure settings from anywhere.",
      image: "/easymanagement.png"
    }
  ]

  const steps = [
    {
      number: "01",
      title: "Sign Up Free",
      description: "Create your account in seconds with just your email and password. No credit card required. Get instant access to your dashboard and start your 7-day free trial immediately.",
      image: "/signup.png",
      details: "Email verification sent instantly. Verify your account to unlock full features.",
      accent: "text-blue-600"
    },
    {
      number: "02",
      title: "Add Your Router",
      description: "Add your MikroTik router with a simple form. Enter router name, location, and description. Our system automatically allocates VPN IP, generates encryption keys, and assigns public access ports.",
      image: "/addrouter.png",
      details: "First router is free for 7 days. Subsequent routers cost $2/month each.",
      accent: "text-emerald-600"
    },
    {
      number: "03",
      title: "Auto-Configure",
      description: "Copy the one-line auto-config command to your MikroTik router terminal. The script automatically downloads WireGuard configuration, installs it, and establishes the VPN connection.",
      image: "/autoconfigure.png",
      details: "Configuration completes in under 2 minutes. Router appears online in dashboard immediately.",
      accent: "text-blue-600"
    },
    {
      number: "04",
      title: "Access Remotely",
      description: "Connect to your router via Winbox, SSH, or API using the dedicated public ports assigned to you. Access from anywhere in the world through our secure infrastructure.",
      image: "/accessremotely.png",
      details: "Ports are automatically forwarded. No firewall configuration needed on your end.",
      accent: "text-purple-600"
    }
  ]

  const testimonials = [
    {
      name: "Kwame Asante",
      role: "Network Administrator",
      company: "Tech Solutions Africa",
      location: "Accra, Ghana",
      content: "Blackie Networks has completely transformed how we manage our remote MikroTik routers across multiple locations in West Africa. The setup was effortless - just one command and everything worked perfectly. The reliability is outstanding, and we've had zero downtime in 6 months.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
    },
    {
      name: "Amina Hassan",
      role: "IT Infrastructure Manager",
      company: "East Africa Telecom",
      location: "Nairobi, Kenya",
      content: "The public access ports feature is an absolute game-changer for our operations. We can now manage all 50+ of our MikroTik routers from our office in Nairobi without complex VPN setups. The dashboard is intuitive, and the support team responds within hours. Best $2 we spend per router!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces"
    },
    {
      name: "Thabo Mthembu",
      role: "Senior Network Engineer",
      company: "CloudConnect SA",
      location: "Johannesburg, South Africa",
      content: "This is the best investment we've made for our network infrastructure. Managing routers across South Africa, Botswana, and Zimbabwe is now seamless. The dashboard is intuitive, the real-time monitoring is excellent, and the support team is always responsive. Highly recommended!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces"
    }
  ]

  const benefits = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Cost-Effective",
      text: "Only $2 per router per month. No setup fees, no hidden costs. First router free for 7 days."
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Quick Setup",
      text: "Get your router connected in under 5 minutes. One command auto-configuration."
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Enterprise Grade",
      text: "Military-grade encryption, 99.9% uptime guarantee, enterprise infrastructure."
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Expert Support",
      text: "24/7 support from network professionals. Average response time under 2 hours."
    }
  ]

  // Keep in sync with the FAQPage JSON-LD in index.html
  const faqs = [
    {
      question: "What is Blackie Networks?",
      answer: "Blackie Networks is a private WireGuard VPN hub. You connect your MikroTik routers and personal devices (laptops, phones, desktops) to it, and every device gets its own address on a private network - so they can reach each other directly, from anywhere."
    },
    {
      question: "Can I connect my laptop or phone, not just a MikroTik router?",
      answer: "Yes. The My Devices feature lets you add any laptop, phone, or desktop and generates a WireGuard configuration for it instantly, at no extra cost. Once connected, it can reach your MikroTik routers - or any other device on your account - directly through the tunnel."
    },
    {
      question: "How much does it cost?",
      answer: "MikroTik routers are $2 per month each, with a free 7-day trial on your first router. Personal device tunnels (laptop, phone, desktop) are free."
    },
    {
      question: "Do I need technical knowledge to set it up?",
      answer: "No. MikroTik routers are configured with a single auto-configuration command. Personal devices are set up by installing the official WireGuard app and importing a config file we generate for you."
    },
    {
      question: "Can my devices reach each other through the tunnel?",
      answer: "Yes. All your devices join the same private hub, so a connected laptop can reach a connected MikroTik router (or any other device) directly at its private address - no port forwarding required."
    },
    {
      question: "What payment methods are supported?",
      answer: "You top up a wallet balance via PayStack, and router subscriptions are billed automatically from that balance each month."
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <header>
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 sm:h-20">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/30 ring-1 ring-white/20">
                  <Router className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 leading-tight">
                  <span className="block text-base sm:text-lg font-bold text-gray-900 truncate">
                    MikroTik Remote Access
                  </span>
                  <span className="block text-[10px] sm:text-xs text-gray-500 truncate">
                    Access your hub from everywhere
                  </span>
                </div>
              </div>
              <div className="hidden md:flex items-center">
                <div className="flex items-center space-x-8">
                  <a href="#hub" className="text-base text-gray-700 hover:text-blue-600 transition-colors">Private Hub</a>
                  <a href="#features" className="text-base text-gray-700 hover:text-blue-600 transition-colors">Features</a>
                  <a href="#pricing" className="text-base text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
                  <a href="#how-it-works" className="text-base text-gray-700 hover:text-blue-600 transition-colors">How It Works</a>
                </div>
                <div className="flex items-center space-x-3 ml-8 pl-8 border-l border-gray-200">
                  <Link
                    to={user ? "/dashboard" : "/login"}
                    className="text-base font-medium text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    {user ? "Dashboard" : "Login"}
                  </Link>
                  {!user && (
                    <Link
                      to="/signup"
                      className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all flex items-center space-x-1.5 text-base font-semibold"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 md:hidden">
                <Link
                  to={user ? "/dashboard" : "/login"}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap"
                >
                  {user ? "Dashboard" : "Login"}
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(open => !open)}
                  className="p-2 -mr-2 text-gray-700 hover:text-blue-600 transition-colors"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
              <div className="px-4 sm:px-6 py-3 flex flex-col space-y-1">
                <a href="#hub" onClick={() => setMobileMenuOpen(false)} className="px-2 py-2.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">Private Hub</a>
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="px-2 py-2.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">Features</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="px-2 py-2.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">Pricing</a>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-2 py-2.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">How It Works</a>
                <div className="mt-2 pt-2 border-t border-gray-200 flex flex-col space-y-2">
                  <Link
                    to={user ? "/dashboard" : "/login"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    {user ? "Dashboard" : "Login"}
                  </Link>
                  {!user && (
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center space-x-1.5"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-white pt-10 sm:pt-14 lg:pt-16 pb-8"
        aria-label="Hero section"
      >
        {/* Decorative background blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 sm:w-96 sm:h-96 bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Hero Content */}
            <div>
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-100/90 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-6 shadow-sm max-w-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Trusted by 1000+ admins across Africa</span>
                  <span className="hidden sm:inline">Trusted by 1000+ network administrators across Africa</span>
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-bold text-gray-900 mb-6 leading-[1.1] tracking-[-0.03em]">
                Secure Remote Access to
                <span className="block">
                  Your <span className="text-blue-600">MikroTik Routers</span>
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl">
                Enterprise-grade WireGuard VPN solution with automated
                configuration, public access ports (Winbox, SSH, API),
                real-time monitoring, and 24/7 support. Manage all your
                routers from one intuitive dashboard. Only $2/month per router.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {!user ? (
                  <>
                    <Link
                      to="/signup"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                      <span>Start Free Trial</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      to="/login"
                      className="bg-white text-gray-700 px-7 py-3.5 rounded-xl text-sm font-semibold border border-gray-300 shadow-sm hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all flex items-center justify-center"
                    >
                      Sign In
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/dashboard"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="relative">
              {/* Rounded as a standalone card on mobile/tablet, where it
                  stacks below the text (no adjacent column to blend into).
                  On large screens the left edge goes square and fades into
                  the text column instead, so it reads as one continuous
                  canvas rather than a floating card. Shadow stays soft
                  throughout - a heavy drop shadow fights the blended look. */}
              <div className="relative rounded-2xl lg:rounded-l-none lg:rounded-r-2xl overflow-hidden shadow-xl shadow-gray-900/10">
                <img
                  src="/herosection.jpg"
                  alt="Network administrator monitoring MikroTik routers across multiple locations on the Blackie Networks dashboard"
                  className="w-full h-auto block"
                  loading="eager"
                  width="1400"
                  height="933"
                />
                <div className="hidden lg:block absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-white via-white/70 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="relative z-10 mt-10 sm:mt-14 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 overflow-hidden">
            {[
              { icon: <Wifi className="w-5 h-5" />, value: "1000+", label: "Active Routers" },
              { icon: <Shield className="w-5 h-5" />, value: "99.9%", label: "Uptime SLA" },
              { icon: <Headphones className="w-5 h-5" />, value: "24/7", label: "Support" },
              { icon: <Zap className="w-5 h-5" />, value: "<5min", label: "Setup Time" }
            ].map((stat, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-5 sm:p-6 border-gray-200 lg:border-b-0 ${
                  i % 2 === 0 ? 'border-r' : ''
                } ${i < 2 ? 'border-b' : ''} ${i === 3 ? 'lg:border-r-0' : 'lg:border-r'}`}
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600 stat-number leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Benefits Section */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{benefit.title}</h3>
                  <p className="text-xs text-gray-600">{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Private Hub Section */}
      <section id="hub" className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 relative overflow-hidden" aria-label="Private device hub section">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '22px 22px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 px-3 py-1 rounded-full text-xs font-medium mb-4">
                <Network className="w-3 h-3" />
                <span>Not just for routers</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Your own private network hub -
                <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  for every device you own
                </span>
              </h2>
              <p className="text-sm md:text-base text-blue-100 mb-6 max-w-xl">
                Add your laptop, phone, or desktop the same way you add a MikroTik router - it gets its own
                private address on the hub, free of charge. Once two of your devices are connected, they can
                reach each other directly, exactly like being on the same local network, from anywhere in the world.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Laptop className="w-4 h-4 text-cyan-300" />
                  </div>
                  <p className="text-sm text-blue-100"><span className="font-semibold text-white">Add a device</span> - your laptop, phone, or desktop gets a WireGuard config generated instantly.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Smartphone className="w-4 h-4 text-cyan-300" />
                  </div>
                  <p className="text-sm text-blue-100"><span className="font-semibold text-white">Connect from anywhere</span> - install the official WireGuard app and import the config to join the hub.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Monitor className="w-4 h-4 text-cyan-300" />
                  </div>
                  <p className="text-sm text-blue-100"><span className="font-semibold text-white">Reach your MikroTik router</span> - once connected, open Winbox or SSH straight to its private address. No port forwarding, no extra setup.</p>
                </div>
              </div>
              {!user && (
                <Link
                  to="/signup"
                  className="inline-flex items-center space-x-2 bg-white text-blue-700 px-6 py-2.5 rounded-lg text-sm font-semibold hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <span>Build Your Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-lg">
                  <span className="text-sm text-white flex items-center"><Laptop className="w-4 h-4 mr-2 text-cyan-300" />My Work Laptop</span>
                  <span className="font-mono text-xs text-cyan-300">10.0.0.12</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-lg">
                  <span className="text-sm text-white flex items-center"><Smartphone className="w-4 h-4 mr-2 text-cyan-300" />My Phone</span>
                  <span className="font-mono text-xs text-cyan-300">10.0.0.13</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-cyan-400/10 border border-cyan-400/30 rounded-lg">
                  <span className="text-sm text-white flex items-center"><Server className="w-4 h-4 mr-2 text-cyan-300" />Office MikroTik</span>
                  <span className="font-mono text-xs text-cyan-300">10.0.0.6</span>
                </div>
                <p className="text-xs text-blue-200 pt-2 text-center">All three reach each other directly through the tunnel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white" aria-label="Features section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Everything You Need to Manage Your Routers
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for network administrators and IT professionals across Africa and beyond
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[1fr]">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all overflow-hidden flex flex-col ${
                  feature.big ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div
                  className={`relative flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/60 overflow-hidden ${
                    feature.big ? 'h-56 md:h-full md:min-h-[280px]' : 'h-40'
                  }`}
                >
                  <img
                    src={feature.image}
                    alt={`${feature.title} - MikroTik Router VPN Management Feature`}
                    className={`w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
                      feature.big ? 'max-h-44 md:max-h-64' : 'max-h-28'
                    }`}
                    loading="lazy"
                  />
                  <div className="absolute -bottom-5 left-5 z-10 w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg ring-4 ring-white">
                    {feature.icon}
                  </div>
                </div>
                <div className="p-6 pt-8 flex-1 flex flex-col">
                  <h3 className={`font-bold text-gray-900 mb-2 ${feature.big ? 'text-xl' : 'text-base'}`}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white" aria-label="How it works section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-5">
              <Zap className="w-3.5 h-3.5" />
              <span>Quick &amp; Easy</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It <span className="text-blue-600">Works</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Get your MikroTik router connected in just 4 simple steps - takes{' '}
              <span className="text-blue-600 font-semibold">less than 5 minutes</span>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {steps.map((step, index) => (
              <div key={index} className="relative h-full">
                <div className="bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all h-full flex flex-col overflow-hidden">
                  <img
                    src={step.image}
                    alt={`${step.title} - MikroTik Router Setup Process Step ${step.number}`}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                  <div className="px-6 pb-6 pt-2 flex-1 flex flex-col">
                    <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                    <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                      <p className={`text-xs font-medium ${step.accent}`}>{step.details}</p>
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-blue-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Secure by Design</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Globe className="w-4 h-4 text-purple-600" />
              <span>Access Anywhere</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white" aria-label="Pricing section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Pay only for what you need. No hidden fees, no surprises. Cancel anytime.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
              <div className="relative z-10">
                <div className="flex items-baseline justify-center mb-6">
                  <span className="text-5xl font-bold">$2</span>
                  <span className="text-lg ml-2 opacity-90">/month</span>
                  <span className="text-sm ml-2 opacity-75">per router</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold">Unlimited Bandwidth</div>
                      <div className="text-xs opacity-90">No data caps, throttling, or usage limits</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold">Public Access Ports</div>
                      <div className="text-xs opacity-90">Winbox (8291), SSH (22), API (8728) access</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold">24/7 Expert Support</div>
                      <div className="text-xs opacity-90">Email, tickets, phone. Avg response &lt;2hrs</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold">Auto-Configuration</div>
                      <div className="text-xs opacity-90">One-command setup for MikroTik RouterOS</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold">Real-Time Monitoring</div>
                      <div className="text-xs opacity-90">Online status, uptime, connection stats</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold">99.9% Uptime SLA</div>
                      <div className="text-xs opacity-90">Enterprise infrastructure guarantee</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-1">
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    <span className="text-sm font-semibold">Free Trial for New Accounts</span>
                  </div>
                  <p className="text-xs opacity-90">
                    Get a <strong>1-week free trial</strong> for your first router. No credit card required!
                    Perfect for testing our service before committing.
                  </p>
                </div>
                {!user && (
                  <div className="text-center">
                    <Link
                      to="/signup"
                      className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105 text-sm"
                    >
                      <span>Start Free Trial</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50" aria-label="Customer testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Trusted by Network Professionals Across Africa
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about Blackie Networks
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed italic">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.image}
                    alt={`${testimonial.name} - ${testimonial.role} at ${testimonial.company} testimonial`}
                    className="w-10 h-10 rounded-full object-cover"
                    loading="lazy"
                    width="40"
                    height="40"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-xs text-gray-600">{testimonial.role}, {testimonial.company}</div>
                    <div className="text-xs text-blue-600 mt-0.5">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - keep in sync with the FAQPage JSON-LD in index.html */}
      <section id="faq" className="py-16 bg-white" aria-label="Frequently asked questions">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-4">
              <HelpCircle className="w-3 h-3" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Common Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600" aria-label="Call to action">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-sm md:text-base text-blue-100 mb-8">
            Join thousands of network administrators across Africa who trust Blackie Networks for secure router management.
            Start your free 7-day trial today - no credit card required!
          </p>
          {!user ? (
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-2.5 rounded-lg text-sm font-semibold hover:shadow-xl transition-all transform hover:scale-105"
            >
              <span>Start Your Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-2.5 rounded-lg text-sm font-semibold hover:shadow-xl transition-all transform hover:scale-105"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-bold text-white">Blackie Networks</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                Private WireGuard VPN hub for MikroTik router management and personal device tunnels.
                Serving network administrators across Africa and beyond.
              </p>
              <p className="text-xs text-gray-500">
                📍 Kenya | 📞 +254 796 869 402
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">Product</h3>
              <ul className="space-y-2 text-xs">
                <li><a href="#hub" className="hover:text-white transition-colors">Private Hub</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                {user && <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>}
                {user && <li><Link to="/devices" className="hover:text-white transition-colors">My Devices</Link></li>}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">Support</h3>
              <ul className="space-y-2 text-xs">
                {user && <li><Link to="/support" className="hover:text-white transition-colors">Support Tickets</Link></li>}
                {user && <li><Link to="/documents" className="hover:text-white transition-colors">Documentation</Link></li>}
                <li><a href="tel:+254796869402" className="hover:text-white transition-colors">+254 796 869 402</a></li>
                <li><span className="text-gray-500">24/7 Support Available</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">Account</h3>
              <ul className="space-y-2 text-xs">
                {!user ? (
                  <>
                    <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                    <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/profile" className="hover:text-white transition-colors">Profile</Link></li>
                    <li><Link to="/billing" className="hover:text-white transition-colors">Billing</Link></li>
                    <li><Link to="/referrals" className="hover:text-white transition-colors">Referrals</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-xs">
            <p>&copy; 2026 Blackie Networks. All rights reserved. | Serving Africa and Beyond</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default Home
