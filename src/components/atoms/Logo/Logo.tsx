import Link from 'next/link';
import Image from 'next/image';
import './Logo.css';

const Logo = () => {
    return (
        <Link href="/">
            <div className="logoContainer">
                <Image
                    src="/logoSmall.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="logoImage"
                />
                <span className="logoText">Wise Tracker</span>
            </div>
        </Link>
    );
};

export default Logo;