/**
 * APIエンドポイント定義
 */

// ベースパス
const BASE_PATH = '/api/v1';

// 認証関連
export const USER_ENDPOINTS = {
  LOGIN: `${BASE_PATH}/users/login`,
} as const;
