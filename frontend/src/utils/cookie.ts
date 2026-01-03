/**
 * Cookieにトークンを保存
 * @param token 保存するトークン
 */
export const setAuthToken = (token: string): void => {
  const maxAge = 7 * 24 * 60 * 60; // 7日間（秒単位）
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';

  document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Strict${secure}`;
};

/**
 * Cookieからトークンを取得
 * @returns トークン（存在しない場合はnull）
 */
export const getAuthToken = (): string | null => {
  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find((cookie) => cookie.startsWith('token='));

  if (!tokenCookie) {
    return null;
  }

  return tokenCookie.split('=')[1];
};

/**
 * Cookieからトークンを削除
 */
export const removeAuthToken = (): void => {
  document.cookie = 'token=; path=/; max-age=0';
};

/**
 * JWTトークンをデコード（検証なし）
 * @param token JWTトークン
 * @returns デコードされたペイロード
 */
const decodeJWT = (token: string): { exp?: number } | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Base64URLデコード
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWTデコードエラー:', error);
    return null;
  }
};

/**
 * トークンの有効期限を確認
 * @returns 有効な場合true、期限切れまたは無効な場合false
 */
export const isTokenValid = (): boolean => {
  const token = getAuthToken();

  if (!token) {
    return false;
  }

  const payload = decodeJWT(token);

  if (!payload || !payload.exp) {
    // expクレームがない場合は有効とみなす（サーバー側で検証）
    return true;
  }

  // expは秒単位のUNIXタイムスタンプ
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp > currentTime;
};

/**
 * 認証状態を確認（トークンの存在と有効期限をチェック）
 * @returns 認証されている場合true
 */
export const isAuthenticated = (): boolean => {
  return isTokenValid();
};
