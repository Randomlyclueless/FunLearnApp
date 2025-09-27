# backend/python-service/app.py

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
import os
import time
import io
import shutil

# CRITICAL IMPORT: This imports the analysis function from main.py
from main import analyze_pronunciation_for_api 

# Initialize the FastAPI application object
app = FastAPI()

# --- Health Check ---
@app.get("/")
def home():
    """Simple health check endpoint."""
    return {"message": "AI Pronunciation Service is running!"}

# --- Main Analysis Endpoint ---
@app.post("/analyze/")
async def analyze(
    file: UploadFile = File(..., description="The user's audio recording (WAV or MP3)"),
    target_word: str = Form(..., description="The word the user was asked to pronounce")
):
    """
    Endpoint to receive audio, analyze pronunciation, and return score/feedback.
    """
    
    # 1. Validation Check
    # We allow common mobile formats: wav, m4a (mpeg), and mp3
    if file.content_type not in ["audio/wav", "audio/mp3", "audio/mpeg", "audio/m4a"]:
        raise HTTPException(status_code=400, detail=f"Invalid file type: {file.content_type}. Expected audio/wav, audio/m4a, or audio/mp3.")

    # Use the current time to ensure a unique temporary filename
    temp_file_name = f"temp_{int(time.time())}_{file.filename}"
    temp_file_path = os.path.join(os.getcwd(), temp_file_name)
    
    # 2. Save uploaded audio temporarily (Robust Method)
    try:
        # Read the file content asynchronously (more reliable in FastAPI)
        file_contents = await file.read()
        
        # Write the content synchronously to the temporary file path
        with open(temp_file_path, "wb") as buffer:
            buffer.write(file_contents)
            
        # 3. Call the AI model function from main.py
        # This function processes the file at the temporary path
        analysis_result = analyze_pronunciation_for_api(temp_file_path, target_word)

        # 4. Return the results
        return JSONResponse(content=analysis_result)

    except Exception as e:
        # Log the error detail for debugging in the Python console
        print(f"FATAL ERROR during analysis processing for {target_word}: {e}")
        # Return a standard server error response to the client
        raise HTTPException(status_code=500, detail=f"Internal Server Error during AI analysis: {e}")
    
    finally:
        # 5. Clean up the temporary file (CRITICAL step)
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            # print(f"Cleaned up {temp_file_name}") # Optional debug line

if __name__ == "__main__":
    # Runs the server locally. Host 0.0.0.0 makes it accessible to external devices/emulators
    uvicorn.run(app, host="0.0.0.0", port=8000)
