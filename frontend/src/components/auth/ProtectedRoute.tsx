import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * 認証が必要なルートを保護するコンポーネント
 * ログイン済みの場合は子要素を表示、未ログインの場合はログインページへリダイレクト
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // トークンがない場合はログインページへリダイレクト
  if (!useAuth().isAuthenticated()) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};
