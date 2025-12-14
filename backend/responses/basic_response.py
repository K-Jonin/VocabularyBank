from http import HTTPStatus
from typing import Any


class BasicResponse:
    """基本レスポンス"""

    # HTTPステータスコード
    __status: HTTPStatus
    # DTO
    __dtos: dict[str, Any]

    def __init__(self, status: HTTPStatus, dtos: dict[str, Any]):
        """
        コンストラクタ

        Parameters:
            status: HTTPステータスコード
            dtos: レスポンスに含めるデータ
        """
        self.__status = status
        self.__dtos = dtos

    def create(self):
        """
        レスポンス作成

        Returns:
            レスポンス
        """

        return {
            "status": self.__status.value,
            **self.__dtos
        }
