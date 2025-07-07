import Link from 'next/link';
import Image from 'next/image';
import './Logo.css';

const Logo = () => {
    return (
        <Link href="/" className="logoContainer">
            <Image
                src="/logoSmall.png"
                alt="Logo"
                width={40}
                height={40}
                className="logoImage"
            />
            <span className="logoText">MyApp</span>
        </Link>
    );
};

export default Logo;