import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
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

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('認証済みの場合、子要素を表示する', async () => {
    // Arrange
    vi.mocked(userService.me).mockResolvedValue({
      success: true,
      data: { authenticated: true, email: 'test@example.com' },
      error: null,
    });

    // Act
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <Routes>
            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <div>保護されたコンテンツ</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText('保護されたコンテンツ')).toBeInTheDocument();
    });
  });

  it('未認証の場合、ログインページにリダイレクトする', async () => {
    // Arrange
    vi.mocked(userService.me).mockRejectedValue(new Error('Unauthorized'));

    // Act
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <Routes>
            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <div>保護されたコンテンツ</div>
                </ProtectedRoute>
              }
            />
            <Route path='/login' element={<div>ログインページ</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Assert
    await waitFor(() => {
      expect(
        screen.queryByText('保護されたコンテンツ')
      ).not.toBeInTheDocument();
      expect(screen.getByText('ログインページ')).toBeInTheDocument();
    });
  });
});
