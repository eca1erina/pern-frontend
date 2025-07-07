'use client';

import styles from '../page.module.css';
import SignUp from '@pages/SignupPage/Signup';

export default function Profile() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <SignUp/>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
