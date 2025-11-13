from datetime import datetime
from pymongo import MongoClient
from pymongo.cursor import Cursor
from pymongo.database import Database
from typing import ClassVar, Any, Optional
from utils.string_utility import StringUtility
import constants


class RepositoryBase:
    # クライアント
    __client: ClassVar[MongoClient] = MongoClient(constants.App.MONGO_URI)
    # DB
    __db: ClassVar[Database] = __client[constants.App.DB_NAME]

    def __init__(self, collection_name: str):
        """
        コンストラクタ

        Parameters:
            collection_name: コレクション名
        """
        self.collection_name = collection_name

    def _find_one(self, query: dict[str, object]) -> Optional[dict[str, Any]]:
        """
        1件取得

        Parameters:
            query: クエリ

        Returns:
            取得結果
        """
        return self.__db[self.collection_name].find_one(query)

    def _find(self, query: dict[str, object]) -> Cursor:
        """
        取得

        Parameters:
            query: クエリ

        Returns:
            取得結果
        """
        return self.__db[self.collection_name].find(query)

    def _insert_one(self, row: Optional[dict[str, Any]]) -> str:
        """
        1件登録

        Parameters:
            row: データ行

        Returns:
            str: 登録済みID
        """
        # フィールド名をlowerCamelCaseに変換
        row = {StringUtility.snake_to_lower_camel(
            k): v for k, v in row.items()}

        # 作成日時・更新日時を追加
        row.update(self.__get_insert_params())
        result = self.__db[self.collection_name].insert_one(row)
        return str(result.inserted_id)

    def _insert_many(self, rows: list[Optional[dict[str, Any]]]) -> list[str]:
        """
        複数件登録

        Parameters:
            rows: データ行

        Returns:
            list[str]: 登録済みID
        """
        # 作成日時・更新日時を追加
        documents = [
            {
                **{StringUtility.snake_to_lower_camel(k): v for k, v in row.items()},
                **self.__get_insert_params()
            }
            for row in rows if row is not None
        ]

        if not documents:
            return []

        result = self.__db[self.collection_name].insert_many(documents)
        return [str(_id) for _id in result.inserted_ids]

    def __get_insert_params(self) -> dict[str, str]:
        """登録時のデフォルトパラメータ取得"""
        # HACK: MongoDBに保存される際、協定世界時に変換される
        return {
            constants.Db.FIELD_CREATED_AT: datetime.now(),
            constants.Db.FIELD_UPDATED_AT: datetime.now()
        }

    def _update(
        self,
        query: dict[str, Any],
        update_fields: Optional[dict[str, Any]],
        is_multiple: bool = False
    ) -> int:
        """
        更新

        Parameters:
            query: クエリ
            update_fields: 更新対象のフィールド・値

        Returns:
            更新件数
        """
        update_data = {
            "$set": update_fields,
            "$currentDate": {constants.Db.FIELD_UPDATED_AT: True}
        }

        if is_multiple:
            result = self.__db[self.collection_name].update_many(
                query, update_data)
        else:
            result = self.__db[self.collection_name].update_one(
                query, update_data)
        return result.modified_count

    def _delete_one(self, query: dict[str, Any]) -> int:
        """
        1件削除

        Parameters:
            query: クエリ

        Returns:
            int: 削除件数
        """
        result = self.__db[self.collection_name].delete_one(query)
        return result.deleted_count

    def _delete_many(self, query: dict[str, Any]) -> int:
        """
        複数件削除

        Parameters:
            query: クエリ

        Returns:
            int: 削除件数
        """
        result = self.__db[self.collection_name].delete_many(query)
        return result.deleted_count
