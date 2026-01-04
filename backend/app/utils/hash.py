import hashlib
import secrets


class Hash:
    """ ハッシュ関連処理 """

    # ハッシュ化されたテキスト
    hashed_text: str
    # ソルト
    salt: str
    # デフォルトバイト数
    __DEFAULT_BYTES: int = 32

    def create(self, text: str, bytes: int = __DEFAULT_BYTES) -> "Hash":
        """
        作成

        Parameters:
            text: ハッシュ化対象テキスト
            bytes: バイト数

        Returns:
            ハッシュ化されたテキスト
        """
        self.salt = secrets.token_hex(bytes)
        hash_object = hashlib.sha256((text + self.salt).encode())
        self.hashed_text = hash_object.hexdigest()
        return self

    def create_from_salt(self, text: str, salt: str) -> "Hash":
        """
        作成(ソルト指定)

        Parameters:
            text: ハッシュ化対象テキスト
            salt: ソルト

        Returns:
            ハッシュ化されたテキスト
        """
        self.salt = salt
        hash_object = hashlib.sha256((text + self.salt).encode())
        self.hashed_text = hash_object.hexdigest()
        return self
