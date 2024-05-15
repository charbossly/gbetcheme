from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

class AudioTranslationRequest(BaseModel):
    src: str
    targ: str
    audio_file: UploadFile