import { useState, useEffect } from 'react'
import api from '../services/api'
import {
  Settings as SettingsIcon,
  DollarSign,
  Server,
  Router,
  CreditCard,
  Activity,
  Loader,
  CheckCircle,
  Database,
  Wifi,
  Clock
} from 'lucide-react'

const EMPTY_FORM = {
  routerMonthlyPrice: '',
  trialDays: '',
  serverEndpoint: '',
  proxyPortRangeStart: '',
  proxyPortRangeEnd: '',
  emailSenderName: '',
  emailSenderEmail: '',
  emailReplyToEmail: '',
  mikrotikSystemUsername: '',
  mikrotikSystemPassword: '',
  paystackPublicKey: '',
  paystackSecretKey: '',
  paystackEnabled: false
}

function SectionCard({ icon: Icon, iconAccent, title, description, children }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconAccent}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

const inputClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"

function StatusPill({ ok, label }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${ok ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${ok ? 'bg-green-500' : 'bg-red-500'}`} />
      {label}
    </span>
  )
}

function AdminSettings() {
  const [settings, setSettings] = useState(null)
  const [systemStatus, setSystemStatus] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [settingsRes, statusRes] = await Promise.all([
        api.get('/api/admin/settings'),
        api.get('/api/admin/system-status')
      ])
      const s = settingsRes.data.settings
      setSettings(s)
      setSystemStatus(statusRes.data.status)
      setFormData({
        routerMonthlyPrice: s.routerMonthlyPrice,
        trialDays: s.trialDays,
        serverEndpoint: s.serverEndpoint,
        proxyPortRangeStart: s.proxyPortRangeStart,
        proxyPortRangeEnd: s.proxyPortRangeEnd,
        emailSenderName: s.emailSenderName,
        emailSenderEmail: s.emailSenderEmail,
        emailReplyToEmail: s.emailReplyToEmail,
        mikrotikSystemUsername: s.mikrotikSystemUsername,
        mikrotikSystemPassword: '',
        paystackPublicKey: s.paystackPublicKey,
        paystackSecretKey: '',
        paystackEnabled: s.paystackEnabled
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaved(false)
    setSaving(true)
    try {
      const payload = {
        routerMonthlyPrice: Number(formData.routerMonthlyPrice),
        trialDays: Number(formData.trialDays),
        serverEndpoint: formData.serverEndpoint,
        proxyPortRangeStart: Number(formData.proxyPortRangeStart),
        proxyPortRangeEnd: Number(formData.proxyPortRangeEnd),
        emailSenderName: formData.emailSenderName,
        emailSenderEmail: formData.emailSenderEmail,
        emailReplyToEmail: formData.emailReplyToEmail,
        mikrotikSystemUsername: formData.mikrotikSystemUsername,
        paystackPublicKey: formData.paystackPublicKey,
        paystackEnabled: formData.paystackEnabled
      }
      // Only send secrets if the admin actually typed a new value
      if (formData.mikrotikSystemPassword) payload.mikrotikSystemPassword = formData.mikrotikSystemPassword
      if (formData.paystackSecretKey) payload.paystackSecretKey = formData.paystackSecretKey

      const response = await api.patch('/api/admin/settings', payload)
      const s = response.data.settings
      setSettings(s)
      setFormData(prev => ({ ...prev, mikrotikSystemPassword: '', paystackSecretKey: '' }))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-900 flex items-center">
        <SettingsIcon className="w-5 h-5 mr-2 text-gray-500" />
        Settings
      </h1>

      {error && <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">{error}</div>}
      {saved && (
        <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700 flex items-center">
          <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
          Settings saved and applied immediately - no restart needed.
        </div>
      )}

      {/* System status - read-only, live */}
      {systemStatus && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-cyan-600 bg-cyan-50">
              <Activity className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">System Status</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1 flex items-center"><Database className="w-3 h-3 mr-1" />Database</p>
              <StatusPill ok={systemStatus.dbConnected} label={systemStatus.dbConnected ? 'Connected' : 'Disconnected'} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 flex items-center"><Wifi className="w-3 h-3 mr-1" />WireGuard</p>
              <StatusPill ok={systemStatus.wgEnabled} label={systemStatus.wgEnabled ? 'Enabled' : 'Disabled'} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 flex items-center"><Clock className="w-3 h-3 mr-1" />Uptime</p>
              <p className="text-xs font-medium text-gray-900">{Math.floor(systemStatus.uptimeSeconds / 3600)}h {Math.floor((systemStatus.uptimeSeconds % 3600) / 60)}m</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Environment</p>
              <p className="text-xs font-medium text-gray-900 capitalize">{systemStatus.nodeEnv}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard
            icon={DollarSign}
            iconAccent="text-green-600 bg-green-50"
            title="Pricing & Trial"
            description="Applies to routers created from now on."
          >
            <Field label="Router Monthly Price (USD)">
              <input
                type="number" min="0" step="0.01"
                value={formData.routerMonthlyPrice}
                onChange={(e) => setFormData({ ...formData, routerMonthlyPrice: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Free Trial Length (days)" hint="Applies to a user's first router only.">
              <input
                type="number" min="0" step="1"
                value={formData.trialDays}
                onChange={(e) => setFormData({ ...formData, trialDays: e.target.value })}
                className={inputClass}
              />
            </Field>
          </SectionCard>

          <SectionCard
            icon={Server}
            iconAccent="text-blue-600 bg-blue-50"
            title="Server & Email"
            description="Operational config only - real secrets stay in the server environment."
          >
            <Field label="WireGuard Server Endpoint" hint="host:port shown to customers in their config.">
              <input
                type="text" placeholder="vpn.blackie-networks.com:51820"
                value={formData.serverEndpoint}
                onChange={(e) => setFormData({ ...formData, serverEndpoint: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field
              label="Router Proxy Port Range"
              hint="4-digit ports (1024-9999) reserved for per-router Winbox/SSH/API access, split into three equal thirds. Also needs updating in docker-compose.yml's ports: list to actually take effect, and existing routers keep their already-allocated ports until reprovisioned."
            >
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number" min="1024" max="9999" step="1" placeholder="6100"
                  value={formData.proxyPortRangeStart}
                  onChange={(e) => setFormData({ ...formData, proxyPortRangeStart: e.target.value })}
                  className={inputClass}
                />
                <input
                  type="number" min="1024" max="9999" step="1" placeholder="7999"
                  value={formData.proxyPortRangeEnd}
                  onChange={(e) => setFormData({ ...formData, proxyPortRangeEnd: e.target.value })}
                  className={inputClass}
                />
              </div>
            </Field>
            <Field label="Email Sender Name">
              <input
                type="text"
                value={formData.emailSenderName}
                onChange={(e) => setFormData({ ...formData, emailSenderName: e.target.value })}
                className={inputClass}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sender Address">
                <input
                  type="email"
                  value={formData.emailSenderEmail}
                  onChange={(e) => setFormData({ ...formData, emailSenderEmail: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Reply-To Address">
                <input
                  type="email"
                  value={formData.emailReplyToEmail}
                  onChange={(e) => setFormData({ ...formData, emailReplyToEmail: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            icon={Router}
            iconAccent="text-cyan-600 bg-cyan-50"
            title="MikroTik System User"
            description="Pushed to every router for SSH status monitoring."
          >
            <Field label="Username">
              <input
                type="text"
                value={formData.mikrotikSystemUsername}
                onChange={(e) => setFormData({ ...formData, mikrotikSystemUsername: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field
              label="Password"
              hint={settings?.mikrotikSystemPasswordSet ? 'A password is set. Leave blank to keep it unchanged.' : 'No password set yet.'}
            >
              <input
                type="password"
                placeholder={settings?.mikrotikSystemPasswordSet ? '••••••••••••' : 'Set a password'}
                value={formData.mikrotikSystemPassword}
                onChange={(e) => setFormData({ ...formData, mikrotikSystemPassword: e.target.value })}
                className={inputClass}
              />
            </Field>
          </SectionCard>

          <SectionCard
            icon={CreditCard}
            iconAccent="text-purple-600 bg-purple-50"
            title="PayStack Payments"
            description="Used for wallet top-ups on the customer Add Balance page."
          >
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <input
                type="checkbox"
                checked={formData.paystackEnabled}
                onChange={(e) => setFormData({ ...formData, paystackEnabled: e.target.checked })}
                className="rounded border-gray-300"
              />
              Enable PayStack checkout
            </label>
            <Field label="Public Key" hint="Safe to expose - starts with pk_.">
              <input
                type="text" placeholder="pk_live_..."
                value={formData.paystackPublicKey}
                onChange={(e) => setFormData({ ...formData, paystackPublicKey: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field
              label="Secret Key"
              hint={settings?.paystackSecretKeySet ? 'A secret key is set. Leave blank to keep it unchanged.' : 'No secret key set yet - required to enable checkout.'}
            >
              <input
                type="password"
                placeholder={settings?.paystackSecretKeySet ? '••••••••••••' : 'sk_live_...'}
                value={formData.paystackSecretKey}
                onChange={(e) => setFormData({ ...formData, paystackSecretKey: e.target.value })}
                className={inputClass}
              />
            </Field>
          </SectionCard>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? <Loader className="w-4 h-4 animate-spin" /> : 'Save Settings'}
        </button>
      </form>

      {settings?.updatedAt && (
        <p className="text-xs text-gray-400">Last updated: {new Date(settings.updatedAt).toLocaleString()}</p>
      )}
    </div>
  )
}

export default AdminSettings
