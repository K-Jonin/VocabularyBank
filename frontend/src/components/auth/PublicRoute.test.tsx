import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import { userService } from '@/api/services/userService';
import type { ReactNode } from 'react';

// userServiceをモック化
vi.mock('@/api/services/userService', () => ({
  userService: {
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

describe('PublicRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('未認証の場合、子要素を表示する', async () => {
    // Arrange
    vi.mocked(userService.me).mockRejectedValue(new Error('Unauthorized'));

    // Act
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <Routes>
            <Route
              path='/login'
              element={
                <PublicRoute>
                  <div>ログインフォーム</div>
                </PublicRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText('ログインフォーム')).toBeInTheDocument();
    });
  });

  it('認証済みの場合、ホームページにリダイレクトする', async () => {
    // Arrange
    vi.mocked(userService.me).mockResolvedValue({
      success: true,
      data: { authenticated: true, email: 'test@example.com' },
      error: null,
    });

    // Act
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          {/* 認証が必要なルート */}
          <Route
            path='/*'
            element={
              <AuthProvider>
                <Routes>
                  <Route
                    path='/login'
                    element={
                      <PublicRoute>
                        <div>ログインフォーム</div>
                      </PublicRoute>
                    }
                  />
                  <Route path='/' element={<div>ホームページ</div>} />
                </Routes>
              </AuthProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Assert
    await waitFor(() => {
      expect(screen.queryByText('ログインフォーム')).not.toBeInTheDocument();
      expect(screen.getByText('ホームページ')).toBeInTheDocument();
    });
  });
});
