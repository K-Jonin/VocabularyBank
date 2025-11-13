from typing import Any, Optional, TypeVar

# ジェネリック型
T = TypeVar("T")


class ModelBase:
    """モデル基底クラス"""

    def __init__(self, row: Optional[dict[str, Any]] = None):
        """コンストラクタ"""
        self.data_source: dict[str, Any] = {}
        if row:
            self.set_data_source(row)

    def __init_subclass__(cls, **kwargs):
        """
        サブクラス生成フック

        Parameters:
            cls: サブクラス
            **kwargs: クラス定義ヘッダで渡された任意のキーワード。多重継承対応のため super().__init_subclass__(**kwargs) で次の基底へ伝播させる。
        """
        super().__init_subclass__(**kwargs)
        field_map = getattr(cls, "_field_map", None)
        if isinstance(field_map, dict):
            for attr_name, key in field_map.items():
                # サブクラスで明示定義されていれば上書きしない
                if not hasattr(cls, attr_name):
                    setattr(cls, attr_name, ModelBase.dict_prop(key))

    @staticmethod
    def dict_prop(key: str):
        """
        data_source の指定キーを属性アクセスにマッピングする property を生成
        get -> data_source[key], set -> data_source[key]=value
        """

        def fget(self):
            return getattr(self, "data_source", {}).get(key)

        def fset(self, v):
            self.data_source[key] = v
        return property(fget, fset)

    def set_data_source(self, row: Optional[dict[str, Any]]):
        """
        データソースに値をセット
        TODO: オプション的なものを持たせて協定世界時->日本標準時に変換できるようにしたい

        Parameters:
            row: データ行
        """
        if row:
            self.data_source.update(row)
        return self

    def to_dict(self) -> dict[str, Any]:
        """dictに変換"""
        return dict(self.data_source)
