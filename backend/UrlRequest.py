from pydantic import BaseModel

class UrlRequest(BaseModel):
    url: str
   