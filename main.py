import json
import os
import subprocess
from fastapi import Body, FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from models.Base64Request import Base64Request
from models.CreatePackageRequest import CreatePackageRequest
from ml_model import main

import base64

app = FastAPI()

# Root dir
fileDir = "C:/temp/sample_files/"

# Exe path
exe_path = "./packagecreator.exe"

# Allow Angular dev server
origins = ["http://localhost:4200"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # allows Angular
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
    print(f"48" + filePath)
    if filePath.startswith("error: "):
        return {"status": "error", "message": filePath}
    resObj = main(base64request.fileName, filePath)
    return JSONResponse(content=resObj.dict())


import base64


@app.post("/create/")
async def create_package(mapRequest: CreatePackageRequest):
    conf_file_path = create_conf(mapRequest)
    # generate_package(mapRequest, conf_file_path)

    with open(conf_file_path, "rb") as f:
        content_bytes = f.read()

    return {
        "message": "file created successfully",
        "filename": conf_file_path,
        "content": content_bytes,
    }


def handle_base64_file(filename: str, b64_string: str):
    try:
        # Always decode to raw bytes first
        # raw_bytes = base64.b64decode(b64_string).decode("utf-8")
        raw_bytes = base64.b64decode(b64_string)

        # construct file path
        filePath = fileDir + filename
        os.makedirs(fileDir, exist_ok=True)

        # Pass raw_bytes to whatever logic you want (e.g., save to disk, parse lines)
        with open(filePath, "wb") as f:
            f.write(raw_bytes)

        return filePath
    except Exception as e:
        # return {"status": "error", "message": str(e)}
        return "error: " + str(e)


def generate_package(mapRequest: CreatePackageRequest, conf_file_path: str):
    if mapRequest is not None:
        result = subprocess.run([exe_path, conf_file_path], capture_output=True, text=True)
        
        # Check result
        print("Return Code:", result.returncode)
        
        if result.returncode == 0:
            return "success"
        else:
            return result.stderr.strip()
    else:
        return "invalid map"


def create_conf(mapRequest: CreatePackageRequest):
    name_without_ext = mapRequest.fileName.rsplit(".", 1)[0]
    conf_file_path = fileDir + name_without_ext + ".conf"
    print(f"119" + conf_file_path)
    with open(conf_file_path, "w") as f:
        json.dump(mapRequest.model_dump(), f)

    return conf_file_path
