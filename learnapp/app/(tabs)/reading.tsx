// app/(tabs)/reading.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Speech from "expo-speech";

export default function ReadingScreen() {
  const word = "butterfly";

  const speakWord = () => {
    Speech.speak(word, { rate: 0.8 });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mascot}>🦉</Text>
      <Text style={styles.title}>Read this word aloud</Text>
      <Text style={styles.word}>{word}</Text>
      <TouchableOpacity style={styles.button} onPress={speakWord}>
        <Text style={styles.buttonText}>🔊 Hear it</Text>
      </TouchableOpacity>
      <Text style={styles.encouragement}>
        You’re doing great! Keep trying! 🌟
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F0FE",
    padding: 24,
  },
  mascot: { fontSize: 48, marginBottom: 24 },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
    color: "#2B2B81",
  },
  word: {
    fontSize: 42,
    fontWeight: "700",
    color: "#1A1A59",
    marginBottom: 16,
    letterSpacing: 3,
  },
  button: {
    backgroundColor: "#4285F4",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 36,
    marginBottom: 20,
  },
  buttonText: { fontSize: 22, color: "#fff", fontWeight: "700" },
  encouragement: { fontSize: 18, fontWeight: "600", color: "#375B92" },
});
