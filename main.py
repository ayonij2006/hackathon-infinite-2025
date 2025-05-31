from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

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