/**
 * ProtectedRoute — Admin-only guard
 *
 * Reads `pepta_admin_session` synchronously from localStorage so there is
 * ZERO flash of protected content. The check runs during the initial render,
 * not inside a useEffect, meaning React immediately renders <Navigate> before
 * anything in `children` is painted.
 *
 * Session is invalidated after 8 hours (controlled by SESSION_MAX_AGE_MS).
 * If the session is missing, expired, or lacks role==="admin", the user is
 * redirected to /admin/login with `replace` so the protected path is not
 * kept in browser history.
 */

import { Navigate } from 'react-router-dom'

const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000 // 8 hours

/**
 * Read and validate the admin session from localStorage.
 * Returns the session object if valid, null otherwise.
 * Clears the storage entry if it is expired.
 */
function getAdminSession() {
  try {
    const raw = localStorage.getItem('pepta_admin_session')
    if (!raw) return null

    const session = JSON.parse(raw)

    // Must have admin role
    if (session?.role !== 'admin') return null

    // Enforce session age limit
    if (session.adminAt && Date.now() - session.adminAt > SESSION_MAX_AGE_MS) {
      localStorage.removeItem('pepta_admin_session')
      return null
    }

    return session
  } catch {
    return null
  }
}

export default function ProtectedRoute({ children }) {
  const session = getAdminSession()

  if (!session) {
    // No valid admin session — redirect to login immediately, no flash
    return <Navigate to="/admin/login" replace />
  }

  return children
}
