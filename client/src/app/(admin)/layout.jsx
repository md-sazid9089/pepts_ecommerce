'use client';

import AdminSidebar from '@/app/admin/components/AdminSidebar';
import AdminHeader from '@/app/admin/components/AdminHeader';
import styles from '@/app/admin/AdminLayout.module.css';

/**
 * Admin Route Group Layout
 * Wraps all admin routes with AdminSidebar and AdminHeader
 * Routes inside (admin) group will use this layout
 * 
 * Note: Current admin routes are at /admin, /admin/products, etc.
 * When ready, move them into (admin) folder structure
 */
export default function AdminLayoutGroup({ children }) {
  return (
    <div className={styles.adminContainer}>
      <AdminSidebar />
      <div className={styles.adminContent}>
        <AdminHeader />
        <main className={styles.adminMain}>
          {children}
        </main>
      </div>
    </div>
  );
}
