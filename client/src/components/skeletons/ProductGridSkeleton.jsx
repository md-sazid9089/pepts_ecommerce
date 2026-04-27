/**
 * ProductGridSkeleton — animated placeholder for product grid.
 * Shows multiple product card skeletons.
 */

const shimmer = {
  background: 'linear-gradient(90deg, #f0e8e8 25%, #f9f0f0 50%, #f0e8e8 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #EAEAEA',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  imageSection: {
    width: '100%',
    height: '250px',
    ...shimmer,
  },
  contentSection: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    flex: 1,
  },
  line: (width = '100%', height = 12) => ({
    ...shimmer,
    height,
    borderRadius: '4px',
    width,
  }),
  priceBlock: {
    ...shimmer,
    height: 20,
    borderRadius: '4px',
    width: '50%',
    marginTop: '0.5rem',
  },
  buttonRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
    marginTop: 'auto',
  },
  btn: {
    ...shimmer,
    height: 36,
    borderRadius: '4px',
  },
}

export default function ProductGridSkeleton({ count = 6 }) {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
      <div style={styles.grid}>
        {[...Array(count)].map((_, i) => (
          <div key={i} style={styles.card} aria-hidden="true">
            <div style={styles.imageSection} />
            <div style={styles.contentSection}>
              <div style={styles.line('60%', 12)} />
              <div style={styles.line('90%', 16)} />
              <div style={styles.line('75%', 12)} />
              <div style={styles.priceBlock} />
              <div style={styles.buttonRow}>
                <div style={styles.btn} />
                <div style={styles.btn} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
