import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('トークンがある場合、子要素を表示する', () => {
    // Arrange
    localStorage.setItem('token', 'test-token');

    // Act
    render(
      <MemoryRouter initialEntries={['/']}>
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
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('保護されたコンテンツ')).toBeInTheDocument();
  });

  it('トークンがない場合、ログインページにリダイレクトする', () => {
    // Arrange
    localStorage.removeItem('token');

    // Act
    render(
      <MemoryRouter initialEntries={['/']}>
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
      </MemoryRouter>
    );

    // Assert
    expect(screen.queryByText('保護されたコンテンツ')).not.toBeInTheDocument();
    expect(screen.getByText('ログインページ')).toBeInTheDocument();
  });
});
