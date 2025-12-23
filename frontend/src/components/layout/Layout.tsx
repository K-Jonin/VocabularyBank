import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useCommon } from '@/hooks/useCommon';

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isSidebarOpen, setIsSidebarOpen } = useCommon();
  return (
    <>
      <Header />
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main>{children}</main>
    </>
  );
};
