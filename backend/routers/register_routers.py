import os
import importlib
import inspect
from pathlib import Path
from fastapi import FastAPI, APIRouter


def register_routers(app: FastAPI) -> None:
    """
    routers/ ディレクトリ配下のルーターを自動的に検出して登録する
    
    ルーターファイルの要件:
    - ファイル名が *_router.py のパターン
    - クラス名が *Router のパターン
    - クラスに router (APIRouter インスタンス) 属性を持つこと
    - クラスに __PREFIX (プレフィックス) と __TAGS (タグ) の private 属性を持つこと（オプション）
    
    Args:
        app: FastAPI アプリケーションインスタンス
    """
    
    # routers ディレクトリのパスを取得
    routers_dir = Path(__file__).parent
    
    # routers/ 配下の *_router.py ファイルを検索
    router_files = routers_dir.glob("*_router.py")
    
    for router_file in router_files:
        # ファイル名からモジュール名を取得
        module_name = router_file.stem  # 拡張子なしのファイル名
        
        try:
            # モジュールを動的にインポート
            module = importlib.import_module(f"routers.{module_name}")
            
            # モジュール内のすべてのクラスを検索
            for name, obj in inspect.getmembers(module, inspect.isclass):
                # *Router という名前パターンのクラスを検索
                if name.endswith("Router") and hasattr(obj, "router"):
                    router_instance = obj.router
                    
                    # APIRouter インスタンスであることを確認
                    if isinstance(router_instance, APIRouter):
                        # プレフィックスとタグを取得（存在する場合）
                        prefix = getattr(obj, f"_{name}__PREFIX", "")
                        tags = getattr(obj, f"_{name}__TAGS", [])
                        
                        # ルーターを登録
                        app.include_router(
                            router_instance,
                            prefix=prefix,
                            tags=tags
                        )
                        
                        print(f"✓ Registered router: {name} (prefix: {prefix or '/'}, tags: {tags})")
        
        except Exception as e:
            print(f"✗ Failed to register router from {module_name}: {e}")


def get_all_routers() -> list:
    """
    routers/ ディレクトリ配下のすべてのルーターを取得する
    
    Returns:
        list: ルータークラスのリスト
    """
    routers_list = []
    routers_dir = Path(__file__).parent
    router_files = routers_dir.glob("*_router.py")
    
    for router_file in router_files:
        module_name = router_file.stem
        
        try:
            module = importlib.import_module(f"routers.{module_name}")
            
            for name, obj in inspect.getmembers(module, inspect.isclass):
                if name.endswith("Router") and hasattr(obj, "router"):
                    routers_list.append({
                        "name": name,
                        "module": module_name,
                        "class": obj
                    })
        except Exception as e:
            print(f"✗ Failed to load router from {module_name}: {e}")
    
    return routers_list
