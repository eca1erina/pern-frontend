'use client';

import ProfilePage from '@pages/ProfilePage/ProfilePage';
import styles from '../page.module.css';

export default function Profile() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ProfilePage />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
