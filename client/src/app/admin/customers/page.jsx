'use client';

import { useMemo } from 'react';
import CustomersList from '../components/CustomersList';
import { customers as initialCustomers, orders } from '@/data/adminData';
import styles from './Customers.module.css';

export default function CustomersPage() {
  const stats = useMemo(() => {
    const activeCustomers = initialCustomers.filter(c => c.status === 'Active').length;
    const totalRevenue = initialCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = Math.round(totalRevenue / initialCustomers.reduce((sum, c) => sum + c.orders, 0));

    return {
      totalCustomers: initialCustomers.length,
      activeCustomers,
      totalRevenue,
      avgOrderValue
    };
  }, []);

  return (
    <div className={styles.customersPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Customer Management</h1>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.totalCustomers}</div>
          <div className={styles.statLabel}>Total Customers</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.activeCustomers}</div>
          <div className={styles.statLabel}>Active Customers</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>${Math.round(stats.totalRevenue / 100000)}L</div>
          <div className={styles.statLabel}>Total Revenue</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>${stats.avgOrderValue.toLocaleString()}</div>
          <div className={styles.statLabel}>Avg Order Value</div>
        </div>
      </div>

      <CustomersList customers={initialCustomers} orders={orders} />
    </div>
  );
}
