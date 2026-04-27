import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

/**
 * 404 Not Found Page — Pepta Brand
 * Colors:
 *   Primary:    #533638 (maroon)
 *   Accent:     #F7B9C4 (rose pink)
 *   Background: #F5EDEC (warm cream)
 *   Text:       #333333
 *   Muted:      #A0AEC0
 */

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#F5EDEC',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.5rem',
    fontFamily: "Inter, 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  // Decorative background blobs
  blobTop: {
    position: 'absolute',
    top: '-120px',
    right: '-80px',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(247,185,196,0.35) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blobBottom: {
    position: 'absolute',
    bottom: '-100px',
    left: '-60px',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(83,54,56,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    maxWidth: '600px',
    width: '100%',
  },
  // Giant ghost 404 behind icon
  ghost404: {
    fontSize: 'clamp(100px, 20vw, 180px)',
    fontWeight: 900,
    lineHeight: 1,
    color: '#533638',
    opacity: 0.07,
    letterSpacing: '-4px',
    userSelect: 'none',
    margin: 0,
    lineHeightStep: 1,
  },
  // Icon floats over the ghost text
  iconWrapper: {
    marginTop: '-60px',
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBg: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'white',
    boxShadow: '0 8px 32px rgba(83,54,56,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'float 3s ease-in-out infinite',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#F7B9C4',
    color: '#533638',
    borderRadius: '999px',
    padding: '4px 14px',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    marginBottom: '16px',
  },
  heading: {
    fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
    fontWeight: 800,
    color: '#533638',
    margin: '0 0 12px 0',
    lineHeight: 1.2,
  },
  subtext: {
    fontSize: '1rem',
    color: '#867671',
    lineHeight: 1.7,
    margin: '0 auto 36px',
    maxWidth: '420px',
  },
  // Action buttons row
  btnRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '36px',
  },
  btnBack: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: '2px solid #533638',
    backgroundColor: 'transparent',
    color: '#533638',
    fontWeight: 700,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  btnHome: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: '2px solid #533638',
    backgroundColor: '#533638',
    color: 'white',
    fontWeight: 700,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  btnCatalog: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: '2px solid #F7B9C4',
    backgroundColor: '#F7B9C4',
    color: '#533638',
    fontWeight: 700,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  // Attempted path display
  pathBox: {
    backgroundColor: 'white',
    border: '1px solid #EAEAEA',
    borderRadius: '8px',
    padding: '12px 20px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#A0AEC0',
    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
  },
  pathValue: {
    color: '#533638',
    fontWeight: 600,
  },
  // Divider with help text
  helpText: {
    marginTop: '28px',
    fontSize: '13px',
    color: '#A0AEC0',
  },
  helpLink: {
    color: '#533638',
    textDecoration: 'none',
    fontWeight: 600,
    cursor: 'pointer',
  },
}

export default function NotFoundPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // Log attempted route for monitoring
  useEffect(() => {
    console.warn('404 — Page not found:', location.pathname)
  }, [location.pathname])

  return (
    <div style={styles.page}>
      {/* Keyframe animation injected once */}
      <style>{`
        @keyframes float {
          0%   { transform: translateY(0); }
          50%  { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        .btn-back:hover  { background-color: #533638 !important; color: white !important; }
        .btn-home:hover  { opacity: 0.88; }
        .btn-cat:hover   { background-color: #f0a8b5 !important; border-color: #f0a8b5 !important; }
      `}</style>

      {/* Background decorative blobs */}
      <div style={styles.blobTop} aria-hidden="true" />
      <div style={styles.blobBottom} aria-hidden="true" />

      <div style={styles.content}>

        {/* Ghost 404 text */}
        <p style={styles.ghost404} aria-hidden="true">404</p>

        {/* Floating icon */}
        <div style={styles.iconWrapper}>
          <div style={styles.iconBg}>
            {/* Warehouse shelf / empty box — wholesale B2B theme */}
            <svg
              width="52"
              height="52"
              fill="none"
              stroke="#533638"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              {/* Magnifying glass overlay */}
              <circle cx="15.5" cy="7.5" r="2" strokeWidth={1.2} />
              <path d="M17 9l1.5 1.5" strokeWidth={1.2} />
            </svg>
          </div>
        </div>

        {/* Badge */}
        <div style={styles.badge}>
          <span>Page not found</span>
        </div>

        {/* Main heading */}
        <h1 style={styles.heading}>
          This page isn't in our catalog
        </h1>

        {/* Description */}
        <p style={styles.subtext}>
          The page you're looking for has been moved, deleted, or never
          existed in our wholesale marketplace. Let us get you back on track.
        </p>

        {/* Action buttons */}
        <div style={styles.btnRow} role="navigation" aria-label="Error recovery options">
          <button
            id="btn-go-back"
            className="btn-back"
            style={styles.btnBack}
            onClick={() => navigate(-1)}
            aria-label="Go back to previous page"
          >
            ← Go Back
          </button>

          <button
            id="btn-go-home"
            className="btn-home"
            style={styles.btnHome}
            onClick={() => navigate('/')}
            aria-label="Return to home page"
          >
            🏠 Back to Home
          </button>

          <button
            id="btn-browse-catalog"
            className="btn-cat"
            style={styles.btnCatalog}
            onClick={() => navigate('/products')}
            aria-label="Browse product catalog"
          >
            📦 Browse Catalog
          </button>
        </div>

        {/* Attempted path */}
        <div style={styles.pathBox}>
          <span>Attempted path:</span>
          <span style={styles.pathValue}>{location.pathname}</span>
        </div>

        {/* Help text */}
        <p style={styles.helpText}>
          Need help?{' '}
          <span
            style={styles.helpLink}
            onClick={() => navigate('/contact')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/contact')}
          >
            Contact our team
          </span>
        </p>
      </div>
    </div>
  )
}
