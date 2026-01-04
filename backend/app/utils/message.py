import app.constants as constants
from app.models.message_model import MessageModel
from app.repositories.message_repository import MessageRepository


class Message:
    """ メッセージクラス """

    # インスタンス
    __instance = None
    # 初期化済み
    __initialized: bool = False
    # メッセージ
    __messages: list[MessageModel]

    def __new__(cls):
        if cls.__instance is None:
            cls.__instance = super().__new__(cls)
        return cls.__instance

    def __init__(self):
        """ コンストラクタ """
        if Message.__initialized:
            return

        # メッセージマスタ取得
        Message.__messages = MessageRepository().get_all()
        Message.__initialized = True

    @classmethod
    def get_message(cls, code: str, replaces: list[str] = None) -> str:
        """
        メッセージ取得

        Parameters:
            code: コード
            replaces: 置換文字列

        Returns:
            メッセージ
        """
        # 初期化されていなければ初期化
        if not cls.__initialized:
            cls()

        if replaces is None:
            replaces = []

        messageModel = next(
            filter(lambda x: x.code == code, cls.__messages), None)
        if messageModel is None:
            # メッセージが取得できない場合は例外を投げる
            error_message = constants.Message.MESSAGE_GET_MESSAGE_FAILED.format(
                code=code)
            raise Exception(error_message)

        result = messageModel.message
        for index, replace in enumerate(replaces):
            result = result.replace(f"{{{index}}}", replace)

        return result
