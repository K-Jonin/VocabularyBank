# tests/services/test_auth_service.py
import pytest
from datetime import datetime, timedelta
from unittest.mock import patch, MagicMock
from jose import jwt
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from app.services.auth_service import create_access_token, get_current_user
import app.constants as constants


class TestAuthService:
    """認証サービスのテスト"""

    # ========== create_access_token のテスト ==========

    def test_create_access_token_success(self):
        """トークンが正常に作成できる"""
        # Arrange
        test_data = {"sub": "test@example.com"}

        # Act
        token = create_access_token(test_data)

        # Assert
        assert token is not None
        assert isinstance(token, str)

        # トークンをデコードして内容を検証
        decoded = jwt.decode(
            token,
            constants.App.SECRET_KEY,
            algorithms=[constants.App.ALGORITHM]
        )
        assert decoded["sub"] == "test@example.com"
        assert "exp" in decoded

    def test_create_access_token_contains_expiration(self):
        """トークンに有効期限が含まれる"""
        # Arrange
        test_data = {"sub": "test@example.com"}

        # Act
        token = create_access_token(test_data)
        decoded = jwt.decode(
            token,
            constants.App.SECRET_KEY,
            algorithms=[constants.App.ALGORITHM]
        )

        # Assert
        assert "exp" in decoded
        # 有効期限が現在時刻より未来であることを確認
        assert decoded["exp"] > datetime.now().timestamp()

    def test_create_access_token_with_custom_data(self):
        """カスタムデータを含むトークンが作成できる"""
        # Arrange
        test_data = {
            "sub": "test@example.com",
            "role": "admin",
            "name": "Test User"
        }

        # Act
        token = create_access_token(test_data)
        decoded = jwt.decode(
            token,
            constants.App.SECRET_KEY,
            algorithms=[constants.App.ALGORITHM]
        )

        # Assert
        assert decoded["sub"] == "test@example.com"
        assert decoded["role"] == "admin"
        assert decoded["name"] == "Test User"

    # ========== get_current_user のテスト ==========

    def test_get_current_user_success(self):
        """有効なトークンでユーザー情報を取得できる"""
        # Arrange
        test_data = {"sub": "test@example.com"}
        token = create_access_token(test_data)
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=token
        )

        # Act
        result = get_current_user(credentials)

        # Assert
        assert result["sub"] == "test@example.com"
        assert "exp" in result

    def test_get_current_user_invalid_token(self):
        """無効なトークンで401エラーを返す"""
        # Arrange
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials="invalid_token_12345"
        )

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            get_current_user(credentials)

        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "無効なトークン"

    def test_get_current_user_missing_sub(self):
        """subが含まれないトークンで401エラーを返す"""
        # Arrange
        # subを含まないトークンを作成
        to_encode = {"name": "Test User"}
        expire = datetime.now() + timedelta(minutes=30)
        to_encode.update({"exp": expire.timestamp()})  # タイムスタンプに変換
        token = jwt.encode(
            to_encode,
            constants.App.SECRET_KEY,
            algorithm=constants.App.ALGORITHM
        )
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=token
        )

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            get_current_user(credentials)

        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "認証が必要です"

    def test_get_current_user_expired_token(self):
        """有効期限切れのトークンで401エラーを返す"""
        # Arrange
        # 期限切れのトークンを作成
        to_encode = {"sub": "test@example.com"}
        expire = datetime.now() - timedelta(minutes=1)  # 1分前に期限切れ
        to_encode.update({"exp": expire.timestamp()})  # タイムスタンプに変換
        token = jwt.encode(
            to_encode,
            constants.App.SECRET_KEY,
            algorithm=constants.App.ALGORITHM
        )
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=token
        )

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            get_current_user(credentials)

        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "無効なトークン"

    def test_get_current_user_wrong_secret_key(self):
        """異なる秘密鍵で作成されたトークンで401エラーを返す"""
        # Arrange
        # 異なる秘密鍵でトークンを作成
        to_encode = {"sub": "test@example.com"}
        expire = datetime.now() + timedelta(minutes=30)
        to_encode.update({"exp": expire.timestamp()})  # タイムスタンプに変換
        token = jwt.encode(
            to_encode,
            "wrong-secret-key",
            algorithm=constants.App.ALGORITHM
        )
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=token
        )

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            get_current_user(credentials)

        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "無効なトークン"
