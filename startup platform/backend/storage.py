import os
import shutil
from fastapi import UploadFile
from datetime import datetime

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")


if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

def save_uploaded_file(file: UploadFile, startup_name: str, folder_name: str) -> str:
   
    safe_name = "".join(x for x in startup_name if x.isalnum()).lower()
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    
    
    filename = f"{timestamp}_{file.filename}"
    
    target_dir = os.path.join(UPLOAD_DIR, safe_name, folder_name)
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
        
    file_path = os.path.join(target_dir, filename)
    
   
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return f"/uploads/{safe_name}/{folder_name}/{filename}"