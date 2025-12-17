/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** APIのベースURL */
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
