from pathlib import Path
import os
from dotenv import load_dotenv


class Constants:
    """ 定数定義 """

    __env_path = Path(__file__).resolve().parent.parent / ".env"
    load_dotenv(dotenv_path=__env_path)

    class ConstError(TypeError):
        pass

    def __setattr__(self, key, value):
        raise self.ConstError(f"Can't rebind constant '{key}'")


class App(Constants):
    """ アプリケーション定数定義 """

    # デバッグモード
    DEBUG = True
    # ホスト
    HOST = os.getenv("HOST", "0.0.0.0")
    # ポート番号
    PORT = os.getenv("PORT", "8000")
    # MongoDB URI
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    # DB名
    DB_NAME = os.getenv("DB_NAME", "vocabulary_bank")
    # 秘密鍵
    SECRET_KEY = os.getenv(
        "SECRET_KEY", "test-secret-key-for-development-only")
    # アルゴリズム
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    # アクセストークン有効時間
    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


class Message:
    """ メッセージ関連定数定義 """

    # システムエラー
    MESSAGE_SYSTEM_ERROR: str = "システムエラーが発生しました。"
    # メッセージ取得失敗
    MESSAGE_GET_MESSAGE_FAILED: str = "メッセージの取得に失敗しました。コード:{code}"
    # カスタムメッセージ未定義
    MESSAGE_UNDEFINED = "エラーメッセージが未定義です。"

    # エラーコード: 入力値エラー
    ERROR_CODE_VALIDATION: str = "E001"
    # エラーコード: 文字数規定未満
    ERROR_CODE_MIN_LENGTH: str = "E002"
    # エラーコード: 文字数規定以上
    ERROR_CODE_MAX_LENGTH: str = "E003"
    # エラーコード: 必須項目
    ERROR_CODE_REQUIRED: str = "E004"
    # エラーコード: 形式エラー
    ERROR_CODE_FORMAT: str = "E005"
    # エラーコード: ログイン失敗
    ERROR_CODE_LOGIN_FAILED: str = "E006"


class Db(Constants):
    """データベース関連 定数定義"""

    # id
    FIELD_ID: str = "_id"
    # 作成日時
    FIELD_CREATED_AT: str = "createdAt"
    # 更新日時
    FIELD_UPDATED_AT: str = "updatedAt"

    class User:
        """ ユーザー """

        # コレクション名
        COLLECTION_NAME: str = "user"
        # 名前
        FIELD_NAME: str = "name"
        # ログインID
        FIELD_EMAIL: str = "email"
        # パスワード
        FIELD_PASSWORD: str = "password"
        # ソルト
        FIELD_SALT: str = "salt"

    class Message:
        """ メッセージ """

        # コレクション名
        COLLECTION_NAME: str = "message"
        # コード
        FIELD_CODE: str = "code"
        # メッセージ
        FIELD_MESSAGE: str = "message"


class Parameter:
    """パラメータ関連 定数定義"""

    class Common:
        """共通"""

        # 成功
        PARAM_SUCCESS: str = "success"
        # データ
        PARAM_DATA: str = "data"
        # エラー
        PARAM_ERROR: str = "error"
        # エラーコード
        PARAM_CODE: str = "code"
        # メッセージ
        PARAM_MESSAGE: str = "message"
        # 詳細
        PARAM_DETAILS: str = "details"

        # トークン
        PARAM_TOKEN = "token"

    class User:
        """ユーザー"""

        # 名前
        PARAM_NAME: str = "name"
        # メールアドレス
        PARAM_EMAIL: str = "email"
        # パスワード
        PARAM_PASSWORD: str = "password"
