
from http import HTTPStatus
from fastapi.responses import JSONResponse
from app import constants
from app.responses.basic_response import BasicResponse


class MessageOnlyResponse:
    """ メッセージのみレスポンス """

    # ステータス
    __status: HTTPStatus
    # メッセージ
    __message: str

    def __init__(self, status: HTTPStatus, message: str):
        """ コンストラクタ """

        self.__status = status
        self.__message = message

    def create(self) -> JSONResponse:
        """
        レスポンス作成

        Returns:
            レスポンス
        """
        return BasicResponse(
            status=self.__status,
            success=True,
            data={
                constants.Parameter.Common.PARAM_MESSAGE: self.__message,
            }
        ).create()
