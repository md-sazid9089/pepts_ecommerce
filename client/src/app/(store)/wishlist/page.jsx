import { WishlistView } from '@/components/Wishlist/Wishlist';
import styles from './page.module.css';

export const metadata = {
  title: 'My Wishlist',
  description: 'View your saved wishlist items on Daraz',
};

export default function WishlistPage() {
  return (
    <div className={styles.wishlistPage}>
      <WishlistView />
    </div>
  );
}
