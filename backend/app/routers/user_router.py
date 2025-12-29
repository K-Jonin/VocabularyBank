from http import HTTPStatus
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import app.constants as constants
from app.dtos.user_dto import UserDto, UserResponseDTO
from app.responses.basic_response import BasicResponse
from app.responses.error_response import ErrorResponse
from app.services.user_service import UserService
from app.utils.logger import get_logger
from app.utils.message import Message


class UserRouter():
    """ユーザールーター"""

    # ログ
    __logger = get_logger(__name__)
    # 接頭辞
    __PREFIX: str = "/users"
    # タグ
    __TAGS = ["users"]
    # ルーター
    router = APIRouter()

    @router.post("/login")
    def login(payload: UserDto) -> JSONResponse:
        """
        ログイン エンドポイント

        Parameters:
            payload: ユーザーDTO

        Returns:
            JSONレスポンス
        """

        def create_login_error():
            """ログインエラーレスポンス作成"""
            return ErrorResponse(
                HTTPStatus.UNAUTHORIZED,
                constants.Message.ERROR_CODE_LOGIN_FAILED,
                Message.get_message(constants.Message.ERROR_CODE_LOGIN_FAILED)
            ).create()

        try:
            token = UserService().login(payload)
            if not token:
                create_login_error()

            return BasicResponse(
                status=HTTPStatus.OK,
                success=True,
                data=UserResponseDTO(token=token).model_dump()
            ).create()
        except Exception as e:
            UserRouter.__logger.exception("ログイン処理中にエラーが発生しました")
            return create_login_error()
