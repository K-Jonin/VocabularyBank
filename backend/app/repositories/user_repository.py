from app.models.user_model import UserModel
from app.repositories.repository_base import RepositoryBase
from app.utils.query import Query
import app.constants as constants


class UserRepository(RepositoryBase):
    """ユーザーリポジトリ"""

    def __init__(self):
        """コンストラクタ"""
        super().__init__(constants.Db.User.COLLECTION_NAME)

    def search(self, email: str, password: str) -> UserModel | None:
        """
        検索

        Parameters:
            email: メールアドレス
            password: パスワード

        Returns:
            ユーザーモデル
        """
        query = (
            Query()
            .add_condition(constants.Db.User.FIELD_EMAIL, email)
            .add_condition(constants.Db.User.FIELD_PASSWORD, password)
            .get_query()
        )
        row = super()._find_one(query)
        if row is None:
            return None
        return UserModel().set(row)

    def get_salt(self, email: str) -> str | None:
        """
        ソルト取得

        Parameters:
            email: メールアドレス

        Returns:
            ソルト
        """
        query: Query = (
            Query()
            .add_condition(constants.Db.User.FIELD_EMAIL, email)
            .add_target_field([constants.Db.User.FIELD_SALT])
        )
        row = super()._find_one(query.get_query(), query.get_fields())
        if row is None:
            return None

        return row[constants.Db.User.FIELD_SALT]
