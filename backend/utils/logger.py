import logging
import json
import sys
import os
from datetime import datetime
from typing import Any


class JsonFormatter(logging.Formatter):
    """JSON形式でログを出力するカスタムフォーマッター"""

    def format(self, record: logging.LogRecord) -> str:
        """
        ログレコードをJSON形式に変換

        Args:
            record: ログレコード

        Returns:
            JSON形式のログ文字列
        """
        log_data = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno
        }

        # 例外情報がある場合は追加
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        # 追加の属性があれば追加
        if hasattr(record, "extra_data"):
            log_data["extra"] = record.extra_data

        return json.dumps(log_data, ensure_ascii=False)


def setup_logger(name: str = "app") -> logging.Logger:
    """
    JSON形式のロガーをセットアップ

    Args:
        name: ロガー名

    Returns:
        設定済みのロガー
    """
    logger = logging.getLogger(name)

    # 既にハンドラーが設定されている場合はスキップ
    if logger.handlers:
        return logger

    # 環境変数からログレベルを取得（デフォルトはINFO）
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    logger.setLevel(getattr(logging, log_level, logging.INFO))

    # 標準出力へのハンドラーを作成
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logger.level)

    # JSON形式のフォーマッターを設定
    formatter = JsonFormatter()
    handler.setFormatter(formatter)

    logger.addHandler(handler)

    # 親ロガーへの伝播を無効化（重複ログを防ぐ）
    logger.propagate = False

    return logger


def get_logger(name: str = "app") -> logging.Logger:
    """
    ロガーを取得（既に設定済みのものを返す）

    Args:
        name: ロガー名

    Returns:
        ロガー
    """
    return logging.getLogger(name)
