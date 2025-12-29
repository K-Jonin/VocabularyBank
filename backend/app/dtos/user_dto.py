from pydantic import BaseModel, EmailStr, Field


class UserResponseDTO(BaseModel):
    """ユーザーレスポンスDTO"""

    token: str


class UserDto(BaseModel):
    """ユーザーDTO"""

    # メールアドレス
    email: EmailStr
    # ユーザー名
    name: str = Field(min_length=1, max_length=20)
    # パスワード
    password: str = Field(min_length=8, max_length=50)
