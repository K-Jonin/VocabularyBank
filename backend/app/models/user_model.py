from typing import Any, Optional
from .model_base import ModelBase
import app.constants as constants


class UserModel(ModelBase):
    """ユーザーモデル"""

    # ID
    id: Optional[str]
    # 名前
    name: Optional[str]
    # ログインID
    email: Optional[str]
    # ソルト
    salt: Optional[str]
    # パスワード
    password: Optional[str]

    _field_map = {
        "id": constants.Db.FIELD_ID,
        "name": constants.Db.User.FIELD_NAME,
        "email": constants.Db.User.FIELD_EMAIL,
        "salt": constants.Db.User.FIELD_SALT,
        "password": constants.Db.User.FIELD_PASSWORD
    }

    def __init__(self, **kwargs):
        """コンストラクタ"""
        super().__init__(**kwargs)

    def set(self, row: Optional[dict[str, Any]]):
        """
        データセット

        Parameters:
            row: データ行
        """
        super().set_data_source(row)
        return self
