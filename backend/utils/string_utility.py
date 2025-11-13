from __future__ import annotations
import re
from typing import Optional


class StringUtility:
    """文字列ユーティリティクラス"""

    @staticmethod
    def snake_to_lower_camel(s: Optional[str]) -> Optional[str]:
        """
        snake_case -> lowerCamelCase 変換

        Parameters:
            s: 変換対象文字列
        """
        if s is None:
            return None
        s = s.strip("_")
        if not s:
            return ""

        parts = re.split(r"_+", s)
        first = parts[0].lower()
        others = [(p[:1].upper() + p[1:].lower())
                  if p else "" for p in parts[1:]]
        return first + "".join(others)
