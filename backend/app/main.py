import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.handlers.exception_handlers import register_exception_handlers
from app.routers import register_routers


# CORS設定
# 環境変数から許可するオリジンを取得（デフォルトは開発環境用）
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # 許可するオリジン
    allow_credentials=True,  # Cookieを含むリクエストを許可
    allow_methods=["*"],  # すべてのHTTPメソッドを許可（GET, POST, PUT, DELETE等）
    allow_headers=["*"],  # すべてのヘッダーを許可
)

# routers/ 配下のすべてのルーターを自動登録
register_routers(app)

# 例外ハンドラを登録
register_exception_handlers(app)
