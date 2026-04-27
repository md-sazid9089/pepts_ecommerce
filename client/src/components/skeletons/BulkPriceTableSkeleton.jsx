/**
 * BulkPriceTableSkeleton — animated placeholder for bulk pricing table.
 */

const shimmer = {
  background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
}

const styles = {
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    padding: '1rem',
  },
  headerCell: {
    height: '18px',
    borderRadius: '4px',
    ...shimmer,
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    padding: '1rem',
    borderBottom: '1px solid #f3f4f6',
  },
  tableCell: {
    height: '14px',
    borderRadius: '4px',
    ...shimmer,
  },
}

export default function BulkPriceTableSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
      <div style={styles.tableContainer} aria-hidden="true">
        <div style={styles.tableHeader}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={styles.headerCell} />
          ))}
        </div>
        {[...Array(4)].map((_, rowIndex) => (
          <div key={rowIndex} style={styles.tableRow}>
            {[...Array(4)].map((_, cellIndex) => (
              <div key={cellIndex} style={styles.tableCell} />
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
