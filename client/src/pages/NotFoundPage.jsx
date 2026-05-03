import { useNavigate } from 'react-router-dom'

/**
 * 404 Not Found Page — Alibaba-inspired minimal style
 * Colors (existing theme):
 *   Primary:    #533638 (maroon)
 *   Accent:     #F7B9C4 (rose pink)
 *   Background: #F5EDEC (warm cream)
 *   Muted text: #867671
 */

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5EDEC',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        fontFamily: "Inter, 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        textAlign: 'center',
      }}
    >
      {/* ── Telescope SVG Illustration ───────────────────────────────── */}
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
      >
        {/* Stars / dots */}
        <circle cx="30"  cy="32"  r="3" fill="#F7B9C4" />
        <circle cx="150" cy="28"  r="2" fill="#F7B9C4" />
        <circle cx="158" cy="55"  r="3" fill="#F7B9C4" />
        <circle cx="22"  cy="70"  r="2" fill="#F7B9C4" />

        {/* Tripod legs */}
        {/* Left leg */}
        <line x1="90" y1="120" x2="55" y2="162" stroke="#B0A0A2" strokeWidth="5" strokeLinecap="round" />
        {/* Right leg */}
        <line x1="90" y1="120" x2="125" y2="162" stroke="#B0A0A2" strokeWidth="5" strokeLinecap="round" />
        {/* Center leg */}
        <line x1="90" y1="120" x2="90"  y2="162" stroke="#B0A0A2" strokeWidth="5" strokeLinecap="round" />
        {/* Tripod crossbar */}
        <line x1="65" y1="148" x2="115" y2="148" stroke="#B0A0A2" strokeWidth="3" strokeLinecap="round" />

        {/* Telescope body — rotated tube */}
        {/* Main tube */}
        <rect
          x="52" y="80"
          width="76" height="26"
          rx="8"
          fill="#533638"
          transform="rotate(-28 90 93)"
        />
        {/* Eyepiece (small end) */}
        <rect
          x="116" y="88"
          width="20" height="16"
          rx="4"
          fill="#7A4E52"
          transform="rotate(-28 126 96)"
        />
        {/* Lens cap (big end) */}
        <rect
          x="36" y="77"
          width="18" height="28"
          rx="6"
          fill="#F7B9C4"
          transform="rotate(-28 45 91)"
        />
        {/* Lens shine */}
        <ellipse
          cx="42" cy="84"
          rx="4" ry="7"
          fill="white"
          opacity="0.45"
          transform="rotate(-28 42 84)"
        />

        {/* Mount pivot circle */}
        <circle cx="90" cy="116" r="6" fill="#533638" />
        <circle cx="90" cy="116" r="3" fill="#F7B9C4" />
      </svg>

      {/* ── Text block ───────────────────────────────────────────────── */}
      <h1
        style={{
          marginTop: '2rem',
          marginBottom: '0.75rem',
          fontSize: 'clamp(1.4rem, 4vw, 1.75rem)',
          fontWeight: 800,
          color: '#533638',
          lineHeight: 1.25,
        }}
      >
        Oops! Page Not Found
      </h1>

      <p
        style={{
          margin: '0 auto',
          maxWidth: '360px',
          fontSize: '0.9375rem',
          color: '#867671',
          lineHeight: 1.65,
        }}
      >
        The page you're looking for has been moved or doesn't exist.
      </p>

      {/* ── Buttons ──────────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          justifyContent: 'center',
        }}
      >
        <button
          id="btn-go-back"
          onClick={() => navigate(-1)}
          aria-label="Go back to previous page"
          style={{
            padding: '0.65rem 1.5rem',
            borderRadius: '8px',
            border: '2px solid #533638',
            backgroundColor: 'transparent',
            color: '#533638',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          ← Go Back
        </button>

        <button
          id="btn-go-home"
          onClick={() => navigate('/')}
          aria-label="Return to home page"
          style={{
            padding: '0.65rem 1.5rem',
            borderRadius: '8px',
            border: '2px solid #533638',
            backgroundColor: '#533638',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Back to Home
        </button>
      </div>
    </main>
  )
}
