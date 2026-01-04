import { User, Message, Auth } from './model.types';

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

// 共通
/** メッセージのみレスポンス */
export type MessageOnlyResponse = ApiResponse<Message>;
/** 認証レスポンス */
export type AuthResponse = ApiResponse<Auth>;

// ユーザー関連
/** ログインリクエスト */
export type LoginRequest = Pick<User, 'email' | 'password'>;
