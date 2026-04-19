import Link from 'next/link';
import { CategoriesView } from '@/components/Categories/Categories';
import styles from './page.module.css';

export const metadata = {
  title: 'Wholesale Categories | Precious Play Wholesale',
  description: 'Browse bulk doll categories, verified manufacturers, and industrial sourcing options at Precious Play Wholesale.',
};

export default function CategoriesPage() {
  return (
    <div className={styles.categoriesPage}>
      <header className={styles.pageHeader}>
        <div className="container">
          <nav className="breadcrumb">
            <Link href="/">Home</Link> <span>›</span> <span>Categories</span>
          </nav>
        </div>
      </header>
      <CategoriesView />
    </div>
  );
}
