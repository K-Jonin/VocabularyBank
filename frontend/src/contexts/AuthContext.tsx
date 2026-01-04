import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { userService } from '@/api/services/userService';
import { LoginRequest } from '@/types/index';

interface AuthContextType {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  errorMessage: string;
  isLoading: boolean;
  authenticated: boolean | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    /**
     * 認証状態を確認
     */
    const checkAuth = async () => {
      try {
        const response = await userService.me();
        setAuthenticated(
          response.success && response.data?.authenticated === true
        );
      } catch (error) {
        setAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  /**
   * ログイン
   * @param email メールアドレス
   * @param password パスワード
   */
  const login = async (email: string, password: string) => {
    let success = false;
    try {
      setIsLoading(true);
      setErrorMessage('');

      const payload: LoginRequest = { email: email, password: password };
      const res = await userService.login(payload);

      if (!res.success) {
        setErrorMessage('メールアドレスまたはパスワードに誤りがあります。');
        return success;
      }

      setAuthenticated(true);
      success = true;
    } catch (err) {
      setErrorMessage('通信エラーが発生しました');
      console.error('エラー:', err);
      return false;
    } finally {
      setIsLoading(false);
      return success;
    }
  };

  /**
   * ログアウト
   */
  const logout = async () => {
    try {
      await userService.logout();
      setAuthenticated(false);
      return true;
    } catch (err) {
      console.error('ログアウトエラー:', err);
      setAuthenticated(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        errorMessage,
        isLoading,
        authenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
