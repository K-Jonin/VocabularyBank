class Query:
    __query: dict[str, object] = {}
    __fields: dict[str, int] = {}

    def __init__(self):
        pass

    def add_condition(self, field_name: str, value: str):
        """
        条件追加

        Parameters:
            field_name: フィールド名
            value: 値
        """
        self.__query.update({field_name: value})
        return self

    def add_or_condition(self, collections: dict[str, str]):
        """
        OR句追加

        Parameters:
            collections: 条件コレクション
        """
        self.__query.update({'$or': collections})
        return self

    def add_in_condition(self, field_name: str, values: list[object]):
        """
        IN句追加

        Parameters:
            field_name: フィールド名
            values: 値リスト
        """
        self.__query.update({field_name: {"$in": list(values)}})
        return self

    def add_target_field(self, fields: list[str]):
        """
        取得対象のフィールドを追加

        Parameters:
            fields: 取得対象フィールド
        """
        for field in fields:
            self.__fields[field] = 1

        return self

    def get_query(self) -> dict[str, object]:
        """クエリ取得"""
        return self.__query

    def get_fields(self) -> dict[str, int]:
        """フィールド取得"""
        return self.__fields
