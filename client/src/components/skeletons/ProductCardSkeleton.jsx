/**
 * ProductCardSkeleton — animated placeholder while products are loading.
 * Matches the compact ProductCard proportions to prevent layout shift.
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
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .pcs-shimmer {
    background: linear-gradient(90deg, #f0e8e8 25%, #f9f0f0 50%, #f0e8e8 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .pcs-image {
    width: 100%;
    aspect-ratio: 1 / 1;
  }
  .pcs-content {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .pcs-line {
    border-radius: 6px;
    height: 14px;
  }
  .pcs-btn-row {
    display: flex;
    gap: 8px;
    margin-top: auto;
  }
  .pcs-btn {
    height: 40px;
    border-radius: 8px;
  }
  .pcs-btn:first-child {
    flex: 1;
  }
  .pcs-btn:last-child {
    width: 40px;
    flex: 0 0 40px;
  }
  @media (max-width: 520px) {
    .pcs-content {
      padding: 10px;
    }
    .pcs-btn {
      height: 36px;
    }
    .pcs-btn:last-child {
      width: 36px;
      flex-basis: 36px;
    }
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
          <div className="pcs-shimmer pcs-line" style={{ width: '88%', height: '18px' }} />
          <div className="pcs-shimmer pcs-line" style={{ width: '70%', height: '13px' }} />
          <div className="pcs-shimmer pcs-line" style={{ width: '54%', height: '24px' }} />
          <div className="pcs-btn-row">
            <div className="pcs-shimmer pcs-btn" />
            <div className="pcs-shimmer pcs-btn" />
          </div>
        </div>
      </div>
    </>
  );
}
