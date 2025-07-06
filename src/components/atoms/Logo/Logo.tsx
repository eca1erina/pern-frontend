import Link from 'next/link';
import Image from 'next/image';
import '@atoms/Logo/Logo.css';

const Logo = () => {
  return (
    <Link href="/">
      <span className="logo">
        <Image src="/logo.svg" alt="Logo" width={40} height={40} className="logoImage" />
        <span className="logoText">MyApp</span>
      </span>
    </Link>
  );
};

export default Logo;
