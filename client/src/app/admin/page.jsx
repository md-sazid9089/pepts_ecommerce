'use client';

import { FiBarChart, FiPackage, FiTrendingUp, FiAward } from 'react-icons/fi';
import StatsCard from './components/StatsCard';
import SalesChart from './components/SalesChart';
import OrdersChart from './components/OrdersChart';
import { dailySalesData, topProducts, orders, customers } from '@/data/adminData';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  // Calculate stats
  const totalSales = dailySalesData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = orders.length;
  const newCustomers = customers.filter(c => new Date(c.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
  const pendingShipments = orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length;

  return (
    <div className={styles.dashboardPage}>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatsCard
          title="Total Sales"
          value={Math.round(totalSales / 100000)}
          unit="L"
          trend={12}
          icon={FiTrendingUp}
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          trend={8}
          icon={FiPackage}
          iconColor="success"
        />
        <StatsCard
          title="New Customers"
          value={newCustomers}
          trend={5}
          icon={FiAward}
          iconColor="info"
        />
        <StatsCard
          title="Pending Shipments"
          value={pendingShipments}
          trend={-3}
          icon={FiBarChart}
          iconColor="warning"
        />
      </div>

      {/* Charts Row */}
      <div className={styles.chartsRow}>
        <div className={styles.chartSection}>
          <div className={styles.chartTitle}><FiTrendingUp /> Daily Revenue</div>
          <div className={styles.chartContainer}>
            <SalesChart data={dailySalesData} />
          </div>
        </div>

        <div className={styles.chartSection}>
          <div className={styles.chartTitle}><FiBarChart /> Order Volume</div>
          <div className={styles.chartContainer}>
            <OrdersChart data={dailySalesData} />
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className={styles.topProductsSection}>
        <div className={styles.topProductsTitle}><FiAward /> Top Performing Products</div>
        <div className={styles.productList}>
          {topProducts.map((product) => (
            <div key={product.id} className={styles.productItem}>
              <div className={styles.productInfo}>
                <div className={styles.productName}>{product.name}</div>
                <div className={styles.productStats}>
                  <span><FiPackage /> {product.sold} sold</span>
                  <span>${(product.revenue * 100000).toLocaleString()}</span>
                </div>
              </div>
              <div className={`${styles.productTrend} ${product.trend < 0 ? styles.down : ''}`}>
                <span>{product.trend > 0 ? '↑' : '↓'}</span>
                <span>{Math.abs(product.trend)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
