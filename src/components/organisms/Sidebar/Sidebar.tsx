'use client'; 

import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { icons } from 'lucide-react';
import Logo from '@/components/atoms/Logo/Logo';
import './Sidebar.css';
import Icon from '@/components/atoms/Icon/Icon';
import NavLink from '@/components/molecules/NavLink/NavLink';
import { usePathname } from 'next/navigation';

const navLinks: { href: string; iconName: keyof typeof icons; label: string }[] = [
  { href: '/dashboard', iconName: 'LayoutDashboard', label: 'Dashboard' },
  { href: '/income', iconName: 'TrendingUp', label: 'Income' },
  { href: '/expenses', iconName: 'CreditCard', label: 'Your Expenses' },
  { href: '/reports', iconName: 'FileText', label: 'Reports' },
];

const Sidebar = () => {
  const currentPath = usePathname();
  const navRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0, opacity: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const activeIdx = navLinks.findIndex(link => link.href === currentPath);
  const showIndicator = mounted && activeIdx !== -1;

  useLayoutEffect(() => {
    const activeRef = navRefs.current[activeIdx];
    if (activeRef) {
      const { offsetTop, offsetHeight } = activeRef;
      setIndicatorStyle({ top: offsetTop, height: offsetHeight, opacity: 1 });
    } else {
      setIndicatorStyle({ top: 0, height: 0, opacity: 0 });
    }
  }, [currentPath, activeIdx]);

  return (
    <aside className="sidebar">
      <div className="logoContainer">
        <Logo />
      </div>
      <nav className="nav" style={{ position: 'relative' }}>
        <ul className="navList" style={{ position: 'relative' }}>
          {navLinks.map((link, idx) => (
            <li
              key={link.href}
              ref={el => { navRefs.current[idx] = el; }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <NavLink
                href={link.href}
                iconName={link.iconName}
                isActive={currentPath === link.href}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="footer">
        <div className="items">
          <a href="/settings" className="settings-btn">
            <span className="settings-icon"><Icon name="Settings" size={20} /></span>
            <span>Settings</span>
          </a>
        </div>
        <div className="items">
          <a href="/logout" className="logout-btn">
            <span className="logout-icon"><Icon name="LogOut" size={20} /></span>
            <span>Logout</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 