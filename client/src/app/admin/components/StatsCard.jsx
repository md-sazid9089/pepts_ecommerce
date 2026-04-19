'use client';

import styles from './StatsCard.module.css';

export default function StatsCard({ title, value, unit = '', trend = null, icon: Icon, iconColor = 'primary' }) {
  return (
    <div className={styles.statsCard}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{title}</span>
        {Icon && (
          <div className={`${styles.cardIcon} ${styles[iconColor] || ''}`}>
            <Icon size={24} color={iconColor === 'primary' ? 'var(--primary)' : 'currentColor'} />
          </div>
        )}
      </div>

      <div className={styles.cardValue}>
        {typeof value === 'number' && value > 1000 ? (value / 1000).toFixed(1) + 'K' : value}
        {unit && <span style={{ fontSize: '0.6em', marginLeft: '0.25em' }}>{unit}</span>}
      </div>

      <div className={styles.cardFooter}>
        {trend !== null && (
          <div className={`${styles.trendIndicator} ${trend >= 0 ? styles.trendUp : styles.trendDown}`}>
            <span className={styles.trendArrow}>↑</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
        <span className={styles.cardLabel}>vs last month</span>
      </div>
    </div>
  );
}
