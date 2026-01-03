from unittest.mock import Mock, patch
from app.services.user_service import UserService
from app.dtos.user_dto import UserDto
from app.models.user_model import UserModel


class TestUserService:
    """ユーザーサービスのテスト"""

    @patch('app.services.user_service.UserRepository')
    @patch('app.services.user_service.Hash')
    @patch('app.services.user_service.create_access_token')
    def test_login_success(self, mock_create_token, mock_hash_class, mock_repository):
        """ログイン成功のテスト"""
        # Arrange（準備）
        # UserRepositoryのモック設定
        mock_repo_instance = mock_repository.return_value
        mock_repo_instance.get_salt.return_value = "test_salt"

        # UserModelのモック設定
        mock_user = UserModel()
        mock_user.email = "test@example.com"
        mock_user.name = "Test User"
        mock_repo_instance.search.return_value = mock_user

        # Hashのモック設定
        mock_hash_instance = mock_hash_class.return_value
        mock_hash_obj = Mock()
        mock_hash_obj.hashed_text = "hashed_password"
        mock_hash_instance.create_from_salt.return_value = mock_hash_obj

        # create_access_tokenのモック設定
        expected_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test_token"
        mock_create_token.return_value = expected_token

        # テスト用DTO
        user_dto = UserDto(
            email="test@example.com",
            password="password123",
            name="Test User"
        )

        # Act（実行）
        service = UserService()
        result = service.login(user_dto)

        # Assert（検証）
        assert result is not None
        assert isinstance(result, str)
        assert result == expected_token

        # モックが正しく呼ばれたか確認
        mock_repo_instance.get_salt.assert_called_once_with("test@example.com")
        mock_hash_instance.create_from_salt.assert_called_once_with(
            "password123", "test_salt")
        mock_repo_instance.search.assert_called_once_with(
            "test@example.com", "hashed_password")
        mock_create_token.assert_called_once_with({"sub": "test@example.com"})

    @patch('app.services.user_service.UserRepository')
    def test_login_salt_not_found(self, mock_repository):
        """ソルトが存在しない場合Noneを返す"""
        # Arrange（準備）
        mock_repo_instance = mock_repository.return_value
        mock_repo_instance.get_salt.return_value = None

        # テスト用DTO
        user_dto = UserDto(
            email="notfound@example.com",
            password="password123",
            name="Not Found User"
        )

        # Act（実行）
        service = UserService()
        result = service.login(user_dto)

        # Assert（検証）
        assert result is None

        mock_repo_instance.get_salt.assert_called_once_with(
            "notfound@example.com")
        mock_repo_instance.search.assert_not_called()

    @patch('app.services.user_service.UserRepository')
    @patch('app.services.user_service.Hash')
    def test_login_invalid_password(self, mock_hash_class, mock_repository):
        """パスワードが間違っている場合Noneを返す"""
        # Arrange
        mock_repo_instance = mock_repository.return_value
        mock_repo_instance.get_salt.return_value = "test_salt"
        mock_repo_instance.search.return_value = None  # パスワード不一致でユーザーが見つからない

        # Hashのモック設定
        mock_hash_instance = mock_hash_class.return_value
        mock_hash_obj = Mock()
        mock_hash_obj.hashed_text = "hashed_password"
        mock_hash_instance.create_from_salt.return_value = mock_hash_obj

        # テスト用DTO
        user_dto = UserDto(
            email="test@example.com",
            password="wrong_password",
            name="Test User"
        )

        # Act
        service = UserService()
        result = service.login(user_dto)

        # Assert
        assert result is None

        # モックの呼び出し確認
        mock_repo_instance.get_salt.assert_called_once_with("test@example.com")
        mock_hash_instance.create_from_salt.assert_called_once_with(
            "wrong_password", "test_salt")
        mock_repo_instance.search.assert_called_once_with(
            "test@example.com", "hashed_password")
