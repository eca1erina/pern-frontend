'use client'; 

import React, { ReactNode } from 'react';
import { LoaderProvider } from '@/context/LoaderContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apolloClient';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LoaderProvider>
      <ApolloProvider client={client}>
        <CurrencyProvider>
          {children}
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
        </CurrencyProvider>
      </ApolloProvider>
    </LoaderProvider>
  );
}
