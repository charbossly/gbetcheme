from pydantic import BaseModel

class TextTranslationRequest(BaseModel):
    src: str
    targ: str
    text: str