from http import HTTPStatus
from typing import Any
from fastapi.responses import JSONResponse

from app import constants


class BasicResponse:
    """基本レスポンス"""

    # HTTPステータスコード
    __status: HTTPStatus
    # 成功
    __success: bool
    # DTO
    __data: dict[str, Any]
    # エラー
    __error: dict[str, Any]

    def __init__(self, status: HTTPStatus, success: bool, data: dict[str, Any] = {}, error: dict[str, Any] = {}):
        """
        コンストラクタ

        Parameters:
            status: HTTPステータスコード
            data: レスポンスに含めるデータ
        """
        self.__status = status
        self.__success = success
        self.__data = data
        self.__error = error

    def create(self) -> JSONResponse:
        """
        レスポンス作成

        Returns:
            レスポンス
        """

        return JSONResponse(
            status_code=self.__status.value,
            content={
                constants.Parameter.Common.PARAM_SUCCESS: self.__success,
                constants.Parameter.Common.PARAM_DATA: self.__data,
                constants.Parameter.Common.PARAM_ERROR: self.__error
            }
        )
