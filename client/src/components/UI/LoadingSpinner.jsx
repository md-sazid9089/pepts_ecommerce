/**
 * LoadingSpinner.jsx  —  Pepta
 * Professional branded loading overlay — no card, transparent backdrop.
 *
 * Props:
 *   fullScreen  {boolean}  [true]   fixed overlay vs inline-block
 *   message     {string}   [null]   subtitle beneath the spinner
 *   color       {string}   [brand]  primary accent color override
 */

const BRAND    = '#8B3A3A';
const BRAND_LT = '#F7B9C4';

export default function LoadingSpinner({
  fullScreen = true,
  message,
  color = BRAND,
}) {
  const trackColor = `${color}22`;   // ~13 % opacity — static ring
  const dashColor  = `${color}44`;   // ~27 % — dashed ring

  const wrapperStyle = fullScreen
    ? {
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        background: 'rgba(255, 252, 250, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }
    : {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        padding: '2rem',
      };

  return (
    <>
      <style>{`
        @keyframes ps-spin-cw {
          to { transform: rotate(360deg); }
        }
        @keyframes ps-spin-ccw {
          to { transform: rotate(-360deg); }
        }
        @keyframes ps-breathe {
          0%, 100% { transform: scale(1);    opacity: 1;   }
          50%       { transform: scale(.93); opacity: .78; }
        }
        @keyframes ps-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes ps-glow-pulse {
          0%, 100% { box-shadow: 0 0 0 0   ${color}33, 0 6px 20px ${color}22; }
          50%       { box-shadow: 0 0 0 7px ${color}11, 0 6px 32px ${color}44; }
        }
        @keyframes ps-dot-bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0; }
          40%            { transform: scale(1); opacity: 1; }
        }
        @keyframes ps-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%);  }
        }
      `}</style>

      <div style={wrapperStyle} role="status" aria-label={message || 'Loading…'}>

        {/* ── Spinner rings ──────────────────────────────────────── */}
        <div style={{ position: 'relative', width: 128, height: 128 }}>

          {/* Track ring — static, faint */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            border: `2px solid ${trackColor}`,
          }} />

          {/* Outer arc — gradient SVG, spins CW */}
          <svg
            viewBox="0 0 128 128"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              animation: 'ps-spin-cw 1.5s cubic-bezier(.55,.05,.45,.95) infinite',
            }}
          >
            <defs>
              <linearGradient id="ps-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor={color}    stopOpacity="0"  />
                <stop offset="55%"  stopColor={color}    stopOpacity="1"  />
                <stop offset="100%" stopColor={BRAND_LT} stopOpacity="1"  />
              </linearGradient>
            </defs>
            <circle
              cx="64" cy="64" r="61"
              fill="none"
              stroke="url(#ps-grad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="155 235"
            />
          </svg>

          {/* Dashed ring — counter-rotates */}
          <div style={{
            position: 'absolute', inset: 14,
            borderRadius: '50%',
            border: `1.5px dashed ${dashColor}`,
            animation: 'ps-spin-ccw 3.5s linear infinite',
          }} />

          {/* Inner accent arc — slower CW */}
          <svg
            viewBox="0 0 96 96"
            style={{
              position: 'absolute', inset: 14,
              width: 'calc(100% - 28px)',
              height: 'calc(100% - 28px)',
              animation: 'ps-spin-cw 2.6s ease-in-out infinite',
            }}
          >
            <circle
              cx="48" cy="48" r="45"
              fill="none"
              stroke={BRAND_LT}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="55 235"
              strokeOpacity="0.6"
            />
          </svg>

          {/* Logo — centred inside the rings */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 68, height: 68,
              borderRadius: '50%',
              overflow: 'hidden',
              border: `2px solid rgba(247,185,196,0.5)`,
              animation: 'ps-glow-pulse 2.4s ease-in-out infinite',
              flexShrink: 0,
            }}>
              <img
                src="/images/products/logo.jpeg"
                alt="Pepta"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center',
                  display: 'block',
                  animation: 'ps-breathe 2.4s ease-in-out infinite',
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background = color;
                  e.target.parentElement.style.display = 'flex';
                  e.target.parentElement.style.alignItems = 'center';
                  e.target.parentElement.style.justifyContent = 'center';
                  e.target.parentElement.innerHTML =
                    `<span style="font-size:26px;font-weight:800;color:#fff;
                     font-family:'Plus Jakarta Sans',sans-serif">P</span>`;
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Text block ─────────────────────────────────────────── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '0.35rem',
          animation: 'ps-fade-up .5s .1s ease both',
        }}>
          {/* Brand name */}
          <span style={{
            fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color,
          }}>
            PEPTA
          </span>

          {/* Optional message */}
          {message && (
            <span style={{
              fontFamily: "'Inter',system-ui,sans-serif",
              fontSize: 12,
              fontWeight: 400,
              color: '#7a5c5c',
              letterSpacing: '0.01em',
              textAlign: 'center',
              maxWidth: 190,
              lineHeight: 1.5,
            }}>
              {message}
            </span>
          )}

          {/* Staggered bouncing dots */}
          <div style={{ display: 'flex', gap: '5px', marginTop: '0.2rem' }} aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: 'block',
                width: 5, height: 5,
                borderRadius: '50%',
                background: color,
                opacity: 0.75,
                animation: `ps-dot-bounce 1.4s ease-in-out ${i * 0.17}s infinite`,
              }} />
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
