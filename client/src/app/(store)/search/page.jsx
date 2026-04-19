import { SearchResults } from '@/components/Search/Search';
import { Suspense } from 'react';
import styles from './page.module.css';

export const metadata = {
  title: 'Search Products',
  description: 'Search and filter products on Daraz',
};

export default function SearchPage() {
  return (
    <div className={styles.searchPage}>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
