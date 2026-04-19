'use client';

import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import styles from '../customers/Customers.module.css';

export default function CustomersList({ customers, orders }) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const getCustomerOrders = (customerId) => {
    return orders.filter(o => o.customer === customers.find(c => c.id === customerId)?.name) || [];
  };

  if (customers.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>👥</div>
        <div className={styles.emptyStateText}>No customers found</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Customers will appear here after they register.
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
              <th className={styles.thCell}>Customer</th>
              <th className={styles.thCell}>Email</th>
              <th className={styles.thCell}>Orders</th>
              <th className={styles.thCell}>Total Spent</th>
              <th className={styles.thCell}>Joined</th>
              <th className={styles.thCell}>Status</th>
              <th className={styles.thCell}>Actions</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {customers.map((customer) => (
              <tr key={customer.id} className={styles.tableRow}>
                <td className={styles.tdCell}>
                  <div className={styles.customerName}>
                    <span>{customer.name}</span>
                  </div>
                </td>
                <td className={styles.tdCell}>
                  <span className={styles.customerEmail}>{customer.email}</span>
                </td>
                <td className={styles.tdCell}>
                  <span className={styles.orderCount}>
                    {customer.orders} orders
                  </span>
                </td>
                <td className={styles.tdCell}>
                  <span className={styles.totalSpent}>
                    ${customer.totalSpent.toLocaleString()}
                  </span>
                </td>
                <td className={styles.tdCell}>
                  <span className={styles.joinDate}>
                    {new Date(customer.joinDate).toLocaleDateString()}
                  </span>
                </td>
                <td className={styles.tdCell}>
                  <span className={`${styles.statusBadge} ${styles[customer.status.toLowerCase()]}`}>
                    {customer.status}
                  </span>
                </td>
                <td className={styles.tdCell}>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.viewBtn}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      View
                    </button>
                    <button
                      className={styles.contactBtn}
                      onClick={() => alert(`Sending email to ${customer.email}`)}
                    >
                      Email
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className={styles.detailsModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>👤 Customer Details</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedCustomer(null)}
              >
                <FiX />
              </button>
            </div>

            <div className={styles.customerAvatar}>
              {selectedCustomer.name.charAt(0).toUpperCase()}
            </div>

            <div className={styles.modalSection}>
              <div className={styles.sectionTitle}>Information</div>
              <div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Name:</span>
                  <span className={styles.infoValue}>{selectedCustomer.name}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>{selectedCustomer.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Status:</span>
                  <span className={`${styles.infoValue} ${styles[selectedCustomer.status.toLowerCase()]}`}>
                    {selectedCustomer.status}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Joined:</span>
                  <span className={styles.infoValue}>
                    {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.modalSection}>
              <div className={styles.sectionTitle}>Purchase History</div>
              <div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Total Orders:</span>
                  <span className={styles.infoValue}>{selectedCustomer.orders}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Total Spent:</span>
                  <span className={styles.infoValue} style={{ color: 'var(--success)' }}>
                    ${selectedCustomer.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Avg. Order Value:</span>
                  <span className={styles.infoValue}>
                    ${Math.round(selectedCustomer.totalSpent / selectedCustomer.orders).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.modalSection}>
              <div className={styles.sectionTitle}>Recent Orders</div>
              <div className={styles.ordersList}>
                {getCustomerOrders(selectedCustomer.id).length > 0 ? (
                  getCustomerOrders(selectedCustomer.id).slice(0, 5).map((order) => (
                    <div key={order.id} className={styles.orderItem}>
                      <div className={styles.orderItemInfo}>
                        <div className={styles.orderItemId}>Order #{order.id}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={styles.orderItemAmount}>
                        ${order.total.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                    No orders yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
