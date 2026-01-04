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
        # HttpOnly cookieが設定されていることを確認
        assert "token" in response.cookies
        # cookieの値を確認
        cookie = response.cookies["token"]
        assert cookie == "test_token_12345"
        # レスポンスボディにはメッセージのみ
        assert constants.Parameter.Common.PARAM_DATA in data
        assert "message" in data[constants.Parameter.Common.PARAM_DATA]
        # Set-Cookieヘッダーの確認
        set_cookie = response.headers.get("set-cookie")
        assert "HttpOnly" in set_cookie
        assert "SameSite" in set_cookie or "samesite" in set_cookie
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
        assert constants.Parameter.Common.PARAM_ERROR in data
        error = data[constants.Parameter.Common.PARAM_ERROR]
        assert constants.Parameter.Common.PARAM_CODE in error

    # ========== 3. 必須フィールド欠如 ==========

    def test_login_missing_email(self, client):
        """メールアドレスが欠けている場合バリデーションエラー"""
        # Act
        response = client.post(
            "/api/v1/users/login",
            json={
                constants.Parameter.User.PARAM_PASSWORD: "password123",
                constants.Parameter.User.PARAM_NAME: "Test"
            }
        )

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data[constants.Parameter.Common.PARAM_SUCCESS] == False
        assert constants.Parameter.Common.PARAM_ERROR in data
        error = data[constants.Parameter.Common.PARAM_ERROR]
        assert constants.Parameter.Common.PARAM_DETAILS in error

    def test_login_missing_password(self, client):
        """パスワードが欠けている場合バリデーションエラー"""
        # Act
        response = client.post(
            "/api/v1/users/login",
            json={
                constants.Parameter.User.PARAM_EMAIL: "test@example.com",
                constants.Parameter.User.PARAM_NAME: "Test"
            }
        )

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data[constants.Parameter.Common.PARAM_SUCCESS] == False
        assert constants.Parameter.Common.PARAM_ERROR in data
        error = data[constants.Parameter.Common.PARAM_ERROR]
        assert constants.Parameter.Common.PARAM_DETAILS in error

    def test_login_empty_email(self, client):
        """メールアドレスが空の場合バリデーションエラー"""
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
        assert response.status_code == 200
        data = response.json()
        assert data[constants.Parameter.Common.PARAM_SUCCESS] == False

    def test_login_empty_password(self, client):
        """パスワードが空の場合バリデーションエラー"""
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
        assert response.status_code == 200
        data = response.json()
        assert data[constants.Parameter.Common.PARAM_SUCCESS] == False

    # ========== 4. バリデーションエラー ==========

    def test_login_invalid_email_format(self, client):
        """メールアドレスの形式が不正な場合バリデーションエラー"""
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
        assert response.status_code == 200
        data = response.json()
        assert data[constants.Parameter.Common.PARAM_SUCCESS] == False
        assert constants.Parameter.Common.PARAM_ERROR in data
        error = data[constants.Parameter.Common.PARAM_ERROR]
        assert constants.Parameter.Common.PARAM_DETAILS in error

    def test_login_password_below_min_length(self, client):
        """最小文字数未満のパスワード（7文字）でバリデーションエラー"""
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
        assert response.status_code == 200
        data = response.json()
        assert data[constants.Parameter.Common.PARAM_SUCCESS] == False

    # ========== 4. ログアウト ==========

    def test_logout_success(self, client):
        """正常にログアウトできる"""
        # Act
        response = client.post("/api/v1/users/logout")

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data[constants.Parameter.Common.PARAM_SUCCESS] == True
        assert constants.Parameter.Common.PARAM_DATA in data
        assert "message" in data[constants.Parameter.Common.PARAM_DATA]
        # Set-Cookieヘッダーにcookie削除の指示が含まれている
        set_cookie_header = response.headers.get("set-cookie", "")
        assert "token=" in set_cookie_header
        # Max-Age=0またはexpiresが過去の日時であることを確認
        assert "Max-Age=0" in set_cookie_header or "max-age=0" in set_cookie_header.lower()

    # ========== 5. 認証確認 ==========

    def test_get_current_user_success(self, client):
        """有効なトークンで認証確認できる"""
        # Arrange
        from app.services.auth_service import create_access_token
        token = create_access_token({"sub": "test@example.com"})

        # Act
        response = client.get(
            "/api/v1/users/me",
            cookies={"token": token}
        )

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data[constants.Parameter.Common.PARAM_SUCCESS] == True
        assert data[constants.Parameter.Common.PARAM_DATA]["authenticated"] == True
        assert "email" in data[constants.Parameter.Common.PARAM_DATA]

    def test_get_current_user_no_token(self, client):
        """トークンなしで認証確認するとエラー"""
        # Act
        response = client.get("/api/v1/users/me")

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data[constants.Parameter.Common.PARAM_SUCCESS] == True
        assert data[constants.Parameter.Common.PARAM_DATA]["authenticated"] == False
        assert data[constants.Parameter.Common.PARAM_DATA]["email"] == ""

    def test_get_current_user_invalid_token(self, client):
        """無効なトークンで認証確認するとエラー"""
        # Act
        response = client.get(
            "/api/v1/users/me",
            cookies={"token": "invalid_token"}
        )

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data[constants.Parameter.Common.PARAM_SUCCESS] == True
        assert data[constants.Parameter.Common.PARAM_DATA]["authenticated"] == False
        assert data[constants.Parameter.Common.PARAM_DATA]["email"] == ""
