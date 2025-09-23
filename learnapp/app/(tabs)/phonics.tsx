// app/(tabs)/phonics.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Speech from "expo-speech";

export default function PhonicsScreen() {
  const word = "ship";
  const phoneme = "sh";

  const speakPhoneme = () => {
    Speech.speak(phoneme, { rate: 0.7 });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mascot}>🐾</Text>
      <Text style={styles.title}>Focus on the sound</Text>
      <Text style={styles.word}>
        <Text style={styles.highlight}>{phoneme}</Text>
        {"ip"}
      </Text>
      <TouchableOpacity style={styles.button} onPress={speakPhoneme}>
        <Text style={styles.buttonText}>🔊 Hear "{phoneme}"</Text>
      </TouchableOpacity>
      <Text style={styles.encouragement}>
        Try saying the "{phoneme}" sound!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    padding: 24,
  },
  mascot: { fontSize: 50, marginBottom: 20 },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    color: "#8B4513",
  },
  word: {
    fontSize: 42,
    fontWeight: "700",
    color: "#A0522D",
    marginBottom: 20,
    letterSpacing: 3,
  },
  highlight: {
    backgroundColor: "#FFD54F",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: "#FFB300",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 36,
    marginBottom: 20,
  },
  buttonText: { fontSize: 22, color: "#fff", fontWeight: "700" },
  encouragement: {
    fontSize: 18,
    color: "#6D4C41",
    fontWeight: "600",
    textAlign: "center",
  },
});
