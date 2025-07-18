'use client';

import React, { createContext, useContext, useState } from 'react';
import Loader from '@/components/atoms/Loader/Loader';

const LoaderContext = createContext({
  show: () => {},
  hide: () => {},
});

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <LoaderContext.Provider value={{ show, hide }}>
      {visible && <Loader />}
      {children}
    </LoaderContext.Provider>
  );
}; 