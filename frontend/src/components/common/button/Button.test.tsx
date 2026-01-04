import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import styles from './Button.module.scss';

describe('Button', () => {
  describe('レンダリング', () => {
    it('子要素が表示される', () => {
      render(<Button>クリック</Button>);
      expect(screen.getByText('クリック')).toBeInTheDocument();
    });

    it('各variant propsを受け取れる', () => {
      const { rerender } = render(<Button variant='primary'>ボタン</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(<Button variant='secondary'>ボタン</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(<Button variant='outline'>ボタン</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('無効化状態', () => {
    it('disabled=trueで無効化される', () => {
      render(<Button disabled>ボタン</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('disabled=falseで有効になる', () => {
      render(<Button disabled={false}>ボタン</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('ローディング状態', () => {
    it('isLoading=trueで無効化される', () => {
      render(<Button isLoading>送信</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('クリックイベント', () => {
    it('クリック時にonClick関数が呼ばれる', () => {
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>クリック</Button>);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disabled=trueの場合、onClick関数が呼ばれない', () => {
      const handleClick = vi.fn();

      render(
        <Button onClick={handleClick} disabled>
          クリック
        </Button>
      );
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('type属性', () => {
    it('type="submit"が設定できる', () => {
      render(<Button type='submit'>送信</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });
});
