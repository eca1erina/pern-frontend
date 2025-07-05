import Link from 'next/link';
import Icon from '@/components/atoms/Icon/Icon';
import { NavLinkProps } from './INavLink'; 
import './NavLink.css';

const NavLink = ({ href, iconName, isActive = false, children }: NavLinkProps) => {
  const linkClasses = `navLink ${isActive ? 'active' : ''}`;

  return (
    <Link href={href} className={linkClasses}>
      <Icon name={iconName} size={20} />
      <span>{children}</span>
    </Link>
  );
};

export default NavLink;