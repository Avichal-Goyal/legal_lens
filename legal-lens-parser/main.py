# main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pymupdf4llm
import tempfile
import shutil
import os

app = FastAPI()

# Allow your Next.js app on localhost:3000 to talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/extract")
async def extract_pdf(file: UploadFile = File(...)):
    # 1. Create a secure, cross-platform temporary file (works perfectly on Windows)
    fd, temp_path = tempfile.mkstemp(suffix=".pdf")
    
    try:
        # 2. Save the incoming PDF to this temporary file
        with os.fdopen(fd, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print(f"Extracting markdown from {file.filename}...")
        
        # 3. Run PyMuPDF4LLM extraction (this is the actual parsing logic!)
        md_text = pymupdf4llm.to_markdown(doc=temp_path)
        
        # 4. Return the beautifully formatted Markdown
        return {"markdown": md_text}
        
    except Exception as e:
        print(f"Error parsing: {str(e)}")
        return {"error": str(e)}
        
    finally:
        # 5. Clean up by deleting the temporary PDF
        if os.path.exists(temp_path):
            os.remove(temp_path)