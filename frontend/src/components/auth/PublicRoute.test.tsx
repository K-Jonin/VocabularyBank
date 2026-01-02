import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';

describe('PublicRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('トークンがない場合、子要素を表示する', () => {
    // Arrange
    localStorage.removeItem('token');

    // Act
    render(
      <MemoryRouter initialEntries={['/login']}>
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
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('ログインフォーム')).toBeInTheDocument();
  });

  it('トークンがある場合、ホームページにリダイレクトする', () => {
    // Arrange
    localStorage.setItem('token', 'test-token');

    // Act
    render(
      <MemoryRouter initialEntries={['/login']}>
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
      </MemoryRouter>
    );

    // Assert
    expect(screen.queryByText('ログインフォーム')).not.toBeInTheDocument();
    expect(screen.getByText('ホームページ')).toBeInTheDocument();
  });
});
