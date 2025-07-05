import Link from 'next/link';
import Image from 'next/image';
import styles from './Logo.module.css';

const Logo = () => {
    return (
        <Link href="/" className={styles.logoContainer}>
            <Image
                src="/logo.svg"
                alt="Logo"
                width={40}
                height={40}
                className={styles.logoImage}
            />
            <span className={styles.logoText}>MyApp</span>
        </Link>
    );
};

export default Logo;