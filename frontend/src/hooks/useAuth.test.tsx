import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from './useAuth';
import { userService } from '@/api/services/userService';
import type { ReactNode } from 'react';

// userServiceをモック化
vi.mock('@/api/services/userService', () => ({
  userService: {
    login: vi.fn(),
  },
}));

// react-router-domのuseNavigateをモック化
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
  );

  describe('login', () => {
    it('ログイン成功時、トークンを保存してホームページに遷移する', async () => {
      // Arrange
      const mockToken = 'test-token-123';
      vi.mocked(userService.login).mockResolvedValue({
        success: true,
        data: { token: mockToken },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act
      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      // Assert
      await waitFor(() => {
        expect(userService.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
        expect(localStorage.getItem('token')).toBe(mockToken);
        expect(mockNavigate).toHaveBeenCalledWith('/');
        expect(result.current.errorMessage).toBe('');
      });
    });

    it('ログイン失敗時、エラーメッセージを表示する', async () => {
      // Arrange
      vi.mocked(userService.login).mockResolvedValue({
        success: false,
        data: null,
        error: {
          code: 'E002',
          message: '認証に失敗しました',
          details: null,
        },
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act
      await act(async () => {
        await result.current.login('test@example.com', 'wrong-password');
      });

      // Assert
      expect(result.current.errorMessage).toBe(
        'メールアドレスまたはパスワードに誤りがあります。'
      );
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('通信エラー時、エラーメッセージを表示する', async () => {
      // Arrange
      vi.mocked(userService.login).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act
      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      // Assert
      expect(result.current.errorMessage).toBe('通信エラーが発生しました');
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('ログイン中はローディング状態になる', async () => {
      // Arrange
      vi.mocked(userService.login).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  success: true,
                  data: { token: 'test-token' },
                  error: null,
                }),
              100
            )
          )
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act & Assert
      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.login('test@example.com', 'password123');
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('logout', () => {
    it('ログアウト時、トークンを削除してログインページに遷移する', () => {
      // Arrange
      localStorage.setItem('token', 'test-token');
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act
      act(() => {
        result.current.logout();
      });

      // Assert
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('isAuthenticated', () => {
    it('トークンがある場合、trueを返す', () => {
      // Arrange
      localStorage.setItem('token', 'test-token');
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act
      const isAuth = result.current.isAuthenticated();

      // Assert
      expect(isAuth).toBe(true);
    });

    it('トークンがない場合、falseを返す', () => {
      // Arrange
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Act
      const isAuth = result.current.isAuthenticated();

      // Assert
      expect(isAuth).toBe(false);
    });
  });
});
