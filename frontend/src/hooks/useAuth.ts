import { userService } from '@/api/services/userService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginRequest } from '@/types/index';

export const useAuth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * ログイン
   * @param email メールアドレス
   * @param password パスワード
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const payload: LoginRequest = { email: email, password: password };
      const res = await userService.login(payload);

      if (!res.success) {
        setErrorMessage('メールアドレスまたはパスワードに誤りがあります。');
        return;
      }

      if (res.data) {
        // トークン保存
        localStorage.setItem('token', res.data.token);
        // ページ遷移
        navigate('/');
      }
    } catch (err) {
      setErrorMessage('通信エラーが発生しました');
      console.error('エラー:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ログアウト
   */
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  /**
   * ログイン状態を確認
   */
  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token');
  };

  return { login, logout, isAuthenticated, errorMessage, isLoading };
};
