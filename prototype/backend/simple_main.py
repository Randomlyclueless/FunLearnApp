from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Leximate Backend")

# Allow your React Native app to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-sentiment")
async def analyze_sentiment(request: Request):
    data = await request.json()
    poem_text = data.get("poem", "")
    
    # Simple sentiment analysis
    positive_words = ["love", "happy", "joy", "smile", "beautiful", "wonderful", "peace"]
    negative_words = ["sad", "cry", "tears", "pain", "death", "lonely", "dark"]
    
    positive_count = sum(1 for word in positive_words if word in poem_text.lower())
    negative_count = sum(1 for word in negative_words if word in poem_text.lower())
    
    if positive_count > negative_count:
        sentiment = "positive"
    elif negative_count > positive_count:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    
    return {
        "sentiment": sentiment,
        "positive_words": positive_count,
        "negative_words": negative_count
    }

@app.post("/extract-topics")
async def extract_topics(request: Request):
    data = await request.json()
    poem_text = data.get("poem", "")
    
    # Simple topic extraction
    common_topics = {
        "nature": ["tree", "flower", "sky", "river", "mountain", "bird", "sun"],
        "love": ["love", "heart", "kiss", "romance", "darling", "sweet"],
        "friendship": ["friend", "companion", "together", "support", "loyal"],
        "family": ["mother", "father", "parent", "child", "family", "home"],
        "adventure": ["journey", "travel", "explore", "adventure", "discover"]
    }
    
    found_topics = []
    for topic, keywords in common_topics.items():
        if any(keyword in poem_text.lower() for keyword in keywords):
            found_topics.append(topic)
    
    # If no topics found, add some defaults
    if not found_topics:
        found_topics = ["emotions", "reflection"]
    
    return {
        "topics": found_topics[:3]  # Return max 3 topics
    }

@app.get("/")
async def root():
    return {"message": "Leximate Backend API is running", "endpoints": [
        "/analyze-sentiment",
        "/extract-topics"
    ]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)