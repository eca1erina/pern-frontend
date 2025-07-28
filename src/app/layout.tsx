
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClientLayout from './client-layout';
import { Toaster } from 'react-hot-toast';
import { LoaderProvider } from '@/context/LoaderContext';
import { CurrencyProvider } from '@/context/CurrencyContext'; 

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Personal Expense Manager',
  description: 'Your Personal Expense Manager',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoaderProvider>
      <CurrencyProvider> 
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'linear-gradient(120deg, #f4f2fd 60%, #e0e7ff 85%, #d1c4f6 100%)',
              color: '#471d8b',
              borderRadius: '16px',
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(123, 108, 255, 0.10)',
              padding: '0.8rem 1.5rem',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <html lang="en">
          <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable}`}>
            <ClientLayout>{children}</ClientLayout>
          </body>
        </html>
      </CurrencyProvider>
    </LoaderProvider>
  );
}
