'use client';

import { useState } from 'react';
import { FiChevronDown, FiX, FiPackage, FiClipboard, FiBox, FiDollarSign, FiBarChart } from 'react-icons/fi';
import styles from '../orders/Orders.module.css';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export default function OrdersList({ orders, onStatusChange }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statuses, setStatuses] = useState(
    Object.fromEntries(orders.map(o => [o.id, o.status]))
  );

  const handleStatusChange = (orderId, newStatus) => {
    setStatuses(prev => ({
      ...prev,
      [orderId]: newStatus
    }));
    if (onStatusChange) {
      onStatusChange(orderId, newStatus);
    }
  };

  const getStatusColor = (status) => {
    return status.toLowerCase();
  };

  if (orders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}><FiPackage size={48} /></div>
        <div className={styles.emptyStateText}>No orders found</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Orders will appear here when customers place them.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={styles.thCell}>Order ID</th>
              <th className={styles.thCell}>Customer</th>
              <th className={styles.thCell}>Items</th>
              <th className={styles.thCell}>Amount</th>
              <th className={styles.thCell}>Status</th>
              <th className={styles.thCell}>Date</th>
              <th className={styles.thCell}>Action</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {orders.map((order) => (
              <tr key={order.id} className={styles.tableRow}>
                <td className={styles.tdCell}>
                  <span className={styles.orderId}>#{order.id}</span>
                </td>
                <td className={styles.tdCell}>
                  <div className={styles.customerName}>
                    <span>{order.customer}</span>
                    <span className={styles.customerEmail}>{order.email}</span>
                  </div>
                </td>
                <td className={styles.tdCell}>
                  <span className={styles.itemsColumn}>
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </span>
                </td>
                <td className={styles.tdCell}>
                  <span className={styles.orderAmount}>
                    ${order.total.toLocaleString()}
                  </span>
                </td>
                <td className={styles.tdCell}>
                  <select
                    className={styles.statusSelect}
                    value={statuses[order.id]}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{
                      borderColor: getStatusColor(statuses[order.id]) === 'pending' ? '#FF9800' : 
                                  getStatusColor(statuses[order.id]) === 'processing' ? '#2196F3' :
                                  getStatusColor(statuses[order.id]) === 'shipped' ? '#9C27B0' : '#00A651'
                    }}
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className={styles.tdCell}>
                  <span className={styles.orderDate}>
                    {new Date(order.date).toLocaleDateString()}
                  </span>
                </td>
                <td className={styles.tdCell}>
                  <button
                    className={styles.detailsBtn}
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className={styles.detailsModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Order Details</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedOrder(null)}
              >
                <FiX />
              </button>
            </div>

            <div className={styles.modalSection}>
              <div className={styles.sectionTitle}><FiClipboard /> Order Information</div>
              <div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Order ID:</span>
                  <span className={styles.infoValue}>#{selectedOrder.id}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Customer:</span>
                  <span className={styles.infoValue}>{selectedOrder.customer}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>{selectedOrder.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Date:</span>
                  <span className={styles.infoValue}>
                    {new Date(selectedOrder.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.modalSection}>
              <div className={styles.sectionTitle}><FiBox /> Items</div>
              <div className={styles.itemsList}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className={styles.itemRow}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{item.productName}</div>
                      <div className={styles.itemQty}>Qty: {item.quantity}</div>
                    </div>
                    <div className={styles.itemPrice}>
                      ${(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.modalSection}>
              <div className={styles.sectionTitle}><FiDollarSign /> Order Summary</div>
              <div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Subtotal:</span>
                  <span className={styles.infoValue}>
                    ${Math.round(selectedOrder.total * 0.9).toLocaleString()}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Shipping:</span>
                  <span className={styles.infoValue}>$500</span>
                </div>
                <div className={styles.infoRow} style={{ borderTop: '2px solid var(--primary)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                  <span className={styles.infoLabel} style={{ fontWeight: 700 }}>Total:</span>
                  <span className={styles.infoValue} style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
                    ${selectedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.modalSection}>
              <div className={styles.sectionTitle}><FiBarChart /> Status</div>
              <select
                className={styles.statusSelect}
                value={statuses[selectedOrder.id]}
                onChange={(e) => {
                  handleStatusChange(selectedOrder.id, e.target.value);
                  setSelectedOrder({ ...selectedOrder, status: e.target.value });
                }}
                style={{ width: '100%' }}
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
