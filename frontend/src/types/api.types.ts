import { User } from './model.types';

/** 共通のAPIレスポンス型 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
  message?: string;
}

/** エラーレスポンス型 */
export interface ErrorResponse {
  code: string;
  message: string;
}
