'use client';

import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { icons } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/atoms/Logo/Logo';
import './Sidebar.css';
import Icon from '@/components/atoms/Icon/Icon';
import NavLink from '@/components/molecules/NavLink/NavLink';
import { usePathname } from 'next/navigation';
import axios from 'axios';

const navLinks: { href: string; iconName: keyof typeof icons; label: string }[] = [
  { href: '/dashboard', iconName: 'LayoutDashboard', label: 'Dashboard' },
  { href: '/income', iconName: 'TrendingUp', label: 'Income' },
  { href: '/expenses', iconName: 'CreditCard', label: 'Expenses' },
  { href: '/reports', iconName: 'FileText', label: 'Reports' },
];

const Sidebar = () => {
  const router = useRouter();
  const currentPath = usePathname();
  const navRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0, opacity: 0 });
  const [mounted, setMounted] = useState(false);

  const [userId, setUserId] = useState<number | null>(null);
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const session = sessionStorage.getItem('user');
    if (session) {
      const parsed = JSON.parse(session);
      console.log('User ID from session:', parsed.id);
      setUserId(parsed.id);
    }
  }, []);

  useEffect(() => {
    const fetchAITips = async () => {
      try {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${API_URL}/api/analyze-transactions?user_id=${userId}`);
        console.log('AI tips response:', res.data);
        setAiTips(res.data.tips || []);
      } catch (err) {
        console.error('Failed to fetch AI tips:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId !== null) {
      fetchAITips();
    }
  }, [userId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeIdx = navLinks.findIndex((link) => link.href === currentPath);

  useLayoutEffect(() => {
    const activeRef = navRefs.current[activeIdx];
    if (activeRef) {
      const { offsetTop, offsetHeight } = activeRef;
      setIndicatorStyle({ top: offsetTop, height: offsetHeight, opacity: 1 });
    } else {
      setIndicatorStyle({ top: 0, height: 0, opacity: 0 });
    }
  }, [currentPath, activeIdx]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    router.push('/login');
  };

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
              ref={(el) => {
                navRefs.current[idx] = el;
              }}
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

      {userId && (
        <div className="aiAssistantContainer">
          <div className="aiMessageBubble">👋 Hi, I'm your AI assistant!</div>
          {loading ? (
            <div className="aiMessageBubble">Analyzing your finances...</div>
          ) : (
            aiTips.map((tip, idx) => (
              <div key={idx} className="aiMessageBubble">
                💡 {tip}
              </div>
            ))
          )}
        </div>
      )}

      <div className="footer">
        <div className="items">
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">
              <Icon name="LogOut" size={20} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
