import React from 'react';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1>
        <a href='#'>Vocabulary Bank</a>
      </h1>
    </header>
  );
};
