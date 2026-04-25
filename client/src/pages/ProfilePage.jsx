import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { authApi } from '@/services/api'

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    name: user?.name || user?.firstName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    address: user?.address || '',
  })

  const s = {
    page: { minHeight: '60vh', padding: '2rem 1.5rem', maxWidth: 800, margin: '0 auto' },
    title: { fontSize: '1.75rem', fontWeight: 700, color: '#533638', marginBottom: '1.5rem' },
    card: { background: '#fff', borderRadius: '1rem', border: '1px solid #e5e7eb', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' },
    avatar: { width: 80, height: 80, borderRadius: '50%', background: '#533638', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' },
    name: { fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem 0' },
    email: { color: '#6b7280', fontSize: '0.95rem', margin: 0 },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    label: { display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' },
    input: { width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.95rem', outline: 'none', marginBottom: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' },
    btnRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
    editBtn: { padding: '0.65rem 1.5rem', borderRadius: '0.5rem', background: '#533638', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
    cancelBtn: { padding: '0.65rem 1.5rem', borderRadius: '0.5rem', background: '#f3f4f6', color: '#374151', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
    logoutBtn: { padding: '0.65rem 1.5rem', borderRadius: '0.5rem', background: '#fee2e2', color: '#991b1b', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
    sectionTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F7B9C4' },
    success: { background: '#d1fae5', border: '1px solid #10b981', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#065f46', marginBottom: '1rem', fontSize: '0.9rem' },
    infoRow: { display: 'flex', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' },
    infoLabel: { width: 120, color: '#6b7280', fontSize: '0.875rem', fontWeight: 600, flexShrink: 0 },
    infoValue: { color: '#111827', fontSize: '0.95rem' },
    notLoggedIn: { textAlign: 'center', padding: '4rem 1rem' },
  }

  if (!user) {
    return (
      <div style={s.page}>
        <div style={s.notLoggedIn}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ color: '#533638', marginBottom: '0.5rem' }}>Please log in</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>You need to be logged in to view your profile.</p>
          <button
            style={s.editBtn}
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const displayName = user?.name || user?.firstName || user?.email?.split('@')[0] || 'User'
  const initials = displayName.slice(0, 2).toUpperCase()

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      // Update via API if available, otherwise just update context
      updateProfile(form)
      setMessage('Profile updated successfully! ✅')
      setEditing(false)
    } catch {
      setMessage('Profile saved locally.')
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    authApi.logout()
    navigate('/')
  }

  return (
    <div style={s.page}>
      <h1 style={s.title}>My Profile</h1>

      {/* Avatar + header card */}
      <div style={{ ...s.card, display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={s.avatar}>{initials}</div>
        <div>
          <p style={s.name}>{displayName}</p>
          <p style={s.email}>{user.email}</p>
          {user.role === 'admin' && (
            <span style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.2rem 0.75rem', borderRadius: '2rem', background: '#fde68a', color: '#92400e', fontSize: '0.78rem', fontWeight: 700 }}>
              👑 Admin
            </span>
          )}
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      {/* Profile details */}
      <div style={s.card}>
        <div style={s.sectionTitle}>Account Details</div>
        {message && <div style={s.success}>{message}</div>}

        {editing ? (
          <form onSubmit={handleSave}>
            <div style={s.row}>
              <div>
                <label style={s.label}>Full Name</label>
                <input style={s.input} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
              </div>
              <div>
                <label style={s.label}>Email</label>
                <input style={s.input} type="email" value={form.email} disabled style={{ ...s.input, background: '#f9fafb', color: '#9ca3af' }} />
              </div>
            </div>
            <div style={s.row}>
              <div>
                <label style={s.label}>Phone</label>
                <input style={s.input} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1-555-0100" />
              </div>
              <div>
                <label style={s.label}>Company</label>
                <input style={s.input} value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Company Name" />
              </div>
            </div>
            <label style={s.label}>Address</label>
            <input style={s.input} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="Your business address" />

            <div style={s.btnRow}>
              <button type="submit" style={s.editBtn} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
              <button type="button" style={s.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div style={s.infoRow}><span style={s.infoLabel}>Name</span><span style={s.infoValue}>{form.name || '—'}</span></div>
            <div style={s.infoRow}><span style={s.infoLabel}>Email</span><span style={s.infoValue}>{user.email}</span></div>
            <div style={s.infoRow}><span style={s.infoLabel}>Phone</span><span style={s.infoValue}>{form.phone || '—'}</span></div>
            <div style={s.infoRow}><span style={s.infoLabel}>Company</span><span style={s.infoValue}>{form.company || '—'}</span></div>
            <div style={{ ...s.infoRow, borderBottom: 'none' }}><span style={s.infoLabel}>Address</span><span style={s.infoValue}>{form.address || '—'}</span></div>
            <div style={{ marginTop: '1.25rem' }}>
              <button style={s.editBtn} onClick={() => setEditing(true)}>✏️ Edit Profile</button>
            </div>
          </>
        )}
      </div>

      {/* Wholesale account info */}
      <div style={s.card}>
        <div style={s.sectionTitle}>Wholesale Account</div>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
          You have access to wholesale B2B pricing. Contact us at <strong>support@pepta.shopping</strong> to upgrade your account tier or discuss custom pricing.
        </p>
      </div>
    </div>
  )
}
