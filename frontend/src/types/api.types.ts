import { User, Auth } from './model.types';

/** 共通のAPIレスポンス型 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ErrorResponse | null;
}

/** エラーレスポンス型 */
export interface ErrorResponse {
  code: string;
  message: string;
  details: object | null;
}

// ユーザー関連
/** ログインリクエスト */
export type LoginRequest = Pick<User, 'email' | 'password'>;
/** ログインレスポンス */
export type LoginResponse = ApiResponse<Auth>;
