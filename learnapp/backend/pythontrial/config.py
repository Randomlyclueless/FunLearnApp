# Configuration settings for the Pronunciation Assistant

# Word database configuration
WORD_DATABASE = [
    {
        "word": "hello",
        "phonetic": "həˈloʊ", 
        "difficulty": "easy",
        "category": "greetings"
    },
    {
        "word": "beautiful",
        "phonetic": "ˈbjuːtɪfəl",
        "difficulty": "medium", 
        "category": "adjectives"
    },
    {
        "word": "technology",
        "phonetic": "tekˈnɑːlədʒi",
        "difficulty": "medium",
        "category": "nouns"
    },
    {
        "word": "entrepreneur", 
        "phonetic": "ˌɑːntrəprəˈnɜːr",
        "difficulty": "hard",
        "category": "professions"
    },
    {
        "word": "pronunciation",
        "phonetic": "prəˌnʌnsiˈeɪʃən",
        "difficulty": "hard",
        "category": "language"
    }
]

# Audio settings
AUDIO_SETTINGS = {
    "sample_rate": 16000,
    "chunk_size": 1024,
    "timeout": 10,
    "phrase_time_limit": 5
}

# Recognition settings
RECOGNITION_SETTINGS = {
    "max_attempts": 3,
    "similarity_threshold": 0.7
}

# UI settings
UI_SETTINGS = {
    "show_phonetic": True,
    "show_progress": True,
    "play_reference_audio": True
}