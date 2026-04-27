/**
 * ProductCardSkeleton — animated placeholder while products are loading.
 * Matches the dimensions of ProductCard (responsive) to prevent layout shift.
 */

const CSS = `
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  .pcs-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #EAEAEA;
    display: grid;
    grid-template-columns: 300px 1fr;
    min-height: 360px;
    overflow: hidden;
  }
  .pcs-shimmer {
    background: linear-gradient(90deg, #f0e8e8 25%, #f9f0f0 50%, #f0e8e8 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .pcs-image {
    min-height: 360px;
  }
  .pcs-content {
    padding: 22px 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .pcs-line {
    border-radius: 6px;
    height: 14px;
  }
  .pcs-btn-row {
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr;
    gap: 10px;
    margin-top: auto;
  }
  .pcs-btn {
    height: 42px;
    border-radius: 8px;
  }

  @media (max-width: 700px) {
    .pcs-card {
      grid-template-columns: 1fr;
      grid-template-rows: 220px auto;
      min-height: unset;
    }
    .pcs-image {
      min-height: 220px;
      height: 220px;
    }
    .pcs-content {
      padding: 16px 18px;
    }
    .pcs-btn-row {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 420px) {
    .pcs-image { height: 190px; min-height: 190px; }
  }
`;

export default function ProductCardSkeleton() {
  return (
    <>
      <style>{CSS}</style>
      <div className="pcs-card" aria-hidden="true">
        {/* Image placeholder */}
        <div className="pcs-shimmer pcs-image" />

        {/* Content placeholders */}
        <div className="pcs-content">
          <div className="pcs-shimmer pcs-line" style={{ width: '55%', height: '11px' }} />
          <div className="pcs-shimmer pcs-line" style={{ width: '80%', height: '20px' }} />
          <div className="pcs-shimmer pcs-line" style={{ width: '90%' }} />
          <div className="pcs-shimmer pcs-line" style={{ width: '70%' }} />
          <div className="pcs-shimmer pcs-line" style={{ width: '48%', height: '28px' }} />
          <div className="pcs-shimmer pcs-line" style={{ width: '38%', height: '16px' }} />
          <div style={{ background: '#F3F4F6', height: '1px', margin: '4px 0' }} />
          <div className="pcs-btn-row">
            <div className="pcs-shimmer pcs-btn" />
            <div className="pcs-shimmer pcs-btn" />
            <div className="pcs-shimmer pcs-btn" />
          </div>
        </div>
      </div>
    </>
  );
}
