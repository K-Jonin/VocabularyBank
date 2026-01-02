import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Login } from './Login';
import { useAuth } from '@/hooks/useAuth';
import userEvent from '@testing-library/user-event';

// useAuthフックをモック化
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Login', () => {
  // モックされたuseAuthの型を定義
  const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // useAuthのデフォルトの戻り値を設定
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
      errorMessage: null,
      isLoading: false,
      isAuthenticated: vi.fn(() => false),
    });
  });

  describe('レンダリング', () => {
    it('ログインフォームの表示確認', () => {
      render(<Login />);
      const heading = screen.getByRole('heading', { name: 'Login' });
      expect(heading).toBeInTheDocument();
    });

    it('メールアドレス入力欄の表示確認', () => {
      render(<Login />);
      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('パスワード入力欄の表示確認', () => {
      render(<Login />);
      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('ログインボタンの表示確認', () => {
      render(<Login />);
      const loginButton = screen.getByRole('button', { name: 'Login' });
      expect(loginButton).toBeInTheDocument();
    });
  });

  describe('入力値の変更', () => {
    it('メールアドレス入力欄の入力確認', async () => {
      render(<Login />);
      const emailInput = screen.getByPlaceholderText('Email');
      await userEvent.type(emailInput, 'text@example.com');
      expect(emailInput).toHaveValue('text@example.com');
    });

    it('パスワード入力欄の入力確認', async () => {
      render(<Login />);
      const passwordInput = screen.getByPlaceholderText('Password');
      await userEvent.type(passwordInput, 'password');
      expect(passwordInput).toHaveValue('password');
    });
  });

  describe('フォーム送信', () => {
    it('フォーム送信時のlogin関数呼び出し確認', async () => {
      render(<Login />);
      await userEvent.type(
        screen.getByPlaceholderText('Email'),
        'text@example.com'
      );
      await userEvent.type(screen.getByPlaceholderText('Password'), 'password');
      await userEvent.click(screen.getByRole('button', { name: 'Login' }));
      expect(mockLogin).toHaveBeenCalledWith('text@example.com', 'password');
    });
  });

  describe('エラー表示', () => {
    it('useAuthからのエラーメッセージ表示確認', () => {
      mockUseAuth.mockReturnValue({
        login: mockLogin,
        logout: vi.fn(),
        errorMessage: 'メールアドレスまたはパスワードに誤りがあります。',
        isLoading: false,
        isAuthenticated: vi.fn(() => false),
      });

      render(<Login />);

      expect(screen.getByRole('alert')).toHaveTextContent(
        'メールアドレスまたはパスワードに誤りがあります。'
      );
    });

    it('エラーメッセージが表示されないことを確認', () => {
      render(<Login />);
      expect(screen.getByRole('alert')).toHaveTextContent('');
    });
  });

  describe('ローディング状態', () => {
    it('isLoading=trueの場合、ボタンがローディング状態になる', () => {
      mockUseAuth.mockReturnValue({
        login: mockLogin,
        logout: vi.fn(),
        errorMessage: null,
        isLoading: true,
        isAuthenticated: vi.fn(() => false),
      });

      render(<Login />);

      const buttons = screen.getAllByRole('button');
      const loginButton = buttons.find(
        (btn) => (btn as HTMLButtonElement).type === 'submit'
      );
      expect(loginButton).toBeDisabled();
    });

    it('isLoading=falseの場合、ボタンが通常状態', () => {
      render(<Login />);

      const loginButton = screen.getByRole('button', { name: 'Login' });
      expect(loginButton).toBeEnabled();
    });
  });

  describe('パスワードマスク', () => {
    it('パスワード入力欄のマスク表示ボタン表示確認', () => {
      render(<Login />);
      const maskButton = screen.getByRole('button', {
        name: 'パスワードを表示',
      });
      expect(maskButton).toBeInTheDocument();
    });

    it('マスク切り替えボタンをクリックでパスワードの表示/非表示', async () => {
      render(<Login />);

      const maskButton = screen.getByRole('button', {
        name: 'パスワードを表示',
      });
      const passwordInput = screen.getByPlaceholderText('Password');
      await userEvent.type(passwordInput, 'password');

      // 初期状態: type="password"でマスクされている
      expect(passwordInput).toHaveAttribute('type', 'password');

      // クリックでtype="text"に変わり、パスワードが表示される
      await userEvent.click(maskButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(passwordInput).toHaveValue('password');

      // もう一度クリックでtype="password"に戻り、マスクされる
      await userEvent.click(maskButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveValue('password');
    });
  });
});
