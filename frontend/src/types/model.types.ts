/** ユーザーモデル */
export interface User {
  userId: string;
  name: string;
  email: string;
  password: string;
}

/** 認証モデル */
export interface Auth {
  authenticated: boolean;
  email: string;
}

/** メッセージ */
export interface Message {
  message: string;
}
