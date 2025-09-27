# backend/python-service/advanced_analysis.py

import numpy as np
import librosa
import os
from numpy import dot
from numpy.linalg import norm

# Note: Removed unnecessary imports like matplotlib and scipy.io for server stability.

class AdvancedPronunciationAnalyzer:
    """
    Core class for extracting standard speech features (MFCCs, Spectral properties)
    from raw audio data, mimicking the methodology used in L2 pronunciation models.
    """
    def __init__(self):
        # Standard sample rate for speech processing
        self.sample_rate = 16000
        
    def extract_audio_features(self, audio_data: np.ndarray):
        """
        Extracts MFCCs and spectral features from a raw NumPy audio array.

        Args:
            audio_data (np.ndarray): The raw audio signal (as a NumPy array) 
                                     loaded by librosa in main.py.

        Returns:
            dict: A dictionary containing mean MFCCs, spectral centroid, and rolloff, 
                  or None if an error occurs.
        """
        try:
            # 1. Convert to float (required by librosa)
            # The audio data is expected to be a float array from librosa.load()
            audio_float = audio_data.astype(np.float32)
            
            # 2. Extract MFCC features (13 coefficients is standard)
            # MFCCs are the key features for the trained model.
            mfccs = librosa.feature.mfcc(y=audio_float, sr=self.sample_rate, n_mfcc=13)
            
            # 3. Extract spectral features (for additional context/optional use)
            spectral_centroid = librosa.feature.spectral_centroid(y=audio_float, sr=self.sample_rate)
            spectral_rolloff = librosa.feature.spectral_rolloff(y=audio_float, sr=self.sample_rate)
            
            features = {
                # The mean of MFCCs over time is the 13-feature vector used by our classifier
                'mfcc_mean': np.mean(mfccs, axis=1),
                'mfcc_std': np.std(mfccs, axis=1),
                'spectral_centroid': np.mean(spectral_centroid),
                'spectral_rolloff': np.mean(spectral_rolloff),
                'duration': len(audio_float) / self.sample_rate
            }
            
            return features
            
        except Exception as e:
            # This will catch librosa or numpy errors and report them to main.py
            print(f"Error extracting audio features: {e}")
            return None
    
    # NOTE: The compare_pronunciation and cosine_similarity methods are kept 
    # for potential future rule-based analysis or direct feature comparison, 
    # though the main prediction now uses the trained model (in main.py).
    
    def cosine_similarity(self, vec1, vec2):
        """Calculates cosine similarity between two feature vectors."""
        if norm(vec1) == 0 or norm(vec2) == 0:
            return 0.0
        return dot(vec1, vec2) / (norm(vec1) * norm(vec2))
    
    def compare_pronunciation(self, reference_features, user_features):
        """Compares features (for legacy/rule-based scoring, not used by trained model)."""
        if not reference_features or not user_features:
            return 0.0
        
        # Example of how the features could be combined manually if the ML model were unavailable
        mfcc_similarity = self.cosine_similarity(
            reference_features['mfcc_mean'], 
            user_features['mfcc_mean']
        )
        
        # The trained model in main.py replaces this heuristic scoring.
        return mfcc_similarity 
