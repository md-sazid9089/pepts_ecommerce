'use client';

import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from '../products/Products.module.css';

export default function ProductsTable({ products, onEdit, onDelete }) {
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', className: 'outOfStock' };
    if (stock < 10) return { label: 'Low Stock', className: 'lowStock' };
    return { label: 'In Stock', className: 'inStock' };
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th className={styles.thCell}>Product</th>
            <th className={styles.thCell}>Category</th>
            <th className={styles.thCell}>Price</th>
            <th className={styles.thCell}>Stock</th>
            <th className={styles.thCell}>Status</th>
            <th className={styles.thCell}>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            return (
              <tr key={product.id} className={styles.tableRow}>
                <td className={styles.tdCell}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      className={styles.productImage}
                      style={{
                        background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                      }}
                    />
                    <span className={styles.productName}>{product.name}</span>
                  </div>
                </td>
                <td className={styles.tdCell}>{product.category}</td>
                <td className={styles.tdCell}>
                  <span className={styles.price}>
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className={styles.originalPrice}>
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </td>
                <td className={styles.tdCell}>
                  {product.stock} units
                </td>
                <td className={styles.tdCell}>
                  <span className={`${styles.stockStatus} ${styles[stockStatus.className]}`}>
                    {stockStatus.label}
                  </span>
                </td>
                <td className={styles.tdCell}>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editBtn}
                      onClick={() => onEdit(product)}
                      title="Edit product"
                    >
                      <FiEdit2 size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => onDelete(product.id)}
                      title="Delete product"
                    >
                      <FiTrash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
