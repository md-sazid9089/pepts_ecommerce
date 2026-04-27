import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/services/api'
import apiClient from '@/services/apiClient'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'maruflol62@gmail.com'
const ADMIN_PASS  = import.meta.env.VITE_ADMIN_PASS  || 'Maruf$@21REDO&'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  // Already logged in → go straight to dashboard
  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem('pepta_admin_session'))
      if (session?.role === 'admin' || session?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        navigate('/admin/dashboard', { replace: true })
      }
    } catch { /* ignore */ }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const isHardcoded =
      email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASS

    try {
      const res = await authApi.login(email, password)

      if (res.success && res.data) {
        const userData = res.data.user || res.data
        const token    = res.data.token
        const isAdmin  = userData.role === 'admin' ||
                         userData.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()

        if (!isAdmin) {
          setError('Access denied. Admin accounts only.')
          setLoading(false)
          return
        }

        if (token) apiClient.setToken(token)
        const session = { ...userData, adminAt: Date.now() }
        localStorage.setItem('pepta_admin_session', JSON.stringify(session))
        navigate('/admin/dashboard', { replace: true })
        return
      }

      // API returned failure — use hardcoded fallback
      if (isHardcoded) {
        const session = {
          id: 'admin_local',
          email: ADMIN_EMAIL,
          name: 'Admin',
          role: 'admin',
          adminAt: Date.now(),
        }
        localStorage.setItem('pepta_admin_session', JSON.stringify(session))
        navigate('/admin/dashboard', { replace: true })
        return
      }

      setError(res.message || 'Invalid email or password.')
    } catch {
      if (isHardcoded) {
        const session = { id: 'admin_local', email: ADMIN_EMAIL, name: 'Admin', role: 'admin', adminAt: Date.now() }
        localStorage.setItem('pepta_admin_session', JSON.stringify(session))
        navigate('/admin/dashboard', { replace: true })
        return
      }
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #F5EDEC 0%, #f0e0de 100%)',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: '1rem',
    }}>
      <div style={{
        background: '#fff', borderRadius: '1.5rem', padding: '2.75rem 2.5rem',
        width: '100%', maxWidth: 440,
        boxShadow: '0 20px 60px rgba(83,54,56,0.15), 0 4px 16px rgba(83,54,56,0.08)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '1rem',
            background: 'linear-gradient(135deg, #533638, #7a4f52)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', margin: '0 auto 1rem',
            boxShadow: '0 4px 12px rgba(83,54,56,0.3)',
          }}>⚙️</div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#533638', margin: '0 0 0.25rem' }}>
            Pepta Admin
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>
            Sign in to manage your store
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fee2e2', border: '1px solid #fca5a5',
            borderRadius: '0.75rem', padding: '0.85rem 1rem',
            color: '#991b1b', marginBottom: '1.25rem', fontSize: '0.875rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.1rem' }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              style={{
                width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem',
                border: '1.5px solid #e5e7eb', fontSize: '0.95rem', outline: 'none',
                boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#533638'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '0.875rem 3rem 0.875rem 1rem',
                  borderRadius: '0.75rem', border: '1.5px solid #e5e7eb',
                  fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit', transition: 'border 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#533638'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af',
                  fontSize: '1rem', padding: 0,
                }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.95rem',
              borderRadius: '0.75rem', border: 'none',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #533638, #7a4f52)',
              color: '#fff', fontWeight: 700, fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', marginTop: '0.25rem',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(83,54,56,0.35)',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span style={{
                  display: 'inline-block', width: 16, height: 16,
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Signing in…
              </span>
            ) : 'Sign In to Dashboard'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>
          🔒 Admin access only — unauthorised attempts are logged
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
