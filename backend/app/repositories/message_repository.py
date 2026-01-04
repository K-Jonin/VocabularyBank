import app.constants as constants
from app.models.message_model import MessageModel
from app.repositories.repository_base import RepositoryBase


class MessageRepository(RepositoryBase):
    """ メッセージリポジトリ """

    def __init__(self):
        """コンストラクタ"""
        super().__init__(constants.Db.Message.COLLECTION_NAME)

    def get_all(self) -> list[MessageModel]:
        """
        全件取得

        Returns:
         メッセージモデルのリスト
        """

        rows = self._find({})
        result = []
        for row in rows:
            model = MessageModel()
            model.set(row)
            result.append(model)
        return result
