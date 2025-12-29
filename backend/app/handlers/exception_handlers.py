from http import HTTPStatus
from typing import Any, Sequence
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from app.responses.error_response import ErrorResponse
from app.utils.message import Message
import app.constants as constants


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    バリデーションエラーのグローバルハンドラ

    Parameters:
        request: リクエストオブジェクト
        exc: バリデーションエラー例外

    Returns:
        JSONResponse: エラーレスポンス
    """

    return ErrorResponse(
        HTTPStatus.UNPROCESSABLE_ENTITY,
        constants.Message.ERROR_CODE_VALIDATION,
        Message.get_message(constants.Message.ERROR_CODE_VALIDATION),
        __get_errors(exc.errors())
    ).create()


def __get_errors(errors: Sequence[Any]) -> dict[str, str]:
    """
    エラー内容を加工して取得

    Parameters:
        errors: バリデーションエラー

    Returns:
        加工済みのエラー内容
    """

    result: dict[str, list[str]] = {}
    for err in errors:
        type: str = err["type"]
        ctx: dict[str, any] = err.get("ctx", {})
        msg: str = __get_message(type, ctx)
        field: str = err["loc"][-1]

        if field in result:
            result[field].append(msg)
            continue

        result[field] = [msg]

    return result


def __get_message(type: str, ctx: dict[str, any]) -> str:
    """
    エラーメッセージ取得

    Parameters:
        message: エラーメッセージ

    Returns:
        変換後エラーメッセージ
    """
    if type == "string_too_short":
        return Message.get_message(constants.Message.ERROR_CODE_MIN_LENGTH, [str(ctx["min_length"])])
    if type == "string_too_long":
        return Message.get_message(constants.Message.ERROR_CODE_MAX_LENGTH, [str(ctx["max_length"])])
    if type == "missing":
        return Message.get_message(constants.Message.ERROR_CODE_REQUIRED)
    if type == "string_pattern_mismatch" or type == "value_error":
        return Message.get_message(constants.Message.ERROR_CODE_FORMAT)

    raise Exception(constants.Message.MESSAGE_UNDEFINED)


def register_exception_handlers(app):
    """
    例外ハンドラをアプリケーションに登録

    Parameters:
        app: FastAPIアプリケーションインスタンス
    """
    app.add_exception_handler(RequestValidationError,
                              validation_exception_handler)
