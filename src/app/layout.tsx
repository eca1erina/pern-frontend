import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/organisms/Sidebar/Sidebar';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Personal Expense Manager',
  description: 'Your Personal Expense Manager',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable}`}>
        <div className="app-container">
          {/* Sidebar component for navigation */}
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
