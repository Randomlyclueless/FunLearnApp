export class WebTTSService {
  static isAvailable =
    typeof window !== "undefined" && "speechSynthesis" in window;
  static synthesis = this.isAvailable ? window.speechSynthesis : null;
  static currentUtterance = null;
  static voices = [];

  static async initialize() {
    if (!this.isAvailable) return false;

    return new Promise((resolve) => {
      const loadVoices = () => {
        this.voices = this.synthesis.getVoices();
        resolve(true);
      };

      if (this.voices.length > 0) {
        resolve(true);
      } else {
        this.synthesis.addEventListener("voiceschanged", loadVoices);
        setTimeout(() => resolve(true), 1000);
      }
    });
  }

  static getChildFriendlyVoice() {
    if (!this.voices.length) return null;

    const femaleVoices = this.voices.filter(
      (voice) =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("woman") ||
        voice.name.toLowerCase().includes("samantha") ||
        voice.name.toLowerCase().includes("karen")
    );

    return femaleVoices[0] || this.voices[0];
  }

  static speak(text, options = {}) {
    if (!this.isAvailable || !this.synthesis) {
      console.log("Would speak:", text);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      try {
        this.synthesis.cancel();

        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.rate = options.rate || 0.7;
        this.currentUtterance.pitch = options.pitch || 1.2;
        this.currentUtterance.volume = options.volume || 0.9;

        const voice = this.getChildFriendlyVoice();
        if (voice) {
          this.currentUtterance.voice = voice;
        }

        this.currentUtterance.onend = () => resolve();
        this.currentUtterance.onerror = () => resolve();

        this.synthesis.speak(this.currentUtterance);
      } catch (error) {
        console.log("Speech synthesis failed:", error);
        resolve();
      }
    });
  }

  static stop() {
    if (!this.isAvailable || !this.synthesis) return Promise.resolve();

    try {
      this.synthesis.cancel();
      return Promise.resolve();
    } catch (error) {
      console.log("Speech synthesis stop failed:", error);
      return Promise.resolve();
    }
  }
}
