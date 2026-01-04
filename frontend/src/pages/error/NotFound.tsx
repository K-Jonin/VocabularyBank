import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/button/Button';
import styles from './Error.module.scss';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorBox}>
        <div className={styles.errorIcon}>🔍</div>
        <h1>404 - ページが見つかりません</h1>

        <div className={styles.errorDetails}>
          <p className={styles.message}>お探しのページは見つかりませんでした</p>
          <p className={styles.status}>
            URLが間違っているか、ページが削除された可能性があります
          </p>
        </div>

        <div className={styles.actions}>
          <Button variant='primary' onClick={() => navigate(-1)}>
            前のページに戻る
          </Button>
          <Button variant='outline' onClick={() => navigate('/')}>
            ホームに戻る
          </Button>
        </div>
      </div>
    </div>
  );
};
