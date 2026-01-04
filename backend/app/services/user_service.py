from app.dtos.user_dto import UserDto
from app.repositories.user_repository import UserRepository
from app.services.auth_service import create_access_token
from app.services.service_base import ServiceBase
from app.utils.hash import Hash


class UserService(ServiceBase):
    """ユーザー業務処理"""

    def __init__(self):
        """コンストラクタ"""
        super().__init__()

    def login(self, user: UserDto) -> str | None:
        """
        ログイン

        Parameters:
        user: ユーザーDTO

        Returns:
        トークン
        """
        repository = UserRepository()
        salt: str = repository.get_salt(user.email)
        if salt is None:
            return None

        hash = Hash().create_from_salt(user.password, salt)
        user_model = repository.search(user.email, hash.hashed_text)
        if user_model is None:
            return None

        return create_access_token({"sub": user_model.email})
