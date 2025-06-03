from pydantic import BaseModel


class Base64Request(BaseModel):
    data: str  # base64-encoded string