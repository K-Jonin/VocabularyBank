import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/common/button/Button';
import styles from './Error.module.scss';

interface ErrorInfo {
  status?: number;
  message?: string;
  code?: string;
}

export const Error: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getErrorInfo = (): ErrorInfo | null => {
    const info = searchParams.get('info');
    const type = searchParams.get('type');

    if (info) {
      try {
        return JSON.parse(decodeURIComponent(info));
      } catch {
        return null;
      }
    }

    if (type === 'network') {
      return {
        message: 'ネットワークエラーが発生しました',
      };
    }

    if (type === 'unknown') {
      return {
        message: '予期しないエラーが発生しました',
      };
    }

    return null;
  };

  const errorInfo = getErrorInfo();

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorBox}>
        <div className={styles.errorIcon}>⚠️</div>
        <h1>エラーが発生しました</h1>

        {errorInfo && (
          <div className={styles.errorDetails}>
            {errorInfo.status && (
              <p className={styles.status}>エラーコード: {errorInfo.status}</p>
            )}
            <p className={styles.message}>
              {errorInfo.message || 'エラーが発生しました'}
            </p>
            {errorInfo.code && (
              <p className={styles.code}>エラー識別子: {errorInfo.code}</p>
            )}
          </div>
        )}

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
