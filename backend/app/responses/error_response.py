from http import HTTPStatus
from app import constants
from app.responses.basic_response import BasicResponse


class ErrorResponse:
    """エラーレスポンス"""

    # ステータス
    __status: HTTPStatus
    # エラーコード
    __code: str
    # エラーメッセージ
    __message: str
    # エラー詳細
    __details: object

    def __init__(self, status: HTTPStatus, code: str, message: str, details: object = None):
        """
        コンストラクタ

        Parameters:
            status: HTTPステータスコード
            code: エラーコード
        """
        self.__status = status
        self.__code = code
        self.__message = message
        self.__details = details

    def create(self):
        """
        レスポンス作成

        Returns:
            レスポンス
        """
        return BasicResponse(
            status=self.__status,
            success=False,
            data={
                constants.Parameter.Common.PARAM_CODE: self.__code,
                constants.Parameter.Common.PARAM_MESSAGE: self.__message,
                constants.Parameter.Common.PARAM_DETAILS: self.__details
            }
        ).create()
