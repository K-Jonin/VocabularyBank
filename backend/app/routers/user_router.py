from http import HTTPStatus
from fastapi import APIRouter, Response, Cookie
from fastapi.responses import JSONResponse
from typing import Optional
from jose import jwt, JWTError
import app.constants as constants
from app.dtos.user_dto import AuthResponseDto, UserDto
from app.responses.basic_response import BasicResponse
from app.responses.error_response import ErrorResponse
from app.responses.message_only_response import MessageOnlyResponse
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
    def login(payload: UserDto, response: Response) -> JSONResponse:
        """
        ログイン エンドポイント

        Parameters:
            payload: ユーザーDTO
            response: レスポンスオブジェクト

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
                return create_login_error()

            # レスポンスを作成
            json_response = MessageOnlyResponse(
                status=HTTPStatus.OK,
                message="ログインに成功しました"
            ).create()

            # HttpOnly cookieでトークンを設定
            json_response.set_cookie(
                key="token",
                value=token,
                httponly=True,
                secure=True,
                samesite="strict",
                max_age=7 * 24 * 60 * 60,
                path="/"
            )

            return json_response
        except Exception as e:
            UserRouter.__logger.exception("ログイン処理中にエラーが発生しました")
            return create_login_error()

    @router.post("/logout")
    def logout(response: Response) -> JSONResponse:
        """
        ログアウト エンドポイント

        Parameters:
            response: レスポンスオブジェクト

        Returns:
            JSONレスポンス
        """
        # レスポンスを作成
        json_response = MessageOnlyResponse(
            status=HTTPStatus.OK,
            message="ログアウトしました"
        ).create()

        # Cookieを削除
        json_response.delete_cookie(key="token", path="/")

        return json_response

    @router.get("/me")
    def get_current_user(token: Optional[str] = Cookie(None)) -> JSONResponse:
        """
        現在のログインユーザー情報を取得

        Parameters:
            token: HttpOnly cookieからのトークン

        Returns:
            JSONレスポンス
        """

        def create_response(authenticated: bool = False, email: str = "") -> JSONResponse:
            """ レスポンス作成 """
            return BasicResponse(
                status=HTTPStatus.OK,
                success=True,
                data=AuthResponseDto(
                    authenticated=authenticated, email=email).model_dump()
            ).create()

        # トークンが存在しない場合
        if not token:
            return create_response()

        try:
            # トークンを検証してユーザーIDを取得
            payload = jwt.decode(
                token,
                constants.App.SECRET_KEY,
                algorithms=[constants.App.ALGORITHM]
            )
            email: str = payload.get("sub")

            if not email:
                return create_response()

            # ユーザー情報を返す
            return create_response(authenticated=True, email=email)
        except JWTError:
            UserRouter.__logger.exception("トークン検証エラー")
            return create_response()
        except Exception as e:
            UserRouter.__logger.exception("ユーザー情報取得中にエラーが発生しました")
            return create_response()
