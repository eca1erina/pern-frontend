'use client';

import styles from '../page.module.css';
import SignUpPage from '@pages/SignupPage/SignupPage';

export default function Profile() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <SignUpPage />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
