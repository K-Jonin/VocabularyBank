/** ユーザーモデル */
export interface User {
  userId: string;
  name: string;
  email: string;
  password: string;
}

/** 認証モデル */
export interface Auth {
  token: string;
}
