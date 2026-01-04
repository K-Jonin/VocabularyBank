import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * 認証が必要なルートを保護するコンポーネント
 * ログイン済みの場合は子要素を表示、未ログインの場合はログインページへリダイレクト
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { authenticated } = useAuth();

  // 認証状態確認中
  if (authenticated === null) {
    return <></>;
  }

  // 未認証の場合はログインページへリダイレクト
  if (!authenticated) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};
