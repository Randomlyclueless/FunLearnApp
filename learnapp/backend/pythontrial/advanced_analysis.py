import numpy as np
from scipy.io import wavfile
import matplotlib.pyplot as plt
import librosa
import tempfile
import os

class AdvancedPronunciationAnalyzer:
    def __init__(self):
        self.sample_rate = 16000
        
    def extract_audio_features(self, audio_data):
        """Extract audio features for pronunciation analysis"""
        try:
            # Convert to numpy array if it's not already
            if hasattr(audio_data, 'get_raw_data'):
                audio_array = np.frombuffer(audio_data.get_raw_data(), dtype=np.int16)
            else:
                audio_array = audio_data
            
            # Normalize audio
            audio_float = audio_array.astype(np.float32) / 32768.0
            
            # Extract MFCC features (commonly used in speech recognition)
            mfccs = librosa.feature.mfcc(y=audio_float, sr=self.sample_rate, n_mfcc=13)
            
            # Extract spectral features
            spectral_centroid = librosa.feature.spectral_centroid(y=audio_float, sr=self.sample_rate)
            spectral_rolloff = librosa.feature.spectral_rolloff(y=audio_float, sr=self.sample_rate)
            
            features = {
                'mfcc_mean': np.mean(mfccs, axis=1),
                'mfcc_std': np.std(mfccs, axis=1),
                'spectral_centroid': np.mean(spectral_centroid),
                'spectral_rolloff': np.mean(spectral_rolloff),
                'duration': len(audio_float) / self.sample_rate
            }
            
            return features
            
        except Exception as e:
            print(f"Error extracting audio features: {e}")
            return None
    
    def compare_pronunciation(self, reference_features, user_features):
        """Compare user pronunciation with reference"""
        if not reference_features or not user_features:
            return 0.0
        
        similarity_score = 0.0
        
        # Compare MFCC features
        mfcc_similarity = self.cosine_similarity(
            reference_features['mfcc_mean'], 
            user_features['mfcc_mean']
        )
        similarity_score += mfcc_similarity * 0.6
        
        # Compare spectral features
        centroid_similarity = 1 - abs(
            reference_features['spectral_centroid'] - user_features['spectral_centroid']
        ) / max(reference_features['spectral_centroid'], user_features['spectral_centroid'])
        
        rolloff_similarity = 1 - abs(
            reference_features['spectral_rolloff'] - user_features['spectral_rolloff']
        ) / max(reference_features['spectral_rolloff'], user_features['spectral_rolloff'])
        
        similarity_score += (centroid_similarity + rolloff_similarity) * 0.2
        
        return max(0.0, min(1.0, similarity_score))
    
    def cosine_similarity(self, vec1, vec2):
        """Calculate cosine similarity between two vectors"""
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot_product / (norm1 * norm2)

# Integrate with main class
def enhance_main_class():
    """Add advanced analysis to the main PronunciationAssistant class"""
    
    # Add this method to the PronunciationAssistant class
    def analyze_pronunciation_advanced(self, target_word, user_audio):
        """Advanced pronunciation analysis using audio features"""
        analyzer = AdvancedPronunciationAnalyzer()
        
        # You would need reference audio for each word
        # For now, we'll use a simplified approach
        user_features = analyzer.extract_audio_features(user_audio)
        
        if user_features:
            # In a real implementation, you'd compare with pre-recorded reference audio
            # For this example, we'll use duration and energy as simple indicators
            
            duration = user_features['duration']
            energy = np.mean(user_features['mfcc_mean'])
            
            # Simple heuristics for demonstration
            if duration < 0.3:  # Too short
                return False, "Pronunciation was too short"
            elif duration > 3.0:  # Too long
                return False, "Pronunciation was too long"
            elif abs(energy) < 0.1:  # Too quiet
                return False, "Please speak louder"
            else:
                # Fall back to text-based analysis
                user_text = self.recognizer.recognize_google(user_audio)
                return self.analyze_pronunciation(target_word, user_text)
        
        return False, "Could not analyze audio features"