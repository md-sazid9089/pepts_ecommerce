import { ProfileView } from '@/components/Profile/Profile';
import styles from './page.module.css';

export const metadata = {
  title: 'My Account',
  description: 'View and manage your Daraz account',
};

export default function ProfilePage() {
  return (
    <div className={styles.profilePage}>
      <ProfileView />
    </div>
  );
}
