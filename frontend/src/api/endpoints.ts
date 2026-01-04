/**
 * APIエンドポイント定義
 */

// ベースパス
const BASE_PATH = '/api/v1';

// ユーザー関連
export const USER_ENDPOINTS = {
  LOGIN: `${BASE_PATH}/users/login`,
  LOGOUT: `${BASE_PATH}/users/logout`,
  ME: `${BASE_PATH}/users/me`,
} as const;
