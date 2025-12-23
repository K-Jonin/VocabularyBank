import React from 'react';
import styles from './Header.module.scss';

interface HeaderProps {}
export const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  return (
    <header className={styles.header}>
      <h1>
        <a href='#'>Vocabulary Bank</a>
      </h1>
    </header>
  );
};
