import { api } from '../client';
import {
  AuthResponse,
  LoginRequest,
  MessageOnlyResponse,
} from '../../types/index';
import { USER_ENDPOINTS } from '../endpoints';

/** ユーザーサービス */
export const userService = {
  /** ログイン */
  login: (data: LoginRequest) =>
    api.post<MessageOnlyResponse>(USER_ENDPOINTS.LOGIN, data),

  /** ログアウト */
  logout: () => api.post<MessageOnlyResponse>(USER_ENDPOINTS.LOGOUT, {}),

  /** 現在のユーザー情報を取得（認証確認用） */
  me: () => api.get<AuthResponse>(USER_ENDPOINTS.ME),
};
