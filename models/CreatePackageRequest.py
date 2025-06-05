from pydantic import BaseModel

class MapModel (BaseModel):
    src_column_name: str
    trg_column_name: str
    datatype: str

class CreatePackageRequest (BaseModel):
    field_qualifier: str
    field_delimiter: str
    row_separator: str
    fileName: str
    filePath: str
    mappings: list[MapModel]
