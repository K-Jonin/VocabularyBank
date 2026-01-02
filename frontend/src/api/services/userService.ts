import { api } from '../client';
import { LoginRequest, LoginResponse } from '../../types/index';
import { USER_ENDPOINTS } from '../endpoints';

/** ユーザーサービス */
export const userService = {
  // ログイン
  login: (data: LoginRequest) =>
    api.post<LoginResponse>(USER_ENDPOINTS.LOGIN, data),
};
