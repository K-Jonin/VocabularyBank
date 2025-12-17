/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** APIのベースURL */
  readonly VITE_API_BASE_URL: string;
  /** APIリクエストのタイムアウト時間（ミリ秒） */
  readonly VITE_API_TIMEOUT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
