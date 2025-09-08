// RepeatMode.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import { WebTTSService } from "./services/WebTTSService";
import { ApiService } from "./services/ApiService";
import styles from "./poemStyles";

export const RepeatMode = ({
  lines,
  currentLine,
  setCurrentLine,
  userProgress,
  setUserProgress,
  isActive,
  setIsActive,
  backendConnected,
  setCurrentMode,
}) => {
  const [recording, setRecording] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isActive && currentLine === -1) {
      handleRepeatIntro();
    }
  }, [isActive, currentLine]);

  const handleRepeatIntro = async () => {
    await WebTTSService.speak("I'll say a line, then you repeat it. Ready?", {
      rate: 0.8,
    });
    setCurrentLine(0);
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Microphone access is required!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await rec.startAsync();

      setRecording(rec);
      setFeedback(null);
    } catch (err) {
      console.error("Failed to start recording:", err);
      Alert.alert("Error", "Failed to start recording. Please try again.");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setProcessing(true);

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (!uri) throw new Error("No recording URI available");

      // guess mime type from extension
      const extension = uri.split(".").pop() || "m4a";
      let mimeType = "audio/m4a";
      if (extension === "wav") mimeType = "audio/wav";
      if (extension === "caf") mimeType = "audio/x-caf";
      if (extension === "mp4") mimeType = "audio/mp4";

      if (!backendConnected) {
        Alert.alert(
          "Backend Not Connected",
          "Please start the backend server to analyze speech."
        );
        setProcessing(false);
        return;
      }

      const result = await ApiService.analyzeSpeech(
        { uri, type: mimeType, name: `recording.${extension}` },
        lines[currentLine]
      );

      setFeedback(result);

      if (result.accuracy >= 80) {
        setUserProgress((prev) => [...prev, currentLine]);
        await WebTTSService.speak("Great job! Let's move to the next line.", {
          rate: 0.8,
        });
        setCurrentLine((prev) => {
          const nextLine = prev + 1;
          if (nextLine >= lines.length) {
            handleRepeatComplete();
            return -1;
          }
          return nextLine;
        });
      } else {
        await WebTTSService.speak(
          `Let's try that again. Your accuracy was ${result.accuracy}%. Listen carefully and repeat.`,
          { rate: 0.8 }
        );
        await WebTTSService.speak(`Listen: ${lines[currentLine]}`, {
          rate: 0.6,
        });
      }
    } catch (err) {
      console.error("Error analyzing recording:", err);
      Alert.alert("Error", "Unable to process recording. Try again?");
    } finally {
      setProcessing(false);
    }
  };

  const handleRepeatComplete = async () => {
    setIsActive(false);
    await WebTTSService.speak(
      "Wonderful job! You've completed the poem. Would you like to try the quiz?",
      { rate: 0.8 }
    );
    setTimeout(() => setCurrentMode("quiz"), 2000);
  };

  const speakLine = async () => {
    if (currentLine >= 0 && currentLine < lines.length) {
      await WebTTSService.speak(`Listen: ${lines[currentLine]}`, { rate: 0.6 });
    }
  };

  if (currentLine < 0 || currentLine >= lines.length) return null;

  return (
    <View style={styles.recordingContainer}>
      <Text style={styles.recordingPrompt}> Repeat this line: </Text>{" "}
      <Text style={styles.recordingLine}> {lines[currentLine]} </Text>{" "}
      <TouchableOpacity
        style={styles.repeatButton}
        onPress={speakLine}
        disabled={processing}
      >
        <Text style={styles.repeatButtonText}> 🔊Hear Again </Text>{" "}
      </TouchableOpacity>{" "}
      {!recording ? (
        <TouchableOpacity
          style={[
            styles.recordingButton,
            !backendConnected && styles.disabledButton,
          ]}
          onPress={startRecording}
          disabled={!backendConnected || processing}
        >
          <Text style={styles.recordingButtonText}>
            {" "}
            {backendConnected
              ? processing
                ? "Processing..."
                : "🎤 Start Recording"
              : "Backend Offline"}{" "}
          </Text>{" "}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.recordingButton, styles.stopRecordingButton]}
          onPress={stopRecording}
          disabled={processing}
        >
          <Text style={styles.recordingButtonText}>
            {" "}
            {processing ? <ActivityIndicator color="white" /> : "🛑 Stop"}{" "}
          </Text>{" "}
        </TouchableOpacity>
      )}{" "}
      {feedback && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>
            Transcription: {feedback.transcription || "N/A"}{" "}
          </Text>{" "}
          <Text style={styles.feedbackText}>
            Accuracy: {feedback.accuracy ? `${feedback.accuracy}%` : "N/A"}{" "}
          </Text>{" "}
          {feedback.pronunciation_feedback && (
            <Text style={styles.feedbackText}>
              Pronunciation: {feedback.pronunciation_feedback}{" "}
            </Text>
          )}{" "}
        </View>
      )}{" "}
      {userProgress.length > 0 && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Progress: {userProgress.length}/{lines.length} lines completed 🎉{" "}
          </Text>{" "}
        </View>
      )}{" "}
    </View>
  );
};
