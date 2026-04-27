/**
 * ProductDetailSkeleton — animated placeholder for product detail page.
 * Shows image gallery skeleton and details panel skeleton.
 */

const shimmer = {
  background: 'linear-gradient(90deg, #f0e8e8 25%, #f9f0f0 50%, #f0e8e8 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1.55fr 0.7fr',
    gap: '2rem',
    maxWidth: '1800px',
  },
  gallerySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  mainImage: {
    width: '100%',
    minHeight: '420px',
    borderRadius: '1rem',
    ...shimmer,
  },
  thumbnailRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '0.75rem',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '0.85rem',
    ...shimmer,
  },
  detailsPanel: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  titleLine: {
    height: '28px',
    borderRadius: '6px',
    ...shimmer,
    marginBottom: '0.5rem',
  },
  textLine: (width = '100%') => ({
    height: '14px',
    borderRadius: '6px',
    ...shimmer,
    width,
    marginBottom: '0.75rem',
  }),
  priceBlock: {
    height: '36px',
    borderRadius: '6px',
    ...shimmer,
    width: '50%',
    marginBottom: '1rem',
  },
  buttonRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginTop: 'auto',
  },
  button: {
    height: '46px',
    borderRadius: '6px',
    ...shimmer,
  },
  tableSection: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
  },
  tableHeader: {
    height: '18px',
    borderRadius: '4px',
    ...shimmer,
    marginBottom: '1rem',
    width: '40%',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '0.75rem',
  },
  tableCell: {
    height: '12px',
    borderRadius: '4px',
    ...shimmer,
  },
}

export default function ProductDetailSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
      <div style={styles.container}>
        <div style={styles.gallerySection}>
          <div style={styles.mainImage} />
          <div style={styles.thumbnailRow}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={styles.thumbnail} aria-hidden="true" />
            ))}
          </div>
        </div>

        <div style={styles.detailsPanel}>
          <div style={styles.titleLine} />
          <div style={styles.textLine('80%')} />
          <div style={styles.textLine('75%')} />
          
          <div style={styles.priceBlock} />
          
          <div style={styles.buttonRow}>
            <div style={styles.button} />
            <div style={styles.button} />
          </div>

          <div style={styles.tableSection}>
            <div style={styles.tableHeader} />
            {[...Array(3)].map((_, i) => (
              <div key={i} style={styles.tableRow}>
                <div style={styles.tableCell} />
                <div style={styles.tableCell} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
