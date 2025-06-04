from pydantic import BaseModel


class Base64Request(BaseModel):
    fileName: str # filename of uploaded file
    data: str  # base64-encoded string