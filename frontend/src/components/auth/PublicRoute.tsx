import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * ログイン済みユーザーがアクセスできないルートを保護するコンポーネント
 * 未ログインの場合は子要素を表示、ログイン済みの場合はホームページへリダイレクト
 */
export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { authenticated } = useAuth();

  // 認証状態確認中はローディング表示
  if (authenticated === null) {
    return <></>;
  }

  // 認証済みの場合はホームページへリダイレクト
  if (authenticated) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};
