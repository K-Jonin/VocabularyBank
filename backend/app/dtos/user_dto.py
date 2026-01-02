from pydantic import BaseModel, EmailStr, Field


class UserResponseDTO(BaseModel):
    """ユーザーレスポンスDTO"""

    # トークン
    token: str


class UserDto(BaseModel):
    """ユーザーDTO"""

    # メールアドレス
    email: EmailStr
    # ユーザー名
    name: str | None = Field(default=None, min_length=1, max_length=20)
    # パスワード
    password: str = Field(min_length=8, max_length=50)
