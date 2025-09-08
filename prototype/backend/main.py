from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
import jiwer
import base64
import io
import soundfile as sf

app = FastAPI(title="Leximate Backend")

# Allow React Native app to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev/testing, later restrict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- Pipelines (load once at startup) --------
asr = pipeline("automatic-speech-recognition", model="openai/whisper-small")
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
sentiment_analyzer = pipeline("sentiment-analysis")

# -------- Speech-to-Text (base64 audio input) --------
@app.post("/analyze-speech")
async def analyze_speech(request: Request):
    data = await request.json()
    audio_b64 = data.get("audio", "")
    target_text = data.get("target", "")

    # Decode base64 → wav bytes
    audio_bytes = base64.b64decode(audio_b64)
    audio_io = io.BytesIO(audio_bytes)

    # Read audio with soundfile
    speech, sample_rate = sf.read(audio_io)

    # Run ASR
    result = asr({"array": speech, "sampling_rate": sample_rate})
    transcription = result["text"]

    # Compute accuracy vs target
    wer = jiwer.wer(target_text, transcription) if target_text else 1
    accuracy = round((1 - wer) * 100, 2)

    return {
        "target": target_text,
        "transcription": transcription,
        "accuracy": accuracy
    }

# -------- Poem Classification --------
@app.post("/analyze-poem")
async def analyze_poem(request: Request):
    data = await request.json()
    poem_text = data.get("poem", "")

    candidate_labels = ["Love", "Nature", "Friendship", "Sadness", "Adventure"]
    result = classifier(poem_text, candidate_labels)

    return {
        "labels": result["labels"],
        "scores": result["scores"],
        "top_label": result["labels"][0]
    }

# -------- Sentiment Analysis --------
@app.post("/analyze-sentiment")
async def analyze_sentiment(request: Request):
    data = await request.json()
    poem_text = data.get("poem", "")
    result = sentiment_analyzer(poem_text)[0]
    return {"sentiment": result["label"], "score": result["score"]}

# -------- Topic Extraction --------
@app.post("/extract-topics")
async def extract_topics(request: Request):
    data = await request.json()
    poem_text = data.get("poem", "")

    candidate_labels = ["Love", "Nature", "Friendship", "Sadness", "Adventure"]
    result = classifier(poem_text, candidate_labels)

    return {"topics": result["labels"][:3], "scores": result["scores"][:3]}

# -------- Health Check (dummy route to silence logs) --------
@app.get("/health")
async def health_check():
    return {"status": "ok"}
