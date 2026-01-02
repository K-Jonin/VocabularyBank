import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * ログイン済みユーザーがアクセスできないルートを保護するコンポーネント
 * 未ログインの場合は子要素を表示、ログイン済みの場合はホームページへリダイレクト
 */
export const PublicRoute = ({ children }: PublicRouteProps) => {
  // トークンがある場合はホームページへリダイレクト
  if (useAuth().isAuthenticated()) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};
