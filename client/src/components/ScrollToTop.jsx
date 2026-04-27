import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop — resets scroll position to the top on every route change.
 * Renders nothing; purely a side-effect component.
 * Mount it once inside <Router> and it handles all navigation automatically.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Use instant scroll (not smooth) so there's no visible jump delay
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
