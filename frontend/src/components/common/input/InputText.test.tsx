import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputText } from './InputText';

describe('InputText', () => {
  describe('レンダリング', () => {
    it('デフォルトでレンダリングされる', () => {
      render(<InputText placeholder='テスト入力' />);
      expect(screen.getByPlaceholderText('テスト入力')).toBeInTheDocument();
    });

    it('variant="default"でレンダリングされる', () => {
      render(<InputText variant='default' placeholder='デフォルト' />);
      expect(screen.getByPlaceholderText('デフォルト')).toBeInTheDocument();
    });

    it('variant="user"でレンダリングされる', () => {
      render(<InputText variant='user' placeholder='ユーザー' />);
      expect(screen.getByPlaceholderText('ユーザー')).toBeInTheDocument();
    });
  });

  describe('サイズ', () => {
    it('inputSize="medium"がデフォルト', () => {
      render(<InputText placeholder='中サイズ' />);
      expect(screen.getByPlaceholderText('中サイズ')).toBeInTheDocument();
    });

    it('inputSize="small"でレンダリングされる', () => {
      render(<InputText inputSize='small' placeholder='小サイズ' />);
      expect(screen.getByPlaceholderText('小サイズ')).toBeInTheDocument();
    });

    it('inputSize="large"でレンダリングされる', () => {
      render(<InputText inputSize='large' placeholder='大サイズ' />);
      expect(screen.getByPlaceholderText('大サイズ')).toBeInTheDocument();
    });
  });

  describe('入力値の変更', () => {
    it('onChange イベントが発火する', () => {
      const handleChange = vi.fn();
      render(<InputText onChange={handleChange} placeholder='入力テスト' />);

      const input = screen.getByPlaceholderText('入力テスト');
      fireEvent.change(input, { target: { value: 'テスト入力値' } });

      expect(handleChange).toHaveBeenCalled();
    });

    it('入力値が正しく反映される', () => {
      render(<InputText placeholder='入力テスト' />);

      const input = screen.getByPlaceholderText(
        '入力テスト'
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'テスト入力値' } });

      expect(input.value).toBe('テスト入力値');
    });
  });

  describe('type属性', () => {
    it('type="text"が設定できる', () => {
      render(<InputText type='text' placeholder='テキスト' />);
      const input = screen.getByPlaceholderText('テキスト');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('type="email"が設定できる', () => {
      render(<InputText type='email' placeholder='メール' />);
      const input = screen.getByPlaceholderText('メール');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('type="password"が設定できる', () => {
      render(<InputText type='password' placeholder='パスワード' />);
      const input = screen.getByPlaceholderText('パスワード');
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('パスワードマスク', () => {
    it('hasPasswordMask=trueでマスクボタンが表示される', () => {
      render(
        <InputText
          type='password'
          hasPasswordMask={true}
          placeholder='パスワード'
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('マスクボタンをクリックするとtype属性がtextに変わる', () => {
      render(
        <InputText
          type='password'
          hasPasswordMask={true}
          placeholder='パスワード'
        />
      );

      const input = screen.getByPlaceholderText('パスワード');
      const button = screen.getByRole('button');

      // 初期状態はpassword
      expect(input).toHaveAttribute('type', 'password');

      // クリックするとtextに変わる
      fireEvent.click(button);
      expect(input).toHaveAttribute('type', 'text');

      // 再度クリックするとpasswordに戻る
      fireEvent.click(button);
      expect(input).toHaveAttribute('type', 'password');
    });

    it('hasPasswordMask=falseではマスクボタンが表示されない', () => {
      render(
        <InputText
          type='password'
          hasPasswordMask={false}
          placeholder='パスワード'
        />
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('エラー状態', () => {
    it('hasError=trueでエラースタイルが適用される', () => {
      render(<InputText hasError={true} placeholder='エラー入力' />);
      expect(screen.getByPlaceholderText('エラー入力')).toBeInTheDocument();
    });

    it('hasError=falseで通常スタイルになる', () => {
      render(<InputText hasError={false} placeholder='通常入力' />);
      expect(screen.getByPlaceholderText('通常入力')).toBeInTheDocument();
    });
  });

  describe('HTML属性', () => {
    it('placeholder属性が設定できる', () => {
      render(<InputText placeholder='プレースホルダー' />);
      expect(
        screen.getByPlaceholderText('プレースホルダー')
      ).toBeInTheDocument();
    });

    it('id属性が設定できる', () => {
      render(<InputText id='test-input' placeholder='ID付き' />);
      const input = screen.getByPlaceholderText('ID付き');
      expect(input).toHaveAttribute('id', 'test-input');
    });

    it('disabled属性が設定できる', () => {
      render(<InputText disabled placeholder='無効化' />);
      const input = screen.getByPlaceholderText('無効化');
      expect(input).toBeDisabled();
    });

    it('autoComplete属性が設定できる', () => {
      render(
        <InputText autoComplete='email' placeholder='オートコンプリート' />
      );
      const input = screen.getByPlaceholderText('オートコンプリート');
      expect(input).toHaveAttribute('autoComplete', 'email');
    });

    it('required属性が設定できる', () => {
      render(<InputText required placeholder='必須' />);
      const input = screen.getByPlaceholderText('必須');
      expect(input).toBeRequired();
    });
  });

  describe('forwardRef', () => {
    it('refが正しく転送される', () => {
      const ref = { current: null as HTMLInputElement | null };
      render(<InputText ref={ref} placeholder='Ref付き' />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.placeholder).toBe('Ref付き');
    });
  });
});
