// src/api/client.ts
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { ApiResponse } from '@/types/api.types';
import { getAuthToken, isTokenValid, removeAuthToken } from '@/utils/cookie';

// 環境変数からAPIベースURLを取得
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// デフォルトタイムアウト（ms）。環境変数で上書き可能。
const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

// axiosインスタンスを作成
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター（認証トークンの付与など）
apiClient.interceptors.request.use(
  (config) => {
    // トークンの有効性を確認
    const token = getAuthToken();

    if (token) {
      // トークンが期限切れの場合は削除してリダイレクト
      if (!isTokenValid()) {
        removeAuthToken();
        window.location.href = '/login';
        return Promise.reject(new Error('Token expired'));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    // リクエストログ（開発環境のみ）
    if (import.meta.env.DEV) {
      console.log('Request:', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター（エラーハンドリング）
apiClient.interceptors.response.use(
  (response) => {
    // レスポンスログ（開発環境のみ）
    if (import.meta.env.DEV) {
      console.log('Response:', response.status, response.config.url);
    }

    return response;
  },
  (error: AxiosError<ApiResponse<any>>) => {
    // エラーハンドリング
    if (error.response) {
      // サーバーがエラーレスポンスを返した場合
      const status = error.response.status;
      const errorData = error.response.data.error;

      switch (status) {
        case 401:
          // 認証エラー → ログインページへ
          removeAuthToken();
          window.location.href = '/login';
          return;

        case 404:
          // リソースが見つからない → 404ページへ
          window.location.href = '/404';
          return;

        case 403:
          // 権限不足 → 403ページへ
          window.location.href = '/forbidden';
          return;

        default:
          // その他のエラー → エラーページへ
          const errorInfo = encodeURIComponent(
            JSON.stringify({
              status,
              message: errorData?.message || 'エラーが発生しました',
              code: errorData?.code,
            })
          );
          window.location.href = `/error?info=${errorInfo}`;
          return;
      }
    } else if (error.request) {
      // ネットワークエラー → エラーページへ
      window.location.href = '/error?type=network';
      return;
    } else {
      // その他のエラー → エラーページへ
      window.location.href = '/error?type=unknown';
      return;
    }
  }
);

// 汎用的なAPIリクエスト関数
export const api = {
  // GET リクエスト
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  // POST リクエスト
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  // PUT リクエスト
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  // PATCH リクエスト
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  // DELETE リクエスト
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

export default apiClient;
