/**
 * CategoryGridSkeleton — animated placeholder for category grid.
 * Shows multiple skeleton categories with shimmer effect.
 */

const shimmer = {
  background: 'linear-gradient(90deg, #f0e8e8 25%, #f9f0f0 50%, #f0e8e8 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '24px',
    width: '100%',
  },
  categoryCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '8px',
    ...shimmer,
  },
  textWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  titleLine: {
    height: '14px',
    width: '80%',
    borderRadius: '6px',
    ...shimmer,
  },
  countLine: {
    height: '12px',
    width: '60%',
    borderRadius: '6px',
    ...shimmer,
  },
}

export default function CategoryGridSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
      <div style={styles.grid}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={styles.categoryCard} aria-hidden="true">
            <div style={styles.imageWrapper} />
            <div style={styles.textWrapper}>
              <div style={styles.titleLine} />
              <div style={styles.countLine} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
