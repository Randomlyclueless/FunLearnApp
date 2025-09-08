// Get your actual IP address by running: ipconfig (Windows) or ifconfig (Mac/Linux)
// Replace 127.0.0.1 with your actual IP address for device testing
const BASE_URL = "http://127.0.0.1:8000"; // Change this to your actual IP when testing on device

import * as FileSystem from "expo-file-system";

export class ApiService {
  static async fetchPoemTheme(poemText) {
    try {
      const response = await fetch(`${BASE_URL}/analyze-poem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ poem: poemText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.top_label;
    } catch (error) {
      console.error("Failed to fetch poem theme:", error);
      return "Unknown";
    }
  }

  static async analyzePoemSentiment(poemText) {
    try {
      const response = await fetch(`${BASE_URL}/analyze-sentiment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ poem: poemText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.sentiment;
    } catch (error) {
      console.error("Failed to analyze sentiment:", error);
      return "Unknown";
    }
  }

  static async extractPoemTopics(poemText) {
    try {
      const response = await fetch(`${BASE_URL}/extract-topics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ poem: poemText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.topics;
    } catch (error) {
      console.error("Failed to extract topics:", error);
      return ["Unknown"];
    }
  }

  static async analyzeSpeech(audioData, targetText) {
    try {
      console.log("Starting speech analysis...");
      console.log("Audio URI:", audioData.uri);
      console.log("Target text:", targetText);

      // 1. Read audio file as base64
      const audioBase64 = await FileSystem.readAsStringAsync(audioData.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 2. Send JSON to backend
      const response = await fetch(`${BASE_URL}/analyze-speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          audio: audioBase64,
          target: targetText,
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error response:", errorText);
        throw new Error(
          `HTTP error! Status: ${response.status}, Body: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Speech analysis result:", result);

      // Validate response
      if (!result || typeof result !== "object") {
        throw new Error("Invalid response format from backend");
      }

      return {
        transcription: result.transcription || "Could not transcribe",
        accuracy: typeof result.accuracy === "number" ? result.accuracy : 0,
        ...result, // include backend response
      };
    } catch (error) {
      console.error("Failed to analyze speech:", error);
      throw new Error(`Speech analysis failed: ${error.message}`);
    }
  }

  static async testConnection() {
    try {
      const response = await fetch(`${BASE_URL}/health`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Backend connection test failed:", error);
      return false;
    }
  }
}
