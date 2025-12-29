# tests/test_user_router.py
import pytest
from unittest.mock import patch

from app import constants


class TestUserRouter:
    """ユーザールーターのテスト"""

    # ========== 1. 正常系 ==========

    @patch('app.routers.user_router.UserService')
    def test_login_success(self, mock_service_class, client, test_user_data):
        """正常にログインできる"""
        # Arrange
        mock_service_instance = mock_service_class.return_value
        mock_service_instance.login.return_value = "test_token_12345"

        # Act
        response = client.post(
            "/api/v1/users/login",
            json=test_user_data
        )

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert constants.Parameter.Common.PARAM_TOKEN in data
        assert data[constants.Parameter.Common.PARAM_TOKEN] == "test_token_12345"
        mock_service_instance.login.assert_called_once()

    # ========== 2. 認証失敗 ==========

    @patch('app.routers.user_router.UserService')
    def test_login_invalid_credentials(self, mock_service_class, client):
        """認証失敗時に401エラーを返す"""
        # Arrange
        mock_service_instance = mock_service_class.return_value
        mock_service_instance.login.return_value = None  # 認証失敗

        # Act
        response = client.post(
            "/api/v1/users/login",
            json={
                constants.Parameter.User.PARAM_EMAIL: "test@example.com",
                constants.Parameter.User.PARAM_PASSWORD: "wrong_password",
                constants.Parameter.User.PARAM_NAME: "Test User"
            }
        )

        # Assert
        assert response.status_code == 401
        data = response.json()
        assert data[constants.Parameter.Common.PARAM_SUCCESS] == False
        assert constants.Parameter.Common.PARAM_CODE in data or constants.Parameter.Common.PARAM_DETAILS in data

    # ========== 3. 必須フィールド欠如 ==========

    def test_login_missing_email(self, client):
        """メールアドレスが欠けている場合422エラー"""
        # Act
        response = client.post(
            "/api/v1/users/login",
            json={
                constants.Parameter.User.PARAM_PASSWORD: "password123",
                constants.Parameter.User.PARAM_NAME: "Test"
            }
        )

        # Assert
        assert response.status_code == 422
        data = response.json()
        assert constants.Parameter.Common.PARAM_DETAILS in data

    def test_login_missing_password(self, client):
        """パスワードが欠けている場合422エラー"""
        # Act
        response = client.post(
            "/api/v1/users/login",
            json={
                constants.Parameter.User.PARAM_EMAIL: "test@example.com",
                constants.Parameter.User.PARAM_NAME: "Test"
            }
        )

        # Assert
        assert response.status_code == 422
        data = response.json()
        assert constants.Parameter.Common.PARAM_DETAILS in data

    def test_login_empty_email(self, client):
        """メールアドレスが空の場合422エラー"""
        # Act
        response = client.post(
            "/api/v1/users/login",
            json={
                constants.Parameter.User.PARAM_EMAIL: "",
                constants.Parameter.User.PARAM_PASSWORD: "password123",
                constants.Parameter.User.PARAM_NAME: "Test"
            }
        )

        # Assert
        assert response.status_code == 422

    def test_login_empty_password(self, client):
        """パスワードが空の場合422エラー"""
        # Act
        response = client.post(
            "/api/v1/users/login",
            json={
                constants.Parameter.User.PARAM_EMAIL: "test@example.com",
                constants.Parameter.User.PARAM_PASSWORD: "",
                constants.Parameter.User.PARAM_NAME: "Test"
            }
        )

        # Assert
        assert response.status_code == 422

    # ========== 4. バリデーションエラー ==========

    def test_login_invalid_email_format(self, client):
        """メールアドレスの形式が不正な場合422エラー"""
        # Act
        response = client.post(
            "/api/v1/users/login",
            json={
                constants.Parameter.User.PARAM_EMAIL: "invalid-email",  # 不正な形式
                constants.Parameter.User.PARAM_PASSWORD: "password123",
                constants.Parameter.User.PARAM_NAME: "Test"
            }
        )

        # Assert
        assert response.status_code == 422
        data = response.json()
        assert constants.Parameter.Common.PARAM_DETAILS in data

    def test_login_password_below_min_length(self, client):
        """最小文字数未満のパスワード（7文字）でエラー"""
        # Act
        response = client.post(
            "/api/v1/users/login",
            json={
                constants.Parameter.User.PARAM_EMAIL: "test@example.com",
                constants.Parameter.User.PARAM_PASSWORD: "1234567",  # 7文字（最小8文字未満）
                constants.Parameter.User.PARAM_NAME: "Test"
            }
        )

        # Assert
        assert response.status_code == 422
