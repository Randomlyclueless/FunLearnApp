import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { Audio } from "expo-av";
import ConfettiCannon from "react-native-confetti-cannon";

import { MODES } from "./constants/Modes";
import { WebTTSService } from "./services/WebTTSService";
import { DictionaryService } from "./services/DictionaryService";
import { PoemAnalyzer } from "./services/PoemAnalyzer";
import { ApiService } from "./services/ApiService";
import { PoemCard } from "./components/PoemCard";
import { PoemLine } from "./components/PoemLine";

import poemsData from "./poems.json";
import styles from "./poemStyles";

export default function Poems() {
  const [fontsLoaded] = useFonts({
    OpenDyslexic: require("./assets/fonts/OpenDyslexic3-Regular.ttf"),
  });

  const [selectedPoem, setSelectedPoem] = useState(poemsData[0]);
  const [currentMode, setCurrentMode] = useState(MODES.LISTEN);
  const [currentLine, setCurrentLine] = useState(-1);
  const [currentWord, setCurrentWord] = useState(-1);
  const [isActive, setIsActive] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(2500);
  const [showRhymes, setShowRhymes] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [userProgress, setUserProgress] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [recording, setRecording] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [poemsWithThemes, setPoemsWithThemes] = useState(poemsData);
  const [loadingTheme, setLoadingTheme] = useState(false);
  const [loadingDefinition, setLoadingDefinition] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [processingSpeech, setProcessingSpeech] = useState(false);

  const [animationValue] = useState(new Animated.Value(1));
  const [wordAnimValue] = useState(new Animated.Value(1));
  const [modeAnimValue] = useState(new Animated.Value(0));
  const confettiRef = useRef(null);

  const lines = selectedPoem.content.split("\n").filter((l) => l.trim());
  const rhymeGroups = PoemAnalyzer.highlightRhymes(lines);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Check backend connection on component mount
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const isConnected = await ApiService.testConnection();
        setBackendConnected(isConnected);

        if (!isConnected) {
          Alert.alert(
            "Backend Connection Failed",
            "Some features may not work properly. Please ensure the backend server is running.",
            [{ text: "OK" }]
          );
        }
      } catch (error) {
        console.error("Connection test failed:", error);
        setBackendConnected(false);
      }
    };

    checkBackendConnection();
  }, []);

  // Initialize and analyze poem
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await WebTTSService.initialize();
        const difficultyLevel = PoemAnalyzer.analyzeDifficulty(
          selectedPoem.content
        );
        setDifficulty(difficultyLevel);

        const questions =
          PoemAnalyzer.generateComprehensionQuestions(selectedPoem);
        setQuizQuestions(questions);

        // Analyze sentiment and topics if not already available and backend is connected
        if (backendConnected) {
          if (!selectedPoem.sentiment || selectedPoem.sentiment === "Unknown") {
            try {
              const sentiment = await ApiService.analyzePoemSentiment(
                selectedPoem.content
              );
              setSelectedPoem((prev) => ({ ...prev, sentiment }));
            } catch (error) {
              console.error("Failed to analyze sentiment:", error);
            }
          }

          if (
            !selectedPoem.topics ||
            selectedPoem.topics.length === 0 ||
            (selectedPoem.topics.length === 1 &&
              selectedPoem.topics[0] === "Unknown")
          ) {
            try {
              const topics = await ApiService.extractPoemTopics(
                selectedPoem.content
              );
              setSelectedPoem((prev) => ({ ...prev, topics }));
            } catch (error) {
              console.error("Failed to extract topics:", error);
            }
          }
        }
      } catch (error) {
        console.error("Initialization failed:", error);
      }
    };

    initializeApp();

    return () => {
      WebTTSService.stop();
    };
  }, [selectedPoem, backendConnected]);

  // Mode transition animation
  useEffect(() => {
    Animated.timing(modeAnimValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentMode]);

  // Main learning flow controller
  useEffect(() => {
    if (!isActive) return;

    if (currentMode === MODES.LISTEN) {
      handleListenMode();
    } else if (currentMode === MODES.REPEAT) {
      handleRepeatMode();
    } else if (currentMode === MODES.QUIZ) {
      handleQuizMode();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isActive, currentMode, currentLine, currentWord, currentQuestionIndex]);

  const handleListenMode = async () => {
    if (currentLine === -1) {
      await WebTTSService.speak(
        "Let me read this beautiful poem for you. Listen carefully!",
        { rate: 0.8 }
      );
      setCurrentLine(0);
      return;
    }

    if (currentLine < lines.length) {
      const line = lines[currentLine];

      Animated.spring(animationValue, {
        toValue: 1.2,
        friction: 2,
        useNativeDriver: true,
      }).start();

      await WebTTSService.speak(line, { rate: 0.6, pitch: 1.1 });

      timeoutRef.current = setTimeout(() => {
        setCurrentLine((prev) => {
          const nextLine = prev + 1;
          if (nextLine >= lines.length) {
            handleListenComplete();
            return -1;
          }
          return nextLine;
        });
      }, 1000);
    }
  };

  const handleListenComplete = async () => {
    setIsActive(false);
    await WebTTSService.speak(
      "Great! Now it's your turn to practice. Let's repeat it together, line by line!",
      { rate: 0.8 }
    );

    timeoutRef.current = setTimeout(() => {
      setCurrentMode(MODES.REPEAT);
      setCurrentLine(-1);
      setIsActive(true);
    }, 2000);
  };

  // SPEECH PRACTICE FUNCTIONALITY
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

    setProcessingSpeech(true);

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      // Check if backend is connected before attempting speech analysis
      if (!backendConnected) {
        Alert.alert(
          "Backend Not Connected",
          "Speech analysis requires the backend server to be running. Please start the server and try again.",
          [{ text: "OK" }]
        );
        setProcessingSpeech(false);
        return;
      }

      const result = await ApiService.analyzeSpeech(
        { uri, type: "audio/wav", name: "recording.wav" },
        lines[currentLine]
      );

      console.log("Backend response:", result);
      setFeedback(result);

      if (result.accuracy >= 80) {
        setUserProgress((prev) => [...prev, currentLine]);
        await WebTTSService.speak("Great job! Let's move to the next line.", {
          rate: 0.8,
        });

        // Move to next line only if pronunciation is correct
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
        // Re-speak the line for the user to try again
        await WebTTSService.speak(`Listen: ${lines[currentLine]}`, {
          rate: 0.6,
        });
      }
    } catch (err) {
      console.error("Failed to process recording:", err);
      Alert.alert(
        "Error",
        "Unable to process recording. Would you like to continue to the next line or try again?",
        [
          {
            text: "Continue",
            onPress: () => {
              setUserProgress((prev) => [...prev, currentLine]);
              setCurrentLine((prev) => {
                const nextLine = prev + 1;
                if (nextLine >= lines.length) {
                  handleRepeatComplete();
                  return -1;
                }
                return nextLine;
              });
            },
          },
          {
            text: "Try Again",
            onPress: () => {
              WebTTSService.speak(`Listen: ${lines[currentLine]}`, {
                rate: 0.6,
              });
            },
          },
        ]
      );
    } finally {
      setProcessingSpeech(false);
    }
  };

  const handleRepeatMode = async () => {
    if (currentLine === -1) {
      await WebTTSService.speak("I'll say a line, then you repeat it. Ready?", {
        rate: 0.8,
      });
      setCurrentLine(0);
      return;
    }

    if (currentLine < lines.length) {
      const line = lines[currentLine];
      await WebTTSService.speak(`Listen: ${line}`, { rate: 0.6 });
    }
  };

  const handleRepeatComplete = async () => {
    setIsActive(false);
    await WebTTSService.speak(
      "Wonderful job! You've completed the poem. Would you like to try the quiz?",
      { rate: 0.8 }
    );

    timeoutRef.current = setTimeout(() => {
      setCurrentMode(MODES.QUIZ);
      setShowQuiz(true);
      setCurrentQuestionIndex(0);
      setQuizScore(0);
    }, 2000);
  };

  const handleQuizMode = async () => {
    if (currentQuestionIndex === 0 && !showQuiz) {
      setShowQuiz(true);
      await WebTTSService.speak(
        "Quiz time! Answer the questions about the poem. Let's start!",
        { rate: 0.8 }
      );
    }
  };

  const handleAnswer = async (selectedOptionIndex) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === currentQuestion.correct;

    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      setShowConfetti(true);
      await WebTTSService.speak("Correct! Great job!", { rate: 0.8 });
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      await WebTTSService.speak(
        `Sorry, that's incorrect. The correct answer is ${
          currentQuestion.options[currentQuestion.correct]
        }.`,
        { rate: 0.8 }
      );
    }

    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      await WebTTSService.speak(
        `Quiz finished! You scored ${quizScore + (isCorrect ? 1 : 0)} out of ${
          quizQuestions.length
        }.`,
        { rate: 0.8 }
      );
      setIsActive(false);
      setShowQuiz(false);
      setCurrentMode(MODES.PRACTICE);
      setCurrentQuestionIndex(0);
    }
  };

  const startLearningSession = async (mode) => {
    setCurrentMode(mode);
    setCurrentLine(-1);
    setCurrentWord(-1);
    setUserProgress([]);
    setShowQuiz(mode === MODES.QUIZ);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setRecording(null);
    setFeedback(null);
    setShowConfetti(false);
    setIsActive(true);

    WebTTSService.stop();

    if (mode === MODES.LISTEN) {
      // Handled in useEffect
    } else if (mode === MODES.REPEAT) {
      // Handled in useEffect
    } else if (mode === MODES.PRACTICE) {
      await WebTTSService.speak(
        "Practice mode! Tap any word for help, or use the controls below.",
        { rate: 0.8 }
      );
    } else if (mode === MODES.QUIZ) {
      // Handled in useEffect
    }
  };

  const stopSession = () => {
    setIsActive(false);
    WebTTSService.stop();
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (recording) {
      recording.stopAndUnloadAsync();
      setRecording(null);
    }
    setCurrentLine(-1);
    setCurrentWord(-1);
    setShowQuiz(false);
    setCurrentQuestionIndex(0);
    setRecording(null);
    setFeedback(null);
    setShowConfetti(false);
    setProcessingSpeech(false);
  };

  const handleWordTap = async (word, lineIndex, wordIndex) => {
    const cleanWord = word.replace(/[.,!?;]$/, "").toLowerCase();
    const syllables = PoemAnalyzer.extractSyllables(cleanWord);

    setLoadingDefinition(true);

    try {
      const definition = await DictionaryService.getWordDefinition(cleanWord);

      if (currentMode === MODES.PRACTICE) {
        await WebTTSService.speak(cleanWord, { rate: 0.5 });

        Alert.alert(
          "Word Helper 🤖",
          `Word: "${cleanWord}"\nSyllables: ${syllables}\nDefinition: ${definition}`,
          [
            { text: "Got it!", style: "default" },
            {
              text: "🔊 Say it again",
              onPress: () => WebTTSService.speak(cleanWord),
            },
          ]
        );
      } else {
        Alert.alert(
          "Word Info 📚",
          `Word: "${cleanWord}"\nSyllables: ${syllables}\nDefinition: ${definition}\nLine: ${
            lineIndex + 1
          }`,
          [{ text: "OK", style: "default" }]
        );
      }
    } catch (error) {
      console.error("Error fetching word definition:", error);
      Alert.alert(
        "Word Info 📚",
        `Word: "${cleanWord}"\nSyllables: ${syllables}\nLine: ${lineIndex + 1}`,
        [{ text: "OK", style: "default" }]
      );
    } finally {
      setLoadingDefinition(false);
    }
  };

  const getRhymeColor = (lineIndex) => {
    if (!showRhymes) return null;
    const rhymeGroup = rhymeGroups.find((group) =>
      group.lines.includes(lineIndex)
    );
    return rhymeGroup ? rhymeGroup.color : null;
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case MODES.LISTEN:
        return "👂";
      case MODES.REPEAT:
        return "🗣️";
      case MODES.PRACTICE:
        return "🎯";
      case MODES.QUIZ:
        return "🧠";
      default:
        return "📚";
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case MODES.LISTEN:
        return "#2196F3";
      case MODES.REPEAT:
        return "#FF9800";
      case MODES.PRACTICE:
        return "#4CAF50";
      case MODES.QUIZ:
        return "#9C27B0";
      default:
        return "#666";
    }
  };

  const updatePoemTheme = async (poemId, poemText) => {
    setLoadingTheme(true);
    try {
      const theme = await ApiService.fetchPoemTheme(poemText);
      setPoemsWithThemes((prevPoems) =>
        prevPoems.map((poem) =>
          poem.id === poemId ? { ...poem, theme } : poem
        )
      );
    } catch (error) {
      console.error("Failed to fetch poem theme:", error);
      setPoemsWithThemes((prevPoems) =>
        prevPoems.map((poem) =>
          poem.id === poemId ? { ...poem, theme: "Unknown" } : poem
        )
      );
    } finally {
      setLoadingTheme(false);
    }
  };

  const speakLineAgain = async () => {
    if (currentLine >= 0 && currentLine < lines.length) {
      await WebTTSService.speak(`Listen: ${lines[currentLine]}`, { rate: 0.6 });
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text> Loading fonts... </Text>{" "}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#FFF9C4", "#FFCCBC", "#B3E5FC"]}
      style={styles.container}
    >
      {" "}
      {showConfetti && (
        <ConfettiCannon
          count={100}
          origin={{ x: -10, y: 0 }}
          autoStart={true}
          fadeOut={true}
          ref={confettiRef}
        />
      )}{" "}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {" "}
        {/* Header with difficulty and mode indicator */}{" "}
        <View style={styles.header}>
          <Text style={[styles.title, { fontFamily: "OpenDyslexic" }]}>
            {" "}
            {selectedPoem.emoji} {selectedPoem.title}{" "}
          </Text>{" "}
          <View style={styles.statusRow}>
            <View
              style={[
                styles.difficultyBadge,
                difficulty === "Easy"
                  ? styles.easyBadge
                  : difficulty === "Medium"
                  ? styles.mediumBadge
                  : styles.hardBadge,
              ]}
            >
              <Text style={styles.difficultyText}> {difficulty} </Text>{" "}
            </View>{" "}
            <Animated.View
              style={[
                styles.modeBadge,
                {
                  backgroundColor: getModeColor(currentMode),
                  opacity: modeAnimValue,
                },
              ]}
            >
              <Text style={styles.modeText}>
                {" "}
                {getModeIcon(currentMode)} {currentMode.toUpperCase()}{" "}
              </Text>{" "}
            </Animated.View>{" "}
            <View
              style={[
                styles.backendStatus,
                { backgroundColor: backendConnected ? "#4CAF50" : "#F44336" },
              ]}
            >
              <Text style={styles.backendStatusText}>
                {" "}
                {backendConnected
                  ? "🟢 Backend Connected"
                  : "🔴 Backend Offline"}{" "}
              </Text>{" "}
            </View>{" "}
          </View>{" "}
          {selectedPoem.sentiment && selectedPoem.sentiment !== "Unknown" && (
            <View style={styles.sentimentBadge}>
              <Text style={styles.sentimentText}>
                Sentiment: {selectedPoem.sentiment}{" "}
              </Text>{" "}
            </View>
          )}{" "}
          {selectedPoem.topics &&
            selectedPoem.topics.length > 0 &&
            !(
              selectedPoem.topics.length === 1 &&
              selectedPoem.topics[0] === "Unknown"
            ) && (
              <View style={styles.topicsContainer}>
                <Text style={styles.topicsText}>
                  Topics: {selectedPoem.topics.join(", ")}{" "}
                </Text>{" "}
              </View>
            )}{" "}
          <Text style={styles.ttsStatus}>
            {" "}
            {WebTTSService.isAvailable
              ? "🔊 Audio Ready"
              : "🔇 Silent Mode"}{" "}
          </Text>{" "}
        </View>{" "}
        {/* Learning Mode Buttons */}{" "}
        <View style={styles.modeContainer}>
          <Text style={styles.modeTitle}> Choose Learning Mode: </Text>{" "}
          <View style={styles.modeButtons}>
            {" "}
            {Object.values(MODES).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.modeButton,
                  { backgroundColor: getModeColor(mode) },
                  currentMode === mode && styles.activeModeButton,
                ]}
                onPress={() => startLearningSession(mode)}
                disabled={
                  isActive || (mode === MODES.REPEAT && !backendConnected)
                }
              >
                <Text style={styles.modeButtonText}>
                  {" "}
                  {getModeIcon(mode)}{" "}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}{" "}
                  {mode === MODES.REPEAT && !backendConnected && " (Offline)"}{" "}
                </Text>{" "}
              </TouchableOpacity>
            ))}{" "}
          </View>{" "}
        </View>{" "}
        {/* Progress indicator */}{" "}
        {userProgress.length > 0 && currentMode !== MODES.QUIZ && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Progress: {userProgress.length}/{lines.length} lines completed! 🎉{" "}
            </Text>{" "}
          </View>
        )}{" "}
        {/* Recording controls for REPEAT mode */}{" "}
        {currentMode === MODES.REPEAT && currentLine >= 0 && !showQuiz && (
          <View style={styles.recordingContainer}>
            <Text style={styles.recordingPrompt}> Repeat this line: </Text>{" "}
            <Text style={styles.recordingLine}> {lines[currentLine]} </Text>{" "}
            <TouchableOpacity
              style={styles.repeatButton}
              onPress={speakLineAgain}
              disabled={processingSpeech}
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
                disabled={!backendConnected || processingSpeech}
              >
                <Text style={styles.recordingButtonText}>
                  {" "}
                  {backendConnected
                    ? processingSpeech
                      ? "Processing..."
                      : "🎤 Start Recording"
                    : "Backend Offline"}{" "}
                </Text>{" "}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.recordingButton, styles.stopRecordingButton]}
                onPress={stopRecording}
                disabled={processingSpeech}
              >
                <Text style={styles.recordingButtonText}>
                  {" "}
                  {processingSpeech ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    "🛑 Stop Recording"
                  )}{" "}
                </Text>{" "}
              </TouchableOpacity>
            )}{" "}
            {feedback && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackText}>
                  Transcription: {feedback.transcription || "N/A"}{" "}
                </Text>{" "}
                <Text style={styles.feedbackText}>
                  Accuracy:{" "}
                  {feedback.accuracy ? `${feedback.accuracy}%` : "N/A"}{" "}
                </Text>{" "}
                {feedback.pronunciation_feedback && (
                  <Text style={styles.feedbackText}>
                    Pronunciation: {feedback.pronunciation_feedback}{" "}
                  </Text>
                )}{" "}
              </View>
            )}{" "}
          </View>
        )}{" "}
        {/* Quiz display */}{" "}
        {showQuiz && currentMode === MODES.QUIZ && (
          <View style={styles.quizContainer}>
            <Text style={styles.quizTitle}>
              Question {currentQuestionIndex + 1}
              of {quizQuestions.length}{" "}
            </Text>{" "}
            <Text style={styles.quizQuestion}>
              {" "}
              {quizQuestions[currentQuestionIndex].question}{" "}
            </Text>{" "}
            {quizQuestions[currentQuestionIndex].options.map(
              (option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quizOptionButton}
                  onPress={() => handleAnswer(index)}
                >
                  <Text style={styles.quizOptionText}> {option} </Text>{" "}
                </TouchableOpacity>
              )
            )}{" "}
            <Text style={styles.quizScore}>
              Score: {quizScore}/{quizQuestions.length}{" "}
            </Text>{" "}
          </View>
        )}{" "}
        {/* Controls */}{" "}
        {!showQuiz && currentMode !== MODES.REPEAT && (
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[styles.featureButton, showRhymes && styles.activeFeature]}
              onPress={() => setShowRhymes(!showRhymes)}
            >
              <Text style={styles.featureButtonText}>
                {" "}
                {showRhymes ? "🎨 Hide Rhymes" : "🎨 Show Rhymes"}{" "}
              </Text>{" "}
            </TouchableOpacity>{" "}
            {isActive && (
              <TouchableOpacity style={styles.stopButton} onPress={stopSession}>
                <Text style={styles.stopButtonText}> 🛑Stop Session </Text>{" "}
              </TouchableOpacity>
            )}{" "}
          </View>
        )}{" "}
        {/* Poem display */}{" "}
        {!showQuiz && (
          <View style={styles.poemContainer}>
            {" "}
            {lines.map((line, lineIndex) => {
              const rhymeColor = getRhymeColor(lineIndex);
              const isCompleted = userProgress.includes(lineIndex);

              return (
                <PoemLine
                  key={lineIndex}
                  line={line}
                  lineIndex={lineIndex}
                  currentLine={currentLine}
                  isActive={isActive}
                  animationValue={animationValue}
                  rhymeColor={rhymeColor}
                  isCompleted={isCompleted}
                  onWordTap={handleWordTap}
                  loadingDefinition={loadingDefinition}
                  currentWord={currentWord}
                  wordAnimValue={wordAnimValue}
                />
              );
            })}{" "}
          </View>
        )}{" "}
        {/* Poem selection */}{" "}
        <Text style={styles.chooseText}> 📚Choose a Poem: </Text>{" "}
        {poemsWithThemes.map((poem) => (
          <PoemCard
            key={poem.id}
            poem={poem}
            isSelected={selectedPoem.id === poem.id}
            loadingTheme={loadingTheme}
            onSelect={async () => {
              stopSession();
              setUserProgress([]);
              setSelectedPoem(poem);

              if (
                !poem.theme ||
                poem.theme === "Unknown" ||
                poem.theme === "Fetching theme..."
              ) {
                if (backendConnected) {
                  await updatePoemTheme(poem.id, poem.content);
                } else {
                  Alert.alert(
                    "Backend Not Connected",
                    "Theme analysis requires the backend server to be running.",
                    [{ text: "OK" }]
                  );
                }
              }
            }}
          />
        ))}{" "}
      </ScrollView>{" "}
      {loadingDefinition && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}> Analyzing word... </Text>{" "}
        </View>
      )}{" "}
    </LinearGradient>
  );
}
