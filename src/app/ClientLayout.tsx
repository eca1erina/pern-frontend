"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/organisms/Sidebar/Sidebar';
import UserCard from '@/components/organisms/UserCard/UserCard';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="app-container">
      <button
        className="hamburger"
        aria-label="Open sidebar"
        onClick={() => setSidebarOpen(true)}
      >
        <span />
      </button>
      {/* Profile state button top right using UserCard organism */}
      <UserCard name="Jasmine" />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          tabIndex={-1}
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className="mainContent">{children}</main>
    </div>
  );
} 