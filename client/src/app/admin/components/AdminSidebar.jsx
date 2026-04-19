'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiBarChart, FiPackage, FiShoppingCart, FiUsers, FiLogOut } from 'react-icons/fi';
import styles from '../AdminLayout.module.css';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: FiBarChart },
    { href: '/admin/products', label: 'Products', icon: FiPackage },
    { href: '/admin/orders', label: 'Orders', icon: FiShoppingCart },
    { href: '/admin/customers', label: 'Customers', icon: FiUsers },
  ];

  return (
    <aside className={styles.adminSidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarLogo}>
          <span>⚙️</span>
          <span>Admin</span>
        </div>
      </div>

      <nav className={styles.sidebarNav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon className={styles.navIcon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <button className={styles.logoutBtn} onClick={() => window.location.href = '/'}>
          <FiLogOut style={{ marginRight: '0.5rem' }} />
          Back to Store
        </button>
      </div>
    </aside>
  );
}
