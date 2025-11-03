from fastapi import FastAPI
from pymongo import MongoClient
import os

app = FastAPI()

mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(mongo_uri)
db = client["mydb"]

@app.get("/")
def read_root():
    count = db["test"].count_documents({})
    return {"message": "Hello FastAPI + MongoDB!", "documents_in_test": count}

@app.post("/add")
def add_item(item: dict):
    db["test"].insert_one(item)
    return {"status": "ok", "item": item}
