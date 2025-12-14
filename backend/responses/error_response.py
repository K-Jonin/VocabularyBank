from http import HTTPStatus


class ErrorResponse:
    """エラーレスポンス"""

    # HTTPステータスコード
    status: HTTPStatus
    # エラーコード
    code: str
    # エラーメッセージ
    message: str

    def __init__(self, status: HTTPStatus, code: str):
        """
        コンストラクタ

        Parameters:
            status: HTTPステータスコード
            code: エラーコード
        """
        self.status = status
        self.code = code
        self.message = ""  # TODO: エラーコードからメッセージを設定

    def create(self):
        """
        レスポンス作成

        Returns:
            レスポンス
        """
        return {
            "status": self.status.value,
            "code": self.code,
            "message": self.message
        }
