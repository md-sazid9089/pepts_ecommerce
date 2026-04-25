import { useState } from 'react'
import { authApi } from '@/services/api'
import apiClient from '@/services/apiClient'

const ADMIN_EMAIL = 'maruflol62@gmail.com'
const ADMIN_PASS  = 'Maruf$@21REDO&'

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // ── Hardcoded fallback: always allow the designated admin credentials ──
    const isHardcodedAdmin = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASS
    
    try {
      const res = await authApi.login(email, password)

      if (res.success && res.data) {
        const user = res.data
        const isAdmin = user.role === 'admin' || user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
        if (!isAdmin) {
          setError('Access denied. Admin accounts only.')
          setLoading(false)
          return
        }
        if (res.data.token) apiClient.setToken(res.data.token)
        const session = { ...user, adminAt: Date.now() }
        localStorage.setItem('pepta_admin_session', JSON.stringify(session))
        onLogin(session)
        return
      }

      // API returned 401 — user might not be registered yet
      if (isHardcodedAdmin) {
        // Try to auto-register first
        try {
          const reg = await authApi.register(email, password, 'Maruf', 'Admin')
          if (reg.success && reg.data) {
            if (reg.data.token) apiClient.setToken(reg.data.token)
            const session = { ...reg.data, role: 'admin', adminAt: Date.now() }
            localStorage.setItem('pepta_admin_session', JSON.stringify(session))
            onLogin(session)
            return
          }
        } catch (_) { /* registration failed too, use local fallback */ }

        // Final fallback: create a local session without API
        const localSession = {
          id: 'admin_local',
          email: ADMIN_EMAIL,
          name: 'Maruf Admin',
          role: 'admin',
          adminAt: Date.now(),
        }
        localStorage.setItem('pepta_admin_session', JSON.stringify(localSession))
        onLogin(localSession)
        return
      }

      setError(res.message || 'Invalid email or password.')
    } catch (err) {
      if (isHardcodedAdmin) {
        // Network error but correct admin creds — allow local session
        const localSession = { id: 'admin_local', email: ADMIN_EMAIL, name: 'Admin', role: 'admin', adminAt: Date.now() }
        localStorage.setItem('pepta_admin_session', JSON.stringify(localSession))
        onLogin(localSession)
        return
      }
      setError('Connection error. Please check your internet and try again.')
    } finally {
      setLoading(false)
    }
  }

  const s = {
    page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5EDEC' },
    box: { background: '#fff', borderRadius: '1.25rem', padding: '2.5rem', width: '100%', maxWidth: 420, boxShadow: '0 8px 32px rgba(83,54,56,0.12)' },
    logo: { textAlign: 'center', fontSize: '2rem', fontWeight: 800, color: '#533638', marginBottom: '0.25rem' },
    sub: { textAlign: 'center', color: '#6b7280', fontSize: '0.9rem', marginBottom: '2rem' },
    label: { display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' },
    input: { width: '100%', padding: '0.85rem 1rem', borderRadius: '0.65rem', border: '1.5px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', marginBottom: '1rem', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border 0.2s' },
    btn: { width: '100%', padding: '0.9rem', borderRadius: '0.75rem', background: '#533638', color: '#fff', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
    err: { background: '#fee2e2', border: '1px solid #f87171', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#991b1b', marginBottom: '1rem', fontSize: '0.875rem' },
  }

  return (
    <div style={s.page}>
      <div style={s.box}>
        <div style={s.logo}>⚙️ Pepta Admin</div>
        <p style={s.sub}>Sign in to the admin dashboard</p>
        {error && <div style={s.err}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email Address</label>
          <input style={s.input} type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" autoFocus />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          <button type="submit" style={s.btn} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  )
}
