import { RegisterForm } from '@/components/Auth/Auth';
import styles from './page.module.css';

export const metadata = {
  title: 'Create Account',
  description: 'Create a new Daraz account',
};

export default function RegisterPage() {
  return (
    <div className={styles.registerPage}>
      <RegisterForm />
    </div>
  );
}
