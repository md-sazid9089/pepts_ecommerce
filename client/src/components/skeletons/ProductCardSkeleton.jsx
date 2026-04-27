/**
 * ProductCardSkeleton — animated placeholder while products are loading.
 * Matches the dimensions of ProductCard to prevent layout shift.
 */

const shimmer = {
  background: 'linear-gradient(90deg, #f0e8e8 25%, #f9f0f0 50%, #f0e8e8 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #EAEAEA',
    display: 'grid',
    gridTemplateColumns: '340px 1fr',
    minHeight: '400px',
    overflow: 'hidden',
  },
  imageSection: {
    ...shimmer,
    minHeight: '400px',
  },
  contentSection: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  line: (width, height = 14) => ({
    ...shimmer,
    height,
    borderRadius: '6px',
    width,
  }),
  priceBlock: {
    ...shimmer,
    height: 36,
    borderRadius: '6px',
    width: '50%',
  },
  buttonRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.9fr 0.9fr',
    gap: '12px',
    marginTop: 'auto',
  },
  btn: {
    ...shimmer,
    height: 46,
    borderRadius: '6px',
  },
}

export default function ProductCardSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
      <div style={styles.card} aria-hidden="true">
        {/* Left: image placeholder */}
        <div style={styles.imageSection} />

        {/* Right: content placeholders */}
        <div style={styles.contentSection}>
          <div style={styles.line('60%', 12)} />
          <div style={styles.line('85%', 22)} />
          <div style={styles.line('90%', 14)} />
          <div style={styles.line('75%', 14)} />
          <div style={styles.priceBlock} />
          <div style={styles.line('40%', 18)} />
          <div style={{ ...styles.line('100%', 1), marginTop: '8px', background: '#F3F4F6' }} />
          <div style={styles.buttonRow}>
            <div style={styles.btn} />
            <div style={styles.btn} />
            <div style={styles.btn} />
          </div>
        </div>
      </div>
    </>
  )
}
