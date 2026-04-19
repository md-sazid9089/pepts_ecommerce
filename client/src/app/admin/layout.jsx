'use client';

import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import styles from './AdminLayout.module.css';

export default function AdminLayout({ children }) {
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
