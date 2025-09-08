import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { ApiService } from "../services/ApiService";

export default function SpeechPractice() {
  const [recording, setRecording] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const targetText = "The quick brown fox jumps over the lazy dog"; // example lesson text

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    setLoading(true);

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    try {
      const res = await ApiService.analyzeSpeech({ uri }, targetText);
      setResult(res);
    } catch (error) {
      console.error("Speech analysis failed:", error);
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Repeat this sentence: </Text>{" "}
      <Text style={styles.target}> {targetText} </Text>
      {!recording && !loading && (
        <Button title="Start Recording" onPress={startRecording} />
      )}{" "}
      {recording && <Button title="Stop Recording" onPress={stopRecording} />}
      {loading && <Text> Analyzing your speech... </Text>}
      {result && (
        <View style={styles.resultBox}>
          <Text> Transcription: {result.transcription} </Text>{" "}
          <Text> Accuracy: {result.accuracy} % </Text>{" "}
          <Button
            title="Continue"
            onPress={() => alert("Next lesson goes here 🚀")}
          />{" "}
        </View>
      )}{" "}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  target: {
    fontSize: 16,
    marginBottom: 20,
    fontStyle: "italic",
  },
  resultBox: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
});
