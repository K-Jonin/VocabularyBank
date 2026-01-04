import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { userService } from '@/api/services/userService';
import type { ReactNode } from 'react';

// userServiceをモック化
vi.mock('@/api/services/userService', () => ({
  userService: {
    login: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
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

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );

  describe('初期化', () => {
    it('マウント時にバックエンドの認証状態を確認する', async () => {
      // Arrange
      vi.mocked(userService.me).mockResolvedValue({
        success: true,
        data: { authenticated: true, email: 'test@example.com' },
        error: null,
      });

      // Act
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Assert - 初期状態はnull
      expect(result.current.authenticated).toBe(null);

      // 認証確認後はtrue
      await waitFor(() => {
        expect(result.current.authenticated).toBe(true);
      });
      expect(userService.me).toHaveBeenCalledTimes(1);
    });

    it('認証されていない場合はfalseを設定する', async () => {
      // Arrange
      vi.mocked(userService.me).mockResolvedValue({
        success: false,
        data: null,
        error: { code: 'E002', message: '認証が必要です', details: null },
      });

      // Act
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Assert
      await waitFor(() => {
        expect(result.current.authenticated).toBe(false);
      });
    });
  });

  describe('login', () => {
    it('ログイン成功時、認証状態を更新する', async () => {
      // Arrange
      vi.mocked(userService.me).mockResolvedValue({
        success: false,
        data: null,
        error: null,
      });
      vi.mocked(userService.login).mockResolvedValue({
        success: true,
        data: { message: 'ログインに成功しました' },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // 初期化待ち
      await waitFor(() => {
        expect(result.current.authenticated).toBe(false);
      });

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
        expect(result.current.authenticated).toBe(true);
        expect(result.current.errorMessage).toBe('');
      });
    });

    it('ログイン失敗時、エラーメッセージを表示する', async () => {
      // Arrange
      vi.mocked(userService.me).mockResolvedValue({
        success: false,
        data: null,
        error: null,
      });
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

      await waitFor(() => {
        expect(result.current.authenticated).toBe(false);
      });

      // Act
      await act(async () => {
        await result.current.login('test@example.com', 'wrong-password');
      });

      // Assert
      expect(result.current.errorMessage).toBe(
        'メールアドレスまたはパスワードに誤りがあります。'
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('通信エラー時、エラーメッセージを表示する', async () => {
      // Arrange
      vi.mocked(userService.me).mockResolvedValue({
        success: false,
        data: null,
        error: null,
      });
      vi.mocked(userService.login).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.authenticated).toBe(false);
      });

      // Act
      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      // Assert
      expect(result.current.errorMessage).toBe('通信エラーが発生しました');
    });
  });

  describe('logout', () => {
    it('ログアウト成功時、認証状態をfalseに更新する', async () => {
      // Arrange
      vi.mocked(userService.me).mockResolvedValue({
        success: true,
        data: { authenticated: true, email: 'test@example.com' },
        error: null,
      });
      vi.mocked(userService.logout).mockResolvedValue({
        success: true,
        data: { message: 'ログアウトしました' },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.authenticated).toBe(true);
      });

      // Act
      await act(async () => {
        await result.current.logout();
      });

      // Assert
      await waitFor(() => {
        expect(userService.logout).toHaveBeenCalled();
        expect(result.current.authenticated).toBe(false);
      });
    });

    it('ログアウト失敗時も認証状態をfalseに更新する', async () => {
      // Arrange
      vi.mocked(userService.me).mockResolvedValue({
        success: true,
        data: { authenticated: true, email: 'test@example.com' },
        error: null,
      });
      vi.mocked(userService.logout).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.authenticated).toBe(true);
      });

      // Act
      await act(async () => {
        await result.current.logout();
      });

      // Assert
      await waitFor(() => {
        expect(result.current.authenticated).toBe(false);
      });
    });
  });

  describe('isAuthenticated', () => {
    it('認証済みの場合trueを返す', async () => {
      // Arrange
      vi.mocked(userService.me).mockResolvedValue({
        success: true,
        data: { authenticated: true, email: 'test@example.com' },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Assert
      await waitFor(() => {
        expect(result.current.authenticated).toBe(true);
      });
    });

    it('未認証の場合falseを返す', async () => {
      // Arrange
      vi.mocked(userService.me).mockResolvedValue({
        success: false,
        data: null,
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Assert
      await waitFor(() => {
        expect(result.current.authenticated).toBe(false);
      });
    });
  });
});
