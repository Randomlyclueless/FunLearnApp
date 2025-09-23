import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

// --- Type Definitions ---
interface WordData {
  word: string;
  focus: string;
}

// --- Simulated AI Backend ---
const learningWords: WordData[] = [
  { word: "bag", focus: "b" },
  { word: "bed", focus: "b" },
  { word: "dog", focus: "d" },
  { word: "dusk", focus: "d" },
  { word: "pen", focus: "p" },
  { word: "queen", focus: "q" },
  { word: "cat", focus: "c" },
  { word: "goat", focus: "g" },
];

const getAIResponse = (userText: string, wordData: WordData) => {
  const { word, focus } = wordData;
  const userTextLower = userText.trim().toLowerCase();
  const wordLower = word.toLowerCase();

  if (userTextLower === wordLower) {
    return {
      status: "correct",
      message: "✅ Great job! You spelled it perfectly!",
    };
  }

  // --- Simulated intelligent analysis for common mistakes ---
  if (
    focus === "b" &&
    (userTextLower.startsWith("d") || userTextLower.includes("d"))
  ) {
    return {
      status: "incorrect",
      message:
        "❌ That's close! Remember, 'b' is a stick and a ball, not a 'd'. Try again!",
    };
  }
  if (
    focus === "d" &&
    (userTextLower.startsWith("b") || userTextLower.includes("b"))
  ) {
    return {
      status: "incorrect",
      message:
        "❌ Almost! 'D' has its round part first, then the stick. Try again!",
    };
  }
  if (
    focus === "p" &&
    (userTextLower.startsWith("q") || userTextLower.includes("q"))
  ) {
    return {
      status: "incorrect",
      message: "❌ That looks a bit like a 'q'. Remember, 'p' goes down first.",
    };
  }
  if (
    focus === "q" &&
    (userTextLower.startsWith("p") || userTextLower.includes("p"))
  ) {
    return {
      status: "incorrect",
      message: "❌ Be careful with 'q' and 'p'. 'Q' has its tail going down.",
    };
  }

  // --- General feedback for other errors ---
  return {
    status: "incorrect",
    message: "❌ Let's try that one again. You can do it!",
  };
};

export default function WritingScreen() {
  const [currentWordData, setCurrentWordData] = useState<WordData>(
    learningWords[0]
  );
  const [userText, setUserText] = useState("");
  const [feedback, setFeedback] = useState({ status: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const result = getAIResponse(userText, currentWordData);
    setFeedback(result);
    setSubmitted(true);

    // Move to next word on correct answer
    if (result.status === "correct") {
      const currentIndex = learningWords.findIndex(
        (w) => w.word === currentWordData.word
      );
      const nextIndex = (currentIndex + 1) % learningWords.length;
      setTimeout(() => {
        setCurrentWordData(learningWords[nextIndex]);
        setUserText("");
        setSubmitted(false);
      }, 1500);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mascot}>✏️</Text>
        <Text style={styles.title}>Word Writing</Text>
      </View>
      <View style={styles.promptArea}>
        <Text style={styles.prompt}>Practice spelling this word:</Text>
        <Text style={styles.word}>{currentWordData.word}</Text>
        <Text
          style={{
            fontSize: 20,
            color: "#838383",
            marginTop: 18,
            marginBottom: 10,
          }}
        >
          Try typing it below!
        </Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={userText}
          onChangeText={setUserText}
          placeholder="Type your answer..."
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.btnText}>Check My Answer</Text>
        </TouchableOpacity>
        {submitted && (
          <View style={styles.feedback}>
            <Text
              style={[
                styles.feedbackText,
                feedback.status === "correct"
                  ? styles.correct
                  : styles.incorrect,
              ]}
            >
              {feedback.message}
            </Text>
            <Text style={{ fontSize: 20 }}>
              {feedback.status === "correct" ? "🦉" : "🐘"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F8FF", padding: 24 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  mascot: { fontSize: 34, marginRight: 8 },
  title: { fontSize: 28, fontWeight: "700", color: "#394693" },
  promptArea: {
    backgroundColor: "#E3ECFB",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginTop: 18,
  },
  prompt: { fontSize: 19, color: "#403F5A", marginBottom: 7 },
  word: {
    fontSize: 29,
    fontWeight: "700",
    color: "#3B6EF7",
    letterSpacing: 2,
    marginBottom: 6,
  },
  input: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 14,
    fontSize: 21,
    padding: 12,
    borderWidth: 1,
    borderColor: "#AEE7F8",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#34D399",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 28,
    alignItems: "center",
    marginTop: 8,
  },
  btnText: { fontSize: 18, color: "#FFF", fontWeight: "700" },
  feedback: { marginTop: 24, alignItems: "center" },
  feedbackText: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 4,
  },
  correct: {
    color: "#34D399",
  },
  incorrect: {
    color: "#F05936",
  },
});
