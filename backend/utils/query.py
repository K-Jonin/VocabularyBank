class Query:
    query: dict[str, object] = {}

    def add_condition(self, field_name: str, value: str):
        """
        条件追加

        Parameters:
            field_name: フィールド名
            value: 値
        """
        self.query.update({field_name: value})
        return self

    def add_or_condition(self, collections: dict[str, str]):
        """
        OR句追加

        Parameters:
            collections: 条件コレクション
        """
        self.query.update({'$or': collections})
        return self

    def add_in_condition(self, field_name: str, values: list[object]):
        """
        IN句追加

        Parameters:
            field_name: フィールド名
            values: 値リスト
        """
        self.query.update({field_name: {"$in": list(values)}})
        return self

    def create(self) -> dict[str, object]:
        """クエリ作成"""
        return self.query
