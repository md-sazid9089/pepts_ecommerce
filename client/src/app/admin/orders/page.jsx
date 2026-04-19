'use client';

import { useState } from 'react';
import OrdersList from '../components/OrdersList';
import { orders as initialOrders } from '@/data/adminData';
import styles from './Orders.module.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState('All');

  const STATUS_OPTIONS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered'];

  const filteredOrders = statusFilter === 'All'
    ? orders
    : orders.filter(o => o.status === statusFilter);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
  };

  return (
    <div className={styles.ordersPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Order Management</h1>
      </div>

      <div className={styles.filterBar}>
        <label style={{ fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Filter by Status:
        </label>
        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <span style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>
          Showing {filteredOrders.length} of {orders.length} orders
        </span>
      </div>

      <OrdersList
        orders={filteredOrders}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
