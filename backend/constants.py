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
    HOST = os.getenv('HOST')
    # ポート番号
    PORT = os.getenv('PORT')
    # MongoDB URI
    MONGO_URI = os.getenv('MONGO_URI')
    # DB名
    DB_NAME = os.getenv('DB_NAME')
