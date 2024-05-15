from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

class VideoRequest(BaseModel):
    # video: UploadFile
    # video: bytes = File(...)
    video: str