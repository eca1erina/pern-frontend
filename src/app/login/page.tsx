'use client';

import LoginPage from '@pages/LoginPage/LoginPage';
import styles from '../page.module.css';

export default function Login() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <LoginPage />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
