FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN pip install debugpy

COPY . .

# 環境変数 DEBUG_MODE で開発/本番を切り替え
CMD if [ "$DEBUG_MODE" = "true" ]; then \
	python -m debugpy --listen 0.0.0.0:5678 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload; \
	else \
	uvicorn main:app --host 0.0.0.0 --port 8000; \
	fi
