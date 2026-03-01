import { Link } from 'react-router-dom'
import { 
  Shield, 
  Zap, 
  Globe, 
  Lock, 
  Server, 
  CheckCircle, 
  ArrowRight,
  Settings,
  Star,
  Network,
  Cloud,
  Activity,
  BarChart3,
  Users,
  Clock,
  Award,
  TrendingUp,
  Headphones,
  Code,
  Terminal,
  Monitor
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

function Home() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    routers: 0,
    users: 0,
    uptime: '99.9%',
    support: '24/7'
  })

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
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise-Grade Security",
      description: "Military-grade WireGuard encryption with ChaCha20Poly1305 cipher ensures your MikroTik routers are protected with the latest security protocols. Each router gets unique encryption keys and isolated VPN tunnels.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast Setup",
      description: "Get your router connected in under 5 minutes with our automated configuration system. One-command auto-configuration downloads and applies WireGuard settings automatically. No technical expertise required.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Public Access Ports",
      description: "Access your routers remotely via Winbox (8291), SSH (22), and API (8728) through dedicated public ports on our secure infrastructure. Each router gets unique 4-digit ports automatically allocated.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Zero Trust Architecture",
      description: "Each router gets its own isolated VPN connection with unique encryption keys for maximum security. No shared resources, complete network isolation between routers.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop"
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "Scalable Infrastructure",
      description: "Our cloud-based platform scales with your needs. Add unlimited routers without worrying about infrastructure. Built on enterprise-grade servers with 99.9% uptime guarantee.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Easy Management",
      description: "Intuitive dashboard to manage all your routers, monitor real-time status, view connection history, ping routers, and configure settings from anywhere in the world.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Real-Time Monitoring",
      description: "Monitor your router's online status, last seen time, connection statistics, and bandwidth usage in real-time. Get instant alerts when routers go offline.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Track bandwidth usage, connection uptime, and performance metrics for each router. Export reports and analyze network performance trends over time.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "24/7 Expert Support",
      description: "Get help when you need it with our round-the-clock support team. Expert assistance via email, support tickets, and phone. Average response time under 2 hours.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
    }
  ]

  const steps = [
    {
      number: "01",
      title: "Sign Up Free",
      description: "Create your account in seconds with just your email and password. No credit card required. Get instant access to your dashboard and start your 7-day free trial immediately.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
      details: "Email verification sent instantly. Verify your account to unlock full features."
    },
    {
      number: "02",
      title: "Add Your Router",
      description: "Add your MikroTik router with a simple form. Enter router name, location, and description. Our system automatically allocates VPN IP, generates encryption keys, and assigns public access ports.",
      image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=300&fit=crop",
      details: "First router is free for 7 days. Subsequent routers cost $1/month each."
    },
    {
      number: "03",
      title: "Auto-Configure",
      description: "Copy the one-line auto-config command to your MikroTik router terminal. The script automatically downloads WireGuard configuration, installs it, and establishes the VPN connection.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      details: "Configuration completes in under 2 minutes. Router appears online in dashboard immediately."
    },
    {
      number: "04",
      title: "Access Remotely",
      description: "Connect to your router via Winbox, SSH, or API using the dedicated public ports assigned to you. Access from anywhere in the world through our secure infrastructure.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
      details: "Ports are automatically forwarded. No firewall configuration needed on your end."
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
      content: "The public access ports feature is an absolute game-changer for our operations. We can now manage all 50+ of our MikroTik routers from our office in Nairobi without complex VPN setups. The dashboard is intuitive, and the support team responds within hours. Best $1 we spend per router!",
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
      text: "Only $1 per router per month. No setup fees, no hidden costs. First router free for 7 days."
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <header>
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Blackie Networks
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#how-it-works" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">How It Works</a>
              <Link 
                to={user ? "/dashboard" : "/login"} 
                className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
              >
                {user ? "Dashboard" : "Login"}
              </Link>
              {!user && (
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-lg hover:shadow-lg transition-all flex items-center space-x-1.5 text-sm"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
            <div className="md:hidden">
              <Link 
                to={user ? "/dashboard" : "/login"} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs"
              >
                {user ? "Dashboard" : "Login"}
              </Link>
            </div>
          </div>
        </div>
      </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20" aria-label="Hero section">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-4">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>Trusted by 1000+ network administrators across Africa</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Secure Remote Access to Your
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  MikroTik Routers
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 mb-6 max-w-xl">
                Enterprise-grade WireGuard VPN solution with automated configuration, 
                public access ports (Winbox, SSH, API), real-time monitoring, and 24/7 support. 
                Manage all your routers from one intuitive dashboard. Only $1/month per router.
              </p>
              <div className="flex flex-row items-center gap-3 mb-8">
                {!user ? (
                  <>
                    <Link 
                      to="/signup" 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2"
                    >
                      <span>Start Free Trial</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link 
                      to="/login" 
                      className="bg-white text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center"
                    >
                      Sign In
                    </Link>
                  </>
                ) : (
                  <Link 
                    to="/dashboard" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600 stat-number">1000+</div>
                  <div className="text-xs text-gray-600 mt-1">Active Routers</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600 stat-number">99.9%</div>
                  <div className="text-xs text-gray-600 mt-1">Uptime SLA</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600 stat-number">24/7</div>
                  <div className="text-xs text-gray-600 mt-1">Support</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600 stat-number">&lt;5min</div>
                  <div className="text-xs text-gray-600 mt-1">Setup Time</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop" 
                alt="MikroTik Router VPN Management - Secure Remote Access Network Infrastructure" 
                className="rounded-2xl shadow-2xl"
                loading="eager"
                width="800"
                height="600"
              />
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={`${feature.title} - MikroTik Router VPN Management Feature`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width="600"
                    height="400"
                  />
                  <div className="absolute top-3 left-3 w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50" aria-label="How it works section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Get your MikroTik router connected in just 4 simple steps - takes less than 5 minutes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 transform translate-x-3 z-0"></div>
                )}
                <div className="relative bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-500 transition-all shadow-md h-full">
                  <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={step.image} 
                      alt={`${step.title} - MikroTik Router Setup Process Step ${step.number}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width="400"
                      height="300"
                    />
                    <div className="absolute top-2 right-2 text-3xl font-bold text-blue-100 bg-blue-600/80 rounded-lg px-2 py-1">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  <p className="text-xs text-blue-600 font-medium">{step.details}</p>
                </div>
              </div>
            ))}
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
                  <span className="text-5xl font-bold">$1</span>
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
                  "{testimonial.content}"
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
                Enterprise-grade WireGuard VPN solution for MikroTik router management. 
                Serving network administrators across Africa and beyond.
              </p>
              <p className="text-xs text-gray-500">
                📍 Kenya | 📞 +254 796 869 402
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">Product</h3>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                {user && <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>}
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
