import numpy as np
import librosa
from scipy import spatial
import speech_recognition as sr
import tempfile
import os

class ColorsPronunciationAnalyzer:
    def __init__(self):
        self.sample_rate = 16000
        self.color_names = ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown"]
        self.recognizer = sr.Recognizer()
        
    def extract_pronunciation_features(self, audio_data):
        """Extract features specifically for color name pronunciation"""
        try:
            # Convert to numpy array if needed
            if hasattr(audio_data, 'get_raw_data'):
                audio_array = np.frombuffer(audio_data.get_raw_data(), dtype=np.int16)
            else:
                audio_array = audio_data
            
            # Normalize audio
            audio_float = audio_array.astype(np.float32) / 32768.0
            
            # Extract features relevant for color names
            mfccs = librosa.feature.mfcc(y=audio_float, sr=self.sample_rate, n_mfcc=13)
            spectral_centroid = librosa.feature.spectral_centroid(y=audio_float, sr=self.sample_rate)
            zero_crossing_rate = librosa.feature.zero_crossing_rate(audio_float)
            
            return {
                'mfcc_mean': np.mean(mfccs, axis=1),
                'mfcc_std': np.std(mfccs, axis=1),
                'spectral_centroid_mean': np.mean(spectral_centroid),
                'zero_crossing_mean': np.mean(zero_crossing_rate),
                'duration': len(audio_float) / self.sample_rate,
                'energy': np.mean(audio_float ** 2)
            }
            
        except Exception as e:
            print(f"Error extracting features: {e}")
            return None
    
    def recognize_speech(self, audio_path):
        """Convert speech to text using Google Speech Recognition"""
        try:
            with sr.AudioFile(audio_path) as source:
                audio = self.recognizer.record(source)
                text = self.recognizer.recognize_google(audio).lower()
                return text
        except sr.UnknownValueError:
            return None
        except sr.RequestError as e:
            print(f"Speech recognition error: {e}")
            return None
    
    def analyze_color_pronunciation(self, target_color, audio_path):
        """Analyze pronunciation for specific color names with speech recognition"""
        # First, recognize what was actually said
        recognized_text = self.recognize_speech(audio_path)
        
        # Extract audio features
        audio_features = self.extract_pronunciation_features_from_file(audio_path)
        
        if not audio_features:
            return {
                "score": 0, 
                "rating": "Error", 
                "feedback": ["Could not analyze audio features"],
                "recognized_word": recognized_text or "Unknown",
                "is_correct_word": False
            }
        
        feedback = []
        score = 100  # Start with perfect score
        
        # CRITICAL: Check if the correct word was said
        is_correct_word = False
        if recognized_text:
            # Check if the recognized text contains the target color
            if target_color.lower() in recognized_text.lower():
                is_correct_word = True
                feedback.append("✅ Correct word recognized!")
            else:
                is_correct_word = False
                score -= 40  # Heavy penalty for wrong word
                feedback.append(f"❌ You said '{recognized_text}', but should be '{target_color}'")
        else:
            # If speech recognition failed, we can't verify the word
            is_correct_word = False
            score -= 30
            feedback.append("❓ Could not understand what you said")
        
        # Only check pronunciation quality if the correct word was said
        if is_correct_word:
            # Duration check
            if audio_features['duration'] < 0.3:
                score -= 15
                feedback.append("🗣️ Speak a bit longer")
            elif audio_features['duration'] > 2.0:
                score -= 10
                feedback.append("🗣️ Try saying it quicker")
            
            # Energy check (volume)
            if audio_features['energy'] < 0.001:
                score -= 10
                feedback.append("🔊 Speak louder")
            
            # Zero crossing rate (indicates voicing)
            if audio_features['zero_crossing_mean'] < 0.05:
                score -= 8
                feedback.append("🎤 Make sure to voice the word clearly")
            
            # Color-specific pronunciation guidance
            color_feedback = self.get_color_specific_feedback(target_color, audio_features)
            if color_feedback:
                feedback.append(color_feedback)
                score -= 5
        else:
            # If wrong word, focus feedback on that
            feedback.append("🎯 Focus on saying the correct color name")
        
        # Ensure score is within bounds
        score = max(0, min(100, score))
        
        # Determine rating
        if score >= 85:
            rating = "Excellent! 🌟"
        elif score >= 70:
            rating = "Good! 👍"
        elif score >= 50:
            rating = "Okay! 💪"
        else:
            rating = "Keep practicing! 📚"
        
        return {
            "score": round(score),
            "rating": rating,
            "feedback": feedback,
            "recognized_word": recognized_text or "Unknown",
            "is_correct_word": is_correct_word,
            "target_word": target_color,
            "duration": round(audio_features['duration'], 2),
            "energy": round(audio_features['energy'], 4)
        }
    
    def extract_pronunciation_features_from_file(self, audio_path):
        """Extract features from audio file"""
        try:
            # Load audio file
            audio_data, sr = librosa.load(audio_path, sr=self.sample_rate)
            audio_float = audio_data.astype(np.float32)
            
            # Extract features
            mfccs = librosa.feature.mfcc(y=audio_float, sr=sr, n_mfcc=13)
            spectral_centroid = librosa.feature.spectral_centroid(y=audio_float, sr=sr)
            zero_crossing_rate = librosa.feature.zero_crossing_rate(audio_float)
            
            return {
                'mfcc_mean': np.mean(mfccs, axis=1),
                'mfcc_std': np.std(mfccs, axis=1),
                'spectral_centroid_mean': np.mean(spectral_centroid),
                'zero_crossing_mean': np.mean(zero_crossing_rate),
                'duration': len(audio_float) / sr,
                'energy': np.mean(audio_float ** 2)
            }
            
        except Exception as e:
            print(f"Error extracting features from file: {e}")
            return None
    
    def get_color_specific_feedback(self, color_name, features):
        """Provide specific feedback for each color"""
        feedback_map = {
            "red": "Make the 'r' sound strong at the beginning",
            "blue": "Emphasize the 'bl' blend clearly",
            "green": "Clear 'gr' sound and long 'ee' vowel",
            "yellow": "Focus on the 'yell' part, not too fast",
            "orange": "Two syllables: 'or' and 'ange'",
            "purple": "Don't forget the 'r' in the middle",
            "pink": "Clear 'p' sound at the beginning",
            "brown": "Strong 'br' blend, round 'ow' sound"
        }
        return feedback_map.get(color_name.lower())

# Flask API endpoint example (add this to your main app)
"""
from flask import Flask, request, jsonify
import tempfile
import os

app = Flask(__name__)
analyzer = ColorsPronunciationAnalyzer()

@app.route('/analyze-color-pronunciation', methods=['POST'])
def analyze_pronunciation():
    if 'audio' not in request.files or 'colorName' not in request.form:
        return jsonify({'error': 'Missing audio file or colorName'}), 400
    
    audio_file = request.files['audio']
    color_name = request.form['colorName']
    
    # Save audio to temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
        audio_file.save(temp_audio.name)
        result = analyzer.analyze_color_pronunciation(color_name, temp_audio.name)
    
    # Clean up temporary file
    os.unlink(temp_audio.name)
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
"""