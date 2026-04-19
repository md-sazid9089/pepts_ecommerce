import { SearchResults } from '@/components/Search/Search';
import { Suspense } from 'react';
import { ProductGridSkeleton } from '@/components/UI/Skeleton';
import styles from './page.module.css';

export const metadata = {
  title: 'Search Products',
  description: 'Search and filter products on Daraz',
};

export default function SearchPage() {
  return (
    <div className={styles.searchPage}>
      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
