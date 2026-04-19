'use client';

import { useState } from 'react';
import { FiSearch, FiBell, FiSettings } from 'react-icons/fi';
import styles from '../AdminLayout.module.css';

export default function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={styles.adminHeader}>
      <div className={styles.headerContent}>
        <div className={styles.searchBar}>
          <FiSearch size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.headerRight}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}>
            <FiBell size={20} color="var(--text-secondary)" />
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}>
            <FiSettings size={20} color="var(--text-secondary)" />
          </button>

          <div className={styles.profileSection}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Admin User</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Manager</div>
            </div>
            <div className={styles.profileAvatar}>A</div>
          </div>
        </div>
      </div>
    </div>
  );
}
