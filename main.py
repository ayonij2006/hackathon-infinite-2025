from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

from tensorflow_check.tensorflow_check import run_tensorflow_check

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    file_size = len(contents)
    
    return JSONResponse({
        "filename": file.filename,
        "content_type": file.content_type,
        "file_size_bytes": file_size
    })

@app.get("/check-tensorflow")
def check_tensorflow():
    result = run_tensorflow_check()
    return {"status": "success", "data": result}