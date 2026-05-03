import os
import io
import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime
import google.generativeai as genai
from PIL import Image

def load_local_env():
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if not os.path.exists(env_path):
        return

    with open(env_path, "r", encoding="utf-8") as env_file:
        for raw_line in env_file:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and not os.environ.get(key):
                os.environ[key] = value

load_local_env()

def get_gemini_api_key():
    load_local_env()
    return os.environ.get("GEMINI_API_KEY")

def list_supported_generation_models():
    try:
        models = genai.list_models()
    except Exception:
        return []

    names = []
    for model in models:
        methods = getattr(model, "supported_generation_methods", []) or []
        if "generateContent" in methods:
            name = getattr(model, "name", "")
            if name.startswith("models/"):
                name = name[len("models/"):]
            if name:
                names.append(name)
    return names

def get_model_candidates():
    configured = os.environ.get("GEMINI_MODEL")
    preferred = [name.strip() for name in os.environ.get(
        "GEMINI_MODEL_FALLBACKS",
        "gemini-2.0-flash,gemini-1.5-flash,gemini-1.5-flash-latest"
    ).split(",") if name.strip()]

    ordered = []
    if configured:
        ordered.append(configured)
    ordered.extend(preferred)

    supported = list_supported_generation_models()
    if supported:
        supported_set = set(supported)
        flash_supported = sorted([name for name in supported if "flash" in name.lower()])
        ordered.extend(flash_supported)
        ordered.extend(sorted(supported_set))
        ordered = [name for name in ordered if name in supported_set]

    deduped = []
    seen = set()
    for name in ordered:
        if name in seen:
            continue
        seen.add(name)
        deduped.append(name)
    return deduped

app = FastAPI()
logger = logging.getLogger(__name__)

allowed_origins = [
    origin.strip()
    for origin in os.environ.get(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory State
gates_status = {
    "Gate 1": "Low",
    "Gate 2": "Low",
    "Gate 3": "Medium",
    "Gate 4": "Low",
    "Gate 5": "High",
    "Gate 6": "Medium",
    "Gate 7": "Low",
    "Gate 8": "Low",
}

feed = [
    {
        "author": "Organizer",
        "message": "Welcome to the match! Gates open at 3 PM.",
        "timestamp": datetime.now().strftime("%I:%M %p")
    }
]

# Models
class GateUpdate(BaseModel):
    gate: str
    status: Literal["Low", "Medium", "High"]

class FeedPost(BaseModel):
    author: str = Field(min_length=1, max_length=50)
    message: str = Field(min_length=1, max_length=500)

# Endpoints
@app.get("/api/gates")
def get_gates():
    return gates_status

@app.post("/api/gates/update")
def update_gate(update: GateUpdate):
    if update.gate in gates_status:
        gates_status[update.gate] = update.status
        return {"status": "success", "gate": update.gate, "new_status": update.status}
    raise HTTPException(status_code=404, detail="Gate not found")

@app.get("/api/feed")
def get_feed():
    return feed

@app.post("/api/feed/post")
def add_feed_post(post: FeedPost):
    new_post = {
        "author": post.author,
        "message": post.message,
        "timestamp": datetime.now().strftime("%I:%M %p")
    }
    # Insert at the beginning so the newest is first
    feed.insert(0, new_post)
    return new_post

# Configure Gemini
startup_api_key = get_gemini_api_key()
if startup_api_key:
    genai.configure(api_key=startup_api_key)

@app.post("/api/analyze-crowd")
async def analyze_crowd(file: UploadFile = File(...)):
    current_api_key = get_gemini_api_key()
    if not current_api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured in process or backend/.env.")
    genai.configure(api_key=current_api_key)
    
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Only image uploads are supported.")

        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        image = Image.open(io.BytesIO(contents))
        
        prompt = (
            "Analyze the crowd density in this image. "
            "1. Give me a congestion level exactly as one of the following words: Low, Medium, High. "
            "2. Also provide a short, natural language advisory for the crowd based on the density. "
            "Format your response EXACTLY as follows:\n"
            "LEVEL: <Low/Medium/High>\n"
            "ADVISORY: <Your advisory text>"
        )

        candidates = get_model_candidates()
        models_to_try = ['gemini-2.5-flash-lite'] + [m for m in candidates if m != 'gemini-2.5-flash-lite']
        response = None
        last_error = None
        
        for model_name in models_to_try:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content([prompt, image])
                break # Success!
            except Exception as model_error:
                last_error = model_error
                continue

        if response is None:
            logger.exception("No compatible Gemini model found for generateContent.", exc_info=last_error)
            raise HTTPException(
                status_code=502,
                detail="No compatible Gemini model is available for this API key. Set GEMINI_MODEL in backend/.env to a supported model."
            )
        
        # Parse response
        text = (response.text or "").strip()
        if not text:
            raise HTTPException(status_code=502, detail="AI model returned an empty response.")

        lines = text.split('\n')
        
        level = "Medium"
        advisory = "We are unable to generate a detailed advisory at this time."
        
        for line in lines:
            if line.upper().startswith("LEVEL:"):
                level_str = line.replace("LEVEL:", "").strip()
                # Clean up any potential markdown or extra formatting
                level_str = level_str.replace("*", "").strip()
                if "LOW" in level_str.upper():
                    level = "Low"
                elif "MEDIUM" in level_str.upper():
                    level = "Medium"
                elif "HIGH" in level_str.upper():
                    level = "High"
            elif line.upper().startswith("ADVISORY:"):
                advisory = line[len("ADVISORY:"):].strip()
                
        return {
            "level": level,
            "advisory": advisory
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Crowd analysis failed.")
        raise HTTPException(status_code=500, detail="Failed to analyze crowd image.")
