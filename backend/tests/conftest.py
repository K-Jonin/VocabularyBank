# backend/tests/conftest.py
import sys
from pathlib import Path

# backendディレクトリをパスに追加（インポートより先に実行）
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# fmt: off
# isort: skip_file
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app
# fmt: on


@pytest.fixture(autouse=True)
def mock_message():
    """Messageクラスをモック（全テストで自動適用）"""
    with patch('app.utils.message.Message.get_message') as mock:
        # デフォルトのメッセージを返す
        mock.return_value = "テストメッセージ"
        yield mock


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def test_user_data():
    """テスト用ユーザーデータ"""
    return {
        "email": "test@example.com",
        "password": "password",
        "name": "Test User"
    }
