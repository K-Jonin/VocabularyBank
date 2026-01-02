import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useCommon } from '@/hooks/useCommon';
import './Layout.module.scss';
import { useAuth } from '@/hooks/useAuth';

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isSidebarOpen, setIsSidebarOpen } = useCommon();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Header />
      {isAuthenticated() && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}
      <main>{children}</main>
    </>
  );
};
