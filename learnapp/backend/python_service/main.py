# backend/python-service/main.py

import os
import librosa
import numpy as np
from joblib import load

# Import the feature extraction logic from your adjacent file
from advanced_analysis import AdvancedPronunciationAnalyzer 

# Global variable to hold the trained model instance
PRONUNCIATION_MODEL = None 

# --- Helper Function for Model Loading ---
def load_ai_model():
    """Load the trained model from the joblib file."""
    global PRONUNCIATION_MODEL
    try:
        model_path = "pronunciation_model.joblib"
        # Check if the model file created by train_model.py exists
        if os.path.exists(model_path):
            PRONUNCIATION_MODEL = load(model_path)
            print(f"Successfully loaded AI model from {model_path}")
            return True
        else:
            print(f"INFO: AI model file {model_path} not found. Running in PLACEHOLDER mode.")
            PRONUNCIATION_MODEL = None
            return False
    except Exception as e:
        print(f"ERROR: Could not load the model: {e}")
        PRONUNCIATION_MODEL = None
        return False

# Load the model immediately when this file is imported by app.py
load_ai_model()


# =================================================================
# API ENTRY POINT: The function that app.py will call
# =================================================================

def analyze_pronunciation_for_api(audio_path: str, target_word: str):
    """
    Receives an audio file path, runs the feature extraction and the trained model,
    and returns a score and feedback.
    """
    global PRONUNCIATION_MODEL
    
    # 1. Fallback if the AI model is not yet trained/loaded
    if PRONUNCIATION_MODEL is None:
        return {
            "score": 0.10,
            "feedback": f"SYSTEM ERROR: AI Model not trained/loaded. Target: {target_word}",
            "target_word": target_word
        }

    # 2. Load Audio and Extract Features
    analyzer = AdvancedPronunciationAnalyzer()
    
    try:
        # Load audio using librosa (handles various formats: wav, m4a, etc.)
        y, sr = librosa.load(audio_path, sr=analyzer.sample_rate)
        # Pass the raw audio array to the feature extractor from advanced_analysis.py
        features = analyzer.extract_audio_features(y)
    except Exception as e:
        return {"score": 0.0, "feedback": f"Audio processing failed (librosa): {e}", "target_word": target_word}

    if features is None or 'mfcc_mean' not in features:
        return {"score": 0.0, "feedback": "Could not extract MFCC features from audio.", "target_word": target_word}

    # 3. Format Features for the Model
    # Our trained model expects a single feature vector (1x13, representing 13 mean MFCCs)
    # The reshape is crucial for scikit-learn models.
    feature_vector = features['mfcc_mean'].reshape(1, -1)
    
    # 4. Get Prediction and Probability (Score)
    # prediction = PRONUNCIATION_MODEL.predict(feature_vector)[0] # Binary (0 or 1)
    # Get probability of being "correct" (class 1)
    probability = PRONUNCIATION_MODEL.predict_proba(feature_vector)[0][1] 

    score = round(float(probability), 2)
    
    # 5. Generate Feedback based on the score
    if score >= 0.90:
        feedback = "Excellent pronunciation! Great job."
    elif score >= 0.70:
        feedback = "Good job! A little practice on vowels will make it perfect."
    else:
        feedback = "Needs practice. Try focusing on the initial sound."
        
    return {
        "score": score, 
        "feedback": feedback, 
        "target_word": target_word
    }
