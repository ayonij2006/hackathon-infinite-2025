from fastapi import Body, FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from models.Base64Request import Base64Request
from models.CreatePackageRequest import CreatePackageRequest
from ml_model import main

import base64

app = FastAPI()

# Allow Angular dev server
origins = ["http://localhost:4200"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 👈 allows Angular
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Authorization, Content-Type, etc.
)


@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    file_size = len(contents)

    return JSONResponse(
        {
            "filename": file.filename,
            "content_type": file.content_type,
            "file_size_bytes": file_size,
        }
    )


@app.post("/analyze/")
async def analyze_file(base64request: Base64Request):
    filePath = handle_base64_file(base64request.fileName, base64request.data)
    if filePath.startswith("error: "):
        return {"status": "error", "message": filePath}
    main(filePath)
    return JSONResponse({"file_contents": base64request.data, "filePath": filePath})


import base64


@app.post("/create/")
async def create_package(mapRequest: CreatePackageRequest):
    generate_package(mapRequest)
    file_path = "./output.txt"
    file_name = "output.txt"

    with open(file_path, "rb") as f:
        content_bytes = f.read()

    return {
        "message": "file created successfully",
        "filename": file_name,
        "content": content_bytes,
    }


def handle_base64_file(filename: str, b64_string: str):
    try:
        # Always decode to raw bytes first
        # raw_bytes = base64.b64decode(b64_string).decode("utf-8")
        raw_bytes = base64.b64decode(b64_string)

        # construct file path
        filePath = "./sample_files/" + filename

        # Pass raw_bytes to whatever logic you want (e.g., save to disk, parse lines)
        with open(filePath, "wb") as f:
            f.write(raw_bytes)

        return filePath
    except Exception as e:
        # return {"status": "error", "message": str(e)}
        return "error: " + str(e)


def generate_package(mapRequest: CreatePackageRequest):
    if mapRequest is not None:
        return "successful"
    else:
        return "unsuccessful"
