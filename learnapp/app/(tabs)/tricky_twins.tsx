import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useFonts } from "expo-font";

const { width } = Dimensions.get("window");

export default function TrickyTwinsScreen() {
  const router = useRouter();
  const [currentLetter, setCurrentLetter] = useState("b");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const bounceAnim = new Animated.Value(1);

  const [fontsLoaded] = useFonts({
    OpenDyslexic: require("../../assets/fonts/OpenDyslexic3-Bold.ttf"),
  });

  const trickyPairs = [
    {
      letter: "b",
      mirror: "d",
      word: "ball",
      image: "⚽",
      hint: "Make a 'b' by drawing a line down, then a belly on the RIGHT side",
      memoryTip: "b has a BIG belly on the right!",
    },
    {
      letter: "d",
      mirror: "b",
      word: "dog",
      image: "🐶",
      hint: "Make a 'd' by drawing a circle first, then a line down on the RIGHT side",
      memoryTip: "d starts with a DOUGHNUT shape!",
    },
    {
      letter: "p",
      mirror: "q",
      word: "pig",
      image: "🐷",
      hint: "Make a 'p' by drawing a line down, then a circle on the RIGHT side",
      memoryTip: "p POPS to the right side!",
    },
    {
      letter: "q",
      mirror: "p",
      word: "queen",
      image: "👑",
      hint: "Make a 'q' by drawing a circle first, then a line down with a tail",
      memoryTip: "q has a QUEEN's tail on the right!",
    },
    {
      letter: "m",
      mirror: "w",
      word: "monkey",
      image: "🐵",
      hint: "Make a 'm' by drawing mountains that go DOWN from the middle",
      memoryTip: "m has MOUNTAINS that point down!",
    },
    {
      letter: "w",
      mirror: "m",
      word: "whale",
      image: "🐋",
      hint: "Make a 'w' by drawing waves that go UP from the middle",
      memoryTip: "w has WAVES that point up!",
    },
  ];

  const speakLetter = (letter: string) => {
    Speech.speak(letter, {
      language: "en-US",
      rate: 0.8,
    });
  };

  const speakWord = (word: string) => {
    Speech.speak(word, {
      language: "en-US",
      rate: 0.7,
    });
  };

  const playBounceAnimation = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getTeachingTip = (correctLetter: string, wrongLetter: string) => {
    const tips: { [key: string]: string } = {
      "b-d":
        "Remember: 'b' has its belly on the RIGHT, 'd' has its doughnut on the LEFT!",
      "d-b":
        "Think: 'd' starts with a circle like a doughnut, 'b' starts with a line!",
      "p-q": "Hint: 'p' pops to the right, 'q' has a queen's tail!",
      "q-p": "Look: 'q' has a little tail, 'p' is plain on the right!",
      "m-w": "Watch: 'm' has mountains going down, 'w' has waves going up!",
      "w-m": "See: 'w' looks like waves in the water, 'm' like mountains!",
    };
    return (
      tips[`${correctLetter}-${wrongLetter}`] || "Look carefully at the shape!"
    );
  };

  const checkAnswer = (userSelection: string) => {
    playBounceAnimation();
    setSelectedLetter(userSelection);

    const correct = userSelection === currentLetter;
    setIsCorrect(correct);
    setAttempts(attempts + 1);

    if (correct) {
      setScore(score + 1);
      Speech.speak(
        `Excellent! ${currentPair.word} does start with ${currentLetter}! ${currentPair.memoryTip}`,
        {
          rate: 0.7,
        }
      );
    } else {
      const teachingTip = getTeachingTip(currentLetter, userSelection);
      Speech.speak(
        `Let's try again! ${currentPair.word} starts with ${currentLetter}, not ${userSelection}. ${teachingTip}`,
        {
          rate: 0.6, // Slower for teaching moments
        }
      );
    }

    setShowAnswer(true);
  };

  const nextLetter = () => {
    const randomIndex = Math.floor(Math.random() * trickyPairs.length);
    setCurrentLetter(trickyPairs[randomIndex].letter);
    setShowAnswer(false);
    setIsCorrect(null);
    setSelectedLetter(null);
  };

  const showHint = () => {
    Speech.speak(`Here's a hint: ${currentPair.hint}`, {
      rate: 0.6,
    });
  };

  const currentPair =
    trickyPairs.find((pair) => pair.letter === currentLetter) || trickyPairs[0];

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonIcon}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tricky Twins 🎯</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Score Board */}
        <View style={styles.scoreContainer}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Correct</Text>
            <Text style={styles.scoreValue}>
              {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
            </Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Tries</Text>
            <Text style={styles.scoreValue}>{attempts}</Text>
          </View>
        </View>

        {/* Current Letter Display */}
        <View style={styles.letterSection}>
          <Text style={styles.instructionText}>
            Which letter does this word start with?
          </Text>

          <Animated.View
            style={[styles.wordCard, { transform: [{ scale: bounceAnim }] }]}
          >
            <Text style={styles.wordImage}>{currentPair.image}</Text>
            <Text style={styles.wordText}>{currentPair.word}</Text>
            <TouchableOpacity
              onPress={() => speakWord(currentPair.word)}
              style={styles.audioButton}
            >
              <Text style={styles.audioIcon}>🔊 Say Word</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Teaching Feedback */}
        {showAnswer && (
          <View
            style={[
              styles.feedbackContainer,
              isCorrect ? styles.correctFeedback : styles.incorrectFeedback,
            ]}
          >
            <Text style={styles.feedbackIcon}>{isCorrect ? "🎉" : "💡"}</Text>
            <Text style={styles.feedbackText}>
              {isCorrect ? "Excellent!" : "Learning Time!"}
            </Text>
            <Text style={styles.feedbackDetail}>
              {currentPair.word} starts with '{currentLetter}'
            </Text>

            {!isCorrect && selectedLetter && (
              <View style={styles.teachingTip}>
                <Text style={styles.teachingTitle}>Remember:</Text>
                <Text style={styles.teachingText}>
                  {getTeachingTip(currentLetter, selectedLetter)}
                </Text>
                <Text style={styles.memoryTip}>💡 {currentPair.memoryTip}</Text>
              </View>
            )}

            {isCorrect && (
              <Text style={styles.congratulations}>
                {currentPair.memoryTip}
              </Text>
            )}
          </View>
        )}

        {/* Letter Choices */}
        <View style={styles.choicesContainer}>
          <Text style={styles.choicesTitle}>Choose the correct letter:</Text>

          <View style={styles.choicesRow}>
            <TouchableOpacity
              style={[
                styles.letterChoice,
                showAnswer &&
                  currentLetter === currentPair.letter &&
                  styles.correctChoice,
                showAnswer &&
                  selectedLetter === currentPair.letter &&
                  !isCorrect &&
                  styles.incorrectChoice,
              ]}
              onPress={() => checkAnswer(currentPair.letter)}
              disabled={showAnswer}
            >
              <Text style={styles.letterChoiceText}>{currentPair.letter}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.letterChoice,
                showAnswer &&
                  currentPair.mirror === currentPair.letter &&
                  styles.correctChoice,
                showAnswer &&
                  selectedLetter === currentPair.mirror &&
                  !isCorrect &&
                  styles.incorrectChoice,
              ]}
              onPress={() => checkAnswer(currentPair.mirror)}
              disabled={showAnswer}
            >
              <Text style={styles.letterChoiceText}>{currentPair.mirror}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.hintButton} onPress={showHint}>
            <Text style={styles.hintButtonText}>💡 Get Hint</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={nextLetter}
            disabled={!showAnswer}
          >
            <Text style={styles.nextButtonText}>
              {showAnswer ? "Next Word ➡️" : "Make a Choice First"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Help Section - Always Visible */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>Letter Help Guide:</Text>

          <View style={styles.tipCard}>
            <View style={styles.letterPair}>
              <Text style={styles.letterExample}>b d</Text>
              <Text style={styles.tipText}>"b" = line + belly on RIGHT</Text>
              <Text style={styles.tipText}>"d" = circle + line on RIGHT</Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.letterPair}>
              <Text style={styles.letterExample}>p q</Text>
              <Text style={styles.tipText}>"p" = line + circle on RIGHT</Text>
              <Text style={styles.tipText}>"q" = circle + tail on RIGHT</Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.letterPair}>
              <Text style={styles.letterExample}>m w</Text>
              <Text style={styles.tipText}>"m" = mountains go DOWN</Text>
              <Text style={styles.tipText}>"w" = waves go UP</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#6C63FF",
  },
  backButton: {
    padding: 8,
  },
  backButtonIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    fontFamily: "OpenDyslexic",
    textAlign: "center",
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreItem: {
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#666",
    fontFamily: "OpenDyslexic",
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6C63FF",
    fontFamily: "OpenDyslexic",
  },
  letterSection: {
    alignItems: "center",
    marginBottom: 25,
    width: "100%",
  },
  instructionText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "OpenDyslexic",
    color: "#1F2937",
  },
  wordCard: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 3,
    borderColor: "#E5E7EB",
    minWidth: 200,
  },
  wordImage: {
    fontSize: 60,
    marginBottom: 10,
  },
  wordText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6C63FF",
    fontFamily: "OpenDyslexic",
    marginBottom: 15,
    textTransform: "capitalize",
  },
  audioButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: "#E5E7EB",
  },
  audioIcon: {
    fontSize: 14,
    fontFamily: "OpenDyslexic",
    fontWeight: "bold",
  },
  feedbackContainer: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  correctFeedback: {
    backgroundColor: "#E8F5E8",
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },
  incorrectFeedback: {
    backgroundColor: "#FFF9C4", // Yellow for learning moments
    borderLeftWidth: 5,
    borderLeftColor: "#FFA000",
  },
  feedbackIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "OpenDyslexic",
    marginBottom: 5,
    textAlign: "center",
  },
  feedbackDetail: {
    fontSize: 18,
    fontFamily: "OpenDyslexic",
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  teachingTip: {
    backgroundColor: "rgba(255,255,255,0.7)",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
  },
  teachingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6C63FF",
    fontFamily: "OpenDyslexic",
    marginBottom: 5,
  },
  teachingText: {
    fontSize: 14,
    fontFamily: "OpenDyslexic",
    color: "#666",
    lineHeight: 20,
    marginBottom: 10,
  },
  memoryTip: {
    fontSize: 14,
    fontFamily: "OpenDyslexic",
    color: "#E67E22",
    fontStyle: "italic",
    fontWeight: "bold",
  },
  congratulations: {
    fontSize: 16,
    fontFamily: "OpenDyslexic",
    color: "#4CAF50",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
  choicesContainer: {
    width: "100%",
    marginBottom: 20,
  },
  choicesTitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "OpenDyslexic",
    color: "#1F2937",
  },
  choicesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  letterChoice: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  correctChoice: {
    backgroundColor: "#4CAF50",
  },
  incorrectChoice: {
    backgroundColor: "#FF6B6B",
  },
  letterChoiceText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    fontFamily: "OpenDyslexic",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 25,
    gap: 15,
  },
  hintButton: {
    flex: 1,
    backgroundColor: "#FFA726",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  nextButton: {
    flex: 2,
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  hintButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "OpenDyslexic",
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "OpenDyslexic",
  },
  helpContainer: {
    width: "100%",
    marginBottom: 25,
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "OpenDyslexic",
    color: "#1F2937",
  },
  tipCard: {
    backgroundColor: "#E8F4FD",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#4ECDC4",
  },
  letterPair: {
    alignItems: "center",
  },
  letterExample: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6C63FF",
    fontFamily: "OpenDyslexic",
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    fontFamily: "OpenDyslexic",
    color: "#666",
    lineHeight: 20,
    textAlign: "center",
  },
});
