import React from 'react';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && props.isSidebarOpen) {
        props.setIsSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [props.isSidebarOpen, props.setIsSidebarOpen]);

  return (
    <>
      {/* オーバーレイ */}
      <div
        className={`
          ${styles.overlay}
          ${props.isSidebarOpen ? styles.overlay__open : styles.overlay__close}
        `}
        onClick={() => props.setIsSidebarOpen(false)}
      ></div>
      {/* サイドバー */}
      <div
        className={`
        ${styles.sidebar}
        ${props.isSidebarOpen ? styles.sidebar__open : styles.sidebar__close}
      `}
      ></div>
      <div
        className={`
          ${styles.hamburgerMenu}
          ${
            props.isSidebarOpen
              ? styles.hamburgerMenu__open
              : styles.hamburgerMenu__close
          }`}
        onClick={() => props.setIsSidebarOpen(!props.isSidebarOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </>
  );
};
