from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError
import app.constants as constants


security = HTTPBearer()


def create_access_token(data: dict):
    """
    アクセストークン作成

    Parameters:
        data: トークンに含めるデータ

    Returns:
        アクセストークン
    """
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=constants.App.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, constants.App.SECRET_KEY, algorithm=constants.App.ALGORITHM)


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    現在のユーザー取得（依存性注入用）

    Parameters:
        credentials: HTTPBearer認証情報

    Returns:
        トークンのペイロード（ユーザー情報）
    """
    try:
        payload = jwt.decode(
            credentials.credentials,
            constants.App.SECRET_KEY,
            algorithms=[constants.App.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="認証が必要です")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="無効なトークン")
