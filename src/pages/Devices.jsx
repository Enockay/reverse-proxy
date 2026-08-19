import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import api from '../services/api'
import {
  Laptop,
  Smartphone,
  Monitor,
  HardDrive,
  Plus,
  X,
  Loader,
  Download,
  Copy,
  Check,
  Trash2,
  Wifi,
  WifiOff,
  Network,
  Router,
  ExternalLink,
  Info
} from 'lucide-react'

const DEVICE_TYPES = [
  { value: 'laptop', label: 'Laptop', icon: Laptop },
  { value: 'phone', label: 'Phone', icon: Smartphone },
  { value: 'desktop', label: 'Desktop', icon: Monitor },
  { value: 'other', label: 'Other', icon: HardDrive }
]

function deviceIcon(type) {
  return DEVICE_TYPES.find(t => t.value === type)?.icon || HardDrive
}

function CopyableIp({ value }) {
  const [copied, setCopied] = useState(false)
  const ip = value?.split('/')[0]
  const copy = async () => {
    await navigator.clipboard.writeText(ip)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button onClick={copy} className="inline-flex items-center gap-1 font-mono text-xs text-gray-700 hover:text-blue-600 transition-colors" title="Copy IP">
      {ip}
      {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
    </button>
  )
}

// Default RouterOS service ports - these are the router's own real listening
// ports, reachable directly over the tunnel by its VPN IP once connected, and
// are unrelated to the public TCP-proxy ports used for external (non-VPN)
// access (those only make sense against the public host, not the tunnel IP).
const MIKROTIK_PORTS = { winbox: 8291, ssh: 22, api: 8728, web: 80 }

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false)
  const copy = async (e) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button onClick={copy} className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors shrink-0" title={`Copy ${label}`}>
      {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
    </button>
  )
}

// host and port are always passed separately (not "host:port") so every
// snippet/command can be built correctly regardless of whether the port is
// the RouterOS default (internal/VPN access) or a non-standard proxied one
// (public access) - SSH in particular needs `-p <port>` for anything but 22.
function apiSnippet(lang, host, port) {
  if (lang === 'node') {
    return `const { RouterOSAPI } = require('node-routeros');

const conn = new RouterOSAPI({
  host: '${host}',
  port: ${port},
  user: 'admin',
  password: 'your-password'
});

conn.connect().then(async () => {
  const resources = await conn.write('/system/resource/print');
  console.log(resources);
  conn.close();
});`
  }
  if (lang === 'python') {
    return `from librouteros import connect

api = connect(
    host='${host}',
    port=${port},
    username='admin',
    password='your-password'
)

for row in api('/system/resource/print'):
    print(row)`
  }
  return `<?php
require_once 'routeros_api.class.php';

$API = new RouterosAPI();
if ($API->connect('${host}', 'admin', 'your-password', ${port})) {
    $result = $API->comm('/system/resource/print');
    print_r($result);
    $API->disconnect();
}`
}

function sshCommand(host, port) {
  return port === 22 ? `ssh admin@${host}` : `ssh -p ${port} admin@${host}`
}

const API_LANGS = [
  { value: 'node', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'php', label: 'PHP' }
]

// publicUrl.* values from the API are already "host:port" strings
// (e.g. "vpn-test.blackie-networks.com:6100") - split them back apart since
// every snippet/command needs host and port separately.
function splitHostPort(hostPort, fallbackPort) {
  if (!hostPort) return null
  const idx = hostPort.lastIndexOf(':')
  if (idx === -1) return { host: hostPort, port: fallbackPort }
  const port = parseInt(hostPort.slice(idx + 1), 10)
  return { host: hostPort.slice(0, idx), port: Number.isFinite(port) ? port : fallbackPort }
}

function RouterConnectPanel({ ip, clientName, publicUrl }) {
  const [mode, setMode] = useState('internal') // 'internal' | 'public'
  const [tab, setTab] = useState('winbox')
  const [apiLang, setApiLang] = useState('node')
  const [pingState, setPingState] = useState(null) // null | 'loading' | 'success' | 'error'

  const hasPublic = !!(publicUrl?.winbox || publicUrl?.ssh || publicUrl?.api)

  // Web has no public proxy port (only winbox/ssh/api get one) so it's
  // internal-only - drop it from the tab list once in public mode.
  const tabs = mode === 'public' ? ['winbox', 'ssh', 'api'] : ['winbox', 'ssh', 'api', 'web']

  const target = {
    winbox: mode === 'internal' ? { host: ip, port: MIKROTIK_PORTS.winbox } : splitHostPort(publicUrl?.winbox, MIKROTIK_PORTS.winbox),
    ssh: mode === 'internal' ? { host: ip, port: MIKROTIK_PORTS.ssh } : splitHostPort(publicUrl?.ssh, MIKROTIK_PORTS.ssh),
    api: mode === 'internal' ? { host: ip, port: MIKROTIK_PORTS.api } : splitHostPort(publicUrl?.api, MIKROTIK_PORTS.api),
    web: { host: ip, port: MIKROTIK_PORTS.web }
  }[tab]

  const testConnection = async () => {
    if (!clientName) return
    setPingState('loading')
    try {
      const res = await api.post(`/api/clients/${clientName}/ping`, { target: ip })
      setPingState(res.data?.success ? 'success' : 'error')
    } catch (e) {
      setPingState('error')
    }
  }

  return (
    <div className="mt-2 pt-2 border-t border-gray-200">
      {hasPublic && (
        <div className="flex gap-1 mb-1.5">
          {[
            { value: 'internal', label: 'Via this device (VPN)' },
            { value: 'public', label: 'Via public internet' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium ${mode === value ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-1.5">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${tab === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {t === 'api' ? 'API' : t === 'ssh' ? 'SSH' : t}
            </button>
          ))}
        </div>
        {mode === 'internal' && clientName && (
          <button
            onClick={testConnection}
            disabled={pingState === 'loading'}
            className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1"
          >
            {pingState === 'loading' && <Loader className="w-3 h-3 animate-spin" />}
            {pingState === 'success' && <Wifi className="w-3 h-3 text-green-600" />}
            {pingState === 'error' && <WifiOff className="w-3 h-3 text-red-500" />}
            {pingState === null && 'Test connection'}
            {pingState === 'success' && 'Reachable'}
            {pingState === 'error' && 'Unreachable'}
            {pingState === 'loading' && 'Pinging...'}
          </button>
        )}
      </div>

      {!target ? (
        <p className="text-xs text-gray-400 italic">Not available yet.</p>
      ) : (
        <>
          {tab === 'winbox' && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Open Winbox and connect to this address directly:</p>
              <div className="flex items-center justify-between px-2 py-1.5 bg-gray-100 rounded font-mono text-xs text-gray-700">
                {target.host}:{target.port}
                <CopyButton text={`${target.host}:${target.port}`} label="Winbox address" />
              </div>
            </div>
          )}

          {tab === 'ssh' && (
            <div className="flex items-center justify-between px-2 py-1.5 bg-gray-100 rounded font-mono text-xs text-gray-700">
              {sshCommand(target.host, target.port)}
              <CopyButton text={sshCommand(target.host, target.port)} label="SSH command" />
            </div>
          )}

          {tab === 'web' && (
            <div className="flex items-center justify-between px-2 py-1.5 bg-gray-100 rounded text-xs">
              <a href={`http://${target.host}`} target="_blank" rel="noreferrer" className="font-mono text-blue-600 hover:underline flex items-center gap-1">
                http://{target.host}<ExternalLink className="w-2.5 h-2.5" />
              </a>
              <CopyButton text={`http://${target.host}`} label="Web address" />
            </div>
          )}

          {tab === 'api' && (
            <div>
              <div className="flex gap-1 mb-1">
                {API_LANGS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setApiLang(value)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${apiLang === value ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <pre className="px-2 py-2 bg-gray-900 text-gray-100 rounded text-[10px] leading-relaxed overflow-x-auto whitespace-pre">{apiSnippet(apiLang, target.host, target.port)}</pre>
                <div className="absolute top-1.5 right-1.5">
                  <CopyButton text={apiSnippet(apiLang, target.host, target.port)} label="API code" />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Connects on port {target.port} - replace the username/password with this router&apos;s own admin credentials.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function AddDeviceModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [deviceType, setDeviceType] = useState('laptop')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const response = await api.post('/api/devices', { name, deviceType })
      onCreated(response.data.device)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add device')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Add a Device</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">{error}</div>}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Device Name</label>
            <input
              type="text"
              required
              placeholder="e.g. My Work Laptop"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Device Type</label>
            <div className="grid grid-cols-4 gap-2">
              {DEVICE_TYPES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDeviceType(value)}
                  className={`flex flex-col items-center justify-center gap-1 py-3 rounded-lg border-2 transition-all ${
                    deviceType === value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : 'Add Device & Generate Tunnel'}
          </button>
        </form>
      </div>
    </div>
  )
}

function SetupPanel({ device, otherPeers, onClose }) {
  const [copied, setCopied] = useState(false)
  const [qrConfig, setQrConfig] = useState(null)
  const [qrError, setQrError] = useState(false)
  const isPhone = device.deviceType === 'phone'

  useEffect(() => {
    if (!isPhone) return
    let cancelled = false
    api.get(`/api/devices/${device.id}/config`, { responseType: 'text' })
      .then((response) => { if (!cancelled) setQrConfig(response.data) })
      .catch(() => { if (!cancelled) setQrError(true) })
    return () => { cancelled = true }
  }, [device.id, isPhone])

  const handleDownload = async () => {
    try {
      const response = await api.get(`/api/devices/${device.id}/config`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${device.name}.conf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Failed to download config')
    }
  }

  const handleCopy = async () => {
    try {
      const response = await api.get(`/api/devices/${device.id}/config`, { responseType: 'text' })
      await navigator.clipboard.writeText(response.data)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert('Failed to copy config')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 my-auto">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-gray-900">{device.name} is ready</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Assigned tunnel address: <span className="font-mono font-medium text-gray-900">{device.vpnIp?.split('/')[0]}</span>
        </p>

        <div className="space-y-3 mb-5">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Connect this device</h3>

          {isPhone ? (
            <>
              <ol className="space-y-2 text-xs text-gray-600 list-decimal list-inside">
                <li>Install the official WireGuard app from the <a href="https://apps.apple.com/app/wireguard/id1441195209" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">App Store</a> or <a href="https://play.google.com/store/apps/details?id=com.wireguard.android" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Play Store</a>.</li>
                <li>In the app, tap <span className="font-medium text-gray-800">+ &rarr; Scan from QR code</span> and point your phone&apos;s camera at the code below.</li>
                <li>Activate the tunnel. Once connected, this device holds the address <span className="font-mono">{device.vpnIp?.split('/')[0]}</span> on the private network.</li>
              </ol>
              <div className="flex justify-center py-3 bg-gray-50 rounded">
                {qrConfig ? (
                  <QRCodeSVG value={qrConfig} size={176} />
                ) : qrError ? (
                  <p className="text-xs text-red-500 py-8">Failed to load QR code.</p>
                ) : (
                  <div className="flex items-center justify-center h-[176px] w-[176px]">
                    <Loader className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 text-center">No camera handy? You can also download or copy the config file below.</p>
            </>
          ) : (
            <ol className="space-y-2 text-xs text-gray-600 list-decimal list-inside">
              <li>Install the official WireGuard app for this device from <a href="https://www.wireguard.com/install/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center">wireguard.com/install<ExternalLink className="w-2.5 h-2.5 ml-0.5" /></a></li>
              <li>Download the config below, then in the WireGuard app choose <span className="font-medium text-gray-800">Import tunnel(s) from file</span> and select it.</li>
              <li>Activate the tunnel. Once connected, this device holds the address <span className="font-mono">{device.vpnIp?.split('/')[0]}</span> on the private network.</li>
            </ol>
          )}

          <div className="flex gap-2">
            <button onClick={handleDownload} className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download Config
            </button>
            <button onClick={handleCopy} className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200">
              {copied ? <Check className="w-3.5 h-3.5 mr-1.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
              {copied ? 'Copied' : 'Copy Config'}
            </button>
          </div>
        </div>

        {otherPeers.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center">
              <Network className="w-3.5 h-3.5 mr-1.5" />
              Reach your other devices
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Once connected, this device can reach the following directly - no port forwarding needed, as if they were on the same local network:
            </p>
            <div className="space-y-1.5">
              {otherPeers.map((p) => (
                <div key={p.id} className="px-3 py-2 bg-gray-50 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 flex items-center">
                      {p.kind === 'router' ? <Router className="w-3.5 h-3.5 mr-1.5 text-gray-400" /> : <Laptop className="w-3.5 h-3.5 mr-1.5 text-gray-400" />}
                      {p.name}
                    </span>
                    <CopyableIp value={p.vpnIp} />
                  </div>
                  {p.kind === 'router' && p.vpnIp && <RouterConnectPanel ip={p.vpnIp?.split('/')[0]} clientName={p.clientName} publicUrl={p.publicUrl} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Devices() {
  const [devices, setDevices] = useState([])
  const [routers, setRouters] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [setupDevice, setSetupDevice] = useState(null)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [devicesRes, routersRes] = await Promise.all([
        api.get('/api/devices'),
        api.get('/api/routers')
      ])
      setDevices(devicesRes.data.devices || [])
      setRouters(routersRes.data.routers || [])
    } catch (error) {
      console.error('Failed to load devices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (device) => {
    if (!confirm(`Remove "${device.name}"? It will lose access to the tunnel immediately.`)) return
    try {
      await api.delete(`/api/devices/${device.id}`)
      fetchAll()
    } catch (error) {
      alert('Failed to remove device')
    }
  }

  const peersFor = (device) => {
    const otherDevices = devices
      .filter(d => d.id !== device.id)
      .map(d => ({ id: d.id, name: d.name, vpnIp: d.vpnIp, kind: 'device' }))
    const routerPeers = routers.map(r => ({ id: r.id, name: r.name, vpnIp: r.vpnIp, kind: 'router', clientName: r.wireguardConfig?.clientName, publicUrl: r.publicUrl }))
    return [...routerPeers, ...otherDevices]
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-lg font-semibold text-gray-900">My Devices</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Device
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
        <Info className="w-4 h-4 text-blue-500 mr-2.5 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">
          Think of this as your own private hub. Add any device - your laptop, phone, or desktop - and each one gets
          its own address on your private tunnel. Once two of your devices are connected, they can reach each other
          directly at those addresses, exactly like a local network. If you have a MikroTik router set up, you can
          connect to it from your laptop or phone the same way - no port forwarding required.
        </p>
      </div>

      {devices.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 text-center py-12">
          <Laptop className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-900 mb-1">No devices yet</h3>
          <p className="text-xs text-gray-600 mb-4">Add your first device to start using your private tunnel.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Device
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tunnel Address</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devices.map((d) => {
                  const Icon = deviceIcon(d.deviceType)
                  return (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center text-xs font-medium text-gray-900">
                          <Icon className="w-4 h-4 mr-2 text-gray-400" />
                          {d.name}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap"><CopyableIp value={d.vpnIp} /></td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        {d.online ? (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded text-green-700 bg-green-50">
                            <Wifi className="w-3 h-3 mr-1" />Connected
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded text-gray-500 bg-gray-100">
                            <WifiOff className="w-3 h-3 mr-1" />Not connected
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-600">{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSetupDevice(d)}
                            className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                          >
                            View Setup
                          </button>
                          <button
                            onClick={() => handleDelete(d)}
                            className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddDeviceModal
          onClose={() => setShowAddModal(false)}
          onCreated={(device) => {
            setShowAddModal(false)
            fetchAll()
            setSetupDevice(device)
          }}
        />
      )}

      {setupDevice && (
        <SetupPanel
          device={setupDevice}
          otherPeers={peersFor(setupDevice)}
          onClose={() => setSetupDevice(null)}
        />
      )}
    </div>
  )
}

export default Devices
