import { formatPrice, calculateBulkDiscount } from '@/data/utils/pricing';
import styles from './BulkPriceTable.module.css';

/**
 * BulkPriceTable - Display tiered wholesale pricing options
 * Shows all quantity tiers, prices, and savings compared to retail
 */
export default function BulkPriceTable({ product, selectedQuantity }) {
  if (!product?.tieredPricing || product.tieredPricing.length === 0) {
    return null;
  }

  const retailPrice = product.originalPrice || product.price;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Bulk Pricing Tiers</h3>
        <p>Lower prices with larger orders</p>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Quantity Range</th>
              <th>Unit Price</th>
              <th>Savings</th>
              <th>Total for Range</th>
            </tr>
          </thead>
          <tbody>
            {product.tieredPricing.map((tier, idx) => {
              const tierPrice = tier.price;
              const discount = calculateBulkDiscount(product, tier.min);
              const exampleQty = tier.min; // Show savings for minimum of tier
              const savingsPerUnit = retailPrice - tierPrice;
              const savingsPercent = Math.round((savingsPerUnit / retailPrice) * 100);

              const isSelected = selectedQuantity >= tier.min && 
                                (tier.max === null || selectedQuantity <= tier.max);

              return (
                <tr key={idx} className={isSelected ? styles.selected : ''}>
                  <td className={styles.rangeCell}>
                    <span className={styles.range}>
                      {tier.min}
                      {tier.max ? ` - ${tier.max}` : '+'}
                    </span>
                    {isSelected && <span className={styles.badge}>Current</span>}
                  </td>
                  <td className={styles.priceCell}>
                    <span className={styles.price}>{formatPrice(tierPrice)}</span>
                  </td>
                  <td className={styles.savingsCell}>
                    <span className={styles.savings}>
                      {formatPrice(savingsPerUnit)}
                      <em>{savingsPercent}% off</em>
                    </span>
                  </td>
                  <td className={styles.totalCell}>
                    <span className={styles.total}>{formatPrice(tierPrice * exampleQty)}</span>
                    <small>@{exampleQty} units</small>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <div className={styles.moqInfo}>
          <strong>Minimum Order:</strong> {product.moq} units
        </div>
        <div className={styles.caseInfo}>
          <strong>Case Pack Size:</strong> {product.casePackSize} units
        </div>
      </div>
    </div>
  );
}
