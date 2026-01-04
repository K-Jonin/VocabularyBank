from typing import Any, Optional
from .model_base import ModelBase
import app.constants as constants


class MessageModel(ModelBase):
    """ユーザーモデル"""

    # ID
    id: Optional[str]
    # ログインID
    code: Optional[str]
    # パスワード
    message: Optional[str]

    _field_map = {
        "id": constants.Db.FIELD_ID,
        "code": constants.Db.Message.FIELD_CODE,
        "message": constants.Db.Message.FIELD_MESSAGE
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
