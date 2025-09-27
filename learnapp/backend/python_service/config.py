# Configuration settings for the Pronunciation Assistant

# Word database configuration (Moved to JSON later, but kept here for configuration reference)
WORD_DATABASE_CONFIG = [
    {"word": "hello", "phonetic": "həˈloʊ", "difficulty": "easy"},
    # ... placeholder for the full list if used internally
]

# Audio settings
AUDIO_SETTINGS = {
    "sample_rate": 16000,
    "chunk_size": 1024,
    "timeout": 10,
    "phrase_time_limit": 5
}

# Recognition settings (used by the simple classifier)
RECOGNITION_SETTINGS = {
    "max_attempts": 3,
    "similarity_threshold": 0.7
}

# UI settings (can be read by the client via API later)
UI_SETTINGS = {
    "show_phonetic": True,
    "show_progress": True,
    "play_reference_audio": True
}
