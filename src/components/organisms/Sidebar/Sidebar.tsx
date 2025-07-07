'use client'; 

import React from 'react';
import { usePathname } from 'next/navigation'; 
import Logo from '@/components/atoms/Logo/Logo';
import NavLink from '@/components/molecules/NavLink/NavLink';
import './Sidebar.css'; 
import { LayoutDashboard, ArrowRightLeft, PieChart, Landmark, Settings, LogOut } from 'lucide-react';

const mainNavLinks = [
  { href: '/', label: 'Dashboard', iconName: 'LayoutDashboard' },
  { href: '/income', label: 'Income', iconName: 'Landmark' },
  { href: '/expenses', label: 'Your Expenses', iconName: 'ArrowRightLeft' },
  { href: '/reports', label: 'Reports', iconName: 'FileText' },
];

const bottomNavLinks = [
    { href: '/settings', label: 'Setting', iconName: 'Settings' },
    { href: '/logout', label: 'Logout', iconName: 'LogOut' },
]

const Sidebar = () => {
  const pathname = usePathname(); 

  return (
    <aside className="sidebar"> 
      <div className="logoContainer"> 
        <Logo />
      </div>

      <nav className="nav">
        <ul className="navList">
          {mainNavLinks.map((link) => (
            <li key={link.label}>
              <NavLink 
                href={link.href}
                iconName={link.iconName as any}
                isActive={pathname === link.href}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="footer">
        <ul className="navList">
        {bottomNavLinks.map((link) => (
            <li key={link.label}>
              <NavLink 
                href={link.href}
                iconName={link.iconName as any}
                isActive={pathname === link.href}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;