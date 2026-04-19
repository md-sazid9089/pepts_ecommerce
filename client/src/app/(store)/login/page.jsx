import { LoginForm } from '@/components/Auth/Auth';
import styles from './page.module.css';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your Daraz account',
};

export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <LoginForm />
    </div>
  );
}
