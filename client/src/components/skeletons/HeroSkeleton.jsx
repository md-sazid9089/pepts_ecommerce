/**
 * HeroSkeleton — animated placeholder for hero banner sections.
 */

const shimmer = {
  background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
}

const styles = {
  heroBanner: {
    width: '100%',
    minHeight: '400px',
    borderRadius: '0.5rem',
    ...shimmer,
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    padding: '2rem',
    textAlign: 'center',
  },
  titleLine: {
    height: '40px',
    borderRadius: '8px',
    ...shimmer,
    width: '60%',
    maxWidth: '600px',
  },
  subtitleLine: {
    height: '24px',
    borderRadius: '6px',
    ...shimmer,
    width: '50%',
    maxWidth: '400px',
  },
  buttonLine: {
    height: '44px',
    borderRadius: '6px',
    ...shimmer,
    width: '180px',
    marginTop: '1rem',
  },
}

export default function HeroSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
      <div style={styles.heroBanner} aria-hidden="true" />
    </>
  )
}
