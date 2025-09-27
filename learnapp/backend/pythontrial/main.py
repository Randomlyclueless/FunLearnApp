import speech_recognition as sr
from gtts import gTTS
import pygame
import io
import requests
import numpy as np
from scipy.io import wavfile
import tempfile
import os
import time
import json

class PronunciationAssistant:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        self.words_database = self.load_words_database()
        self.current_word_index = 0
        
        # Initialize pygame for audio playback
        pygame.mixer.init()
        
        # Calibrate microphone for ambient noise
        print("Calibrating microphone for ambient noise...")
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=2)
        print("Microphone calibrated!")
    
    def load_words_database(self):
        """Load words with their phonetic pronunciations"""
        words = [
            {"word": "hello", "phonetic": "həˈloʊ", "difficulty": "easy"},
            {"word": "beautiful", "phonetic": "ˈbjuːtɪfəl", "difficulty": "medium"},
            {"word": "entrepreneur", "phonetic": "ˌɑːntrəprəˈnɜːr", "difficulty": "hard"},
            {"word": "technology", "phonetic": "tekˈnɑːlədʒi", "difficulty": "medium"},
            {"word": "pronunciation", "phonetic": "prəˌnʌnsiˈeɪʃən", "difficulty": "hard"},
            {"word": "computer", "phonetic": "kəmˈpjuːtər", "difficulty": "easy"},
            {"word": "algorithm", "phonetic": "ˈælɡərɪðəm", "difficulty": "medium"},
            {"word": "artificial", "phonetic": "ˌɑːrtɪˈfɪʃəl", "difficulty": "medium"},
            {"word": "intelligence", "phonetic": "ɪnˈtelɪdʒəns", "difficulty": "medium"},
            {"word": "machine", "phonetic": "məˈʃiːn", "difficulty": "easy"}
        ]
        return words
    
    def text_to_speech(self, text):
        """Convert text to speech using gTTS"""
        try:
            tts = gTTS(text=text, lang='en', slow=True)
            
            # Create temporary file for audio
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as tmp_file:
                tts.save(tmp_file.name)
                tmp_file.flush()
                
                # Play audio using pygame
                pygame.mixer.music.load(tmp_file.name)
                pygame.mixer.music.play()
                
                # Wait for playback to finish
                while pygame.mixer.music.get_busy():
                    pygame.time.wait(100)
                
                # Clean up temporary file
                os.unlink(tmp_file.name)
                
        except Exception as e:
            print(f"Error in text-to-speech: {e}")
    
    def listen_to_user(self):
        """Listen to user's pronunciation and return transcribed text"""
        print("\n🎤 Listening... Please pronounce the word now.")
        
        try:
            with self.microphone as source:
                # Listen for audio with timeout
                audio = self.recognizer.listen(source, timeout=10, phrase_time_limit=5)
            
            print("Processing your pronunciation...")
            
            # Use Google Speech Recognition
            user_text = self.recognizer.recognize_google(audio)
            print(f"You said: {user_text}")
            return user_text.lower()
            
        except sr.WaitTimeoutError:
            print("No speech detected. Please try again.")
            return None
        except sr.UnknownValueError:
            print("Could not understand the audio. Please try again.")
            return None
        except sr.RequestError as e:
            print(f"Error with speech recognition service: {e}")
            return None
    
    def analyze_pronunciation(self, target_word, user_pronunciation):
        """Analyze if pronunciation is correct"""
        if not user_pronunciation:
            return False, "No speech detected"
        
        # Simple text matching (you can enhance this with phonetic analysis)
        target_lower = target_word.lower()
        user_lower = user_pronunciation.lower()
        
        # Exact match
        if target_lower == user_lower:
            return True, "Perfect pronunciation!"
        
        # Allow for minor variations
        if self.is_similar_pronunciation(target_lower, user_lower):
            return True, "Good pronunciation!"
        
        return False, f"Expected: {target_word}"
    
    def is_similar_pronunciation(self, target, user_input):
        """Check if pronunciation is similar using basic rules"""
        # Remove common suffixes/endings that might be mispronounced
        common_endings = ['ing', 'ed', 's', 'es']
        
        target_base = target
        user_base = user_input
        
        for ending in common_endings:
            if target.endswith(ending) and user_input.endswith(ending):
                target_base = target[:-len(ending)]
                user_base = user_input[:-len(ending)]
                break
        
        # Check if base words are similar
        if target_base == user_base:
            return True
        
        # Allow for common mispronunciations
        common_variations = {
            'hello': ['hallo', 'hellow'],
            'beautiful': ['beautyful', 'beutiful'],
            'technology': ['teknology', 'technolgy'],
            'computer': ['compyuter', 'computor']
        }
        
        if target in common_variations and user_input in common_variations[target]:
            return True
        
        return False
    
    def teach_word(self, word_data):
        """Teach a word to the user"""
        word = word_data["word"]
        phonetic = word_data["phonetic"]
        
        print(f"\n{'='*50}")
        print(f"WORD: {word}")
        print(f"Phonetic: {phonetic}")
        print(f"{'='*50}")
        
        # Pronounce the word for the user
        print("🔊 Listen to the correct pronunciation...")
        self.text_to_speech(word)
        time.sleep(1)
        
        # Ask user to pronounce
        max_attempts = 3
        for attempt in range(max_attempts):
            print(f"\nAttempt {attempt + 1}/{max_attempts}")
            user_pronunciation = self.listen_to_user()
            
            if user_pronunciation:
                is_correct, feedback = self.analyze_pronunciation(word, user_pronunciation)
                
                if is_correct:
                    print(f"✅ {feedback}")
                    self.text_to_speech("Excellent! Well done!")
                    return True
                else:
                    print(f"❌ {feedback}")
                    print("🔊 Let me pronounce it again for you...")
                    self.text_to_speech(f"The word is {word}. Please try again.")
            
            time.sleep(1)
        
        # If all attempts failed
        print(f"\n💡 Let's move to the next word. Remember: {word} is pronounced as {phonetic}")
        self.text_to_speech(f"Don't worry! Let's try the next word. Remember, {word} is pronounced as {word}")
        return False
    
    def run(self):
        """Main application loop"""
        print("🎯 Welcome to the AI Pronunciation Assistant!")
        print("I'll help you improve your English pronunciation.")
        print("Press Ctrl+C to exit at any time.\n")
        
        self.text_to_speech("Welcome to the Pronunciation Assistant! Let's begin.")
        
        try:
            for i, word_data in enumerate(self.words_database):
                self.current_word_index = i
                print(f"\n📖 Progress: {i+1}/{len(self.words_database)} words")
                
                success = self.teach_word(word_data)
                
                if i < len(self.words_database) - 1:
                    if success:
                        print("\n🎉 Great job! Moving to the next word...")
                        self.text_to_speech("Well done! Here's the next word.")
                    else:
                        print("\n➡️ Moving to the next word...")
                        self.text_to_speech("Let's try the next word.")
                    
                    time.sleep(2)
            
            # Completion message
            print("\n" + "="*50)
            print("🎊 Congratulations! You've completed all words!")
            print("="*50)
            self.text_to_speech("Congratulations! You have completed all the words. Great job!")
            
        except KeyboardInterrupt:
            print("\n\n👋 Thank you for using the Pronunciation Assistant!")
            self.text_to_speech("Goodbye! Keep practicing!")

if __name__ == "__main__":
    assistant = PronunciationAssistant()
    assistant.run()