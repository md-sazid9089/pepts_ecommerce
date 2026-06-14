/**
 * ============================================================================
 * ROUTE GUARDS — ProtectedRoute & UserProtectedRoute
 * ============================================================================
 *
 * ProtectedRoute     — Admin-only guard (/admin/* routes)
 *   Requires: authenticated user with role === 'admin'
 *   Redirects: /login if no token, / if wrong role
 *
 * UserProtectedRoute — Any-authenticated-user guard (/profile, /checkout, etc.)
 *   Requires: any valid token
 *   Redirects: /login if no token
 *
 * Both guards show a loading spinner while AuthContext resolves from
 * localStorage to prevent a flash of protected content.
 * ============================================================================
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// ── Shared loading spinner ───────────────────────────────────────────────────
function AuthLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '0.75rem',
      color: '#533638',
      fontSize: '1rem',
      fontWeight: 500,
    }}>
      <span style={{
        display: 'inline-block',
        width: 24,
        height: 24,
        border: '3px solid #F7B9C4',
        borderTopColor: '#533638',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      Checking session…
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Admin-only guard ─────────────────────────────────────────────────────────
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()
  const isAuthenticated = !!user

  // Wait for AuthContext to hydrate from localStorage
  if (isLoading) return <AuthLoader />

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return children
}

// ── Any-authenticated-user guard ─────────────────────────────────────────────
export function UserProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()

  // Wait for AuthContext to hydrate from localStorage
  if (isLoading) return <AuthLoader />

  // No token / not logged in → send to login
  if (!user) return <Navigate to="/login" replace />

  return children
}
