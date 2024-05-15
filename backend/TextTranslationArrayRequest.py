from pydantic import BaseModel
from typing import List

class TextTranslationArrayRequest(BaseModel):
    src: str
    targ: str
    texts: List[str]
    timelines: List[int]