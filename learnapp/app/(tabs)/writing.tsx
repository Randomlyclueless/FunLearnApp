// app/(tabs)/writing.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function WritingScreen() {
  const [userText, setUserText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    // Integrate AI feedback logic here later
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mascot}>✏️</Text>
        <Text style={styles.title}>Word Writing</Text>
      </View>
      <View style={styles.promptArea}>
        <Text style={styles.prompt}>Practice spelling this word:</Text>
        <Text style={styles.word}>elephant</Text>
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
            {userText.trim().toLowerCase() === "elephant" ? (
              <>
                <Text style={styles.correct}>✅ Great job!</Text>
                <Text style={{ fontSize: 20 }}>🦉</Text>
              </>
            ) : (
              <>
                <Text style={styles.incorrect}>
                  ❌ Try again! Focus on the “ph” part.{" "}
                </Text>
                <Text style={{ fontSize: 20 }}>🐘</Text>
              </>
            )}
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
  correct: {
    color: "#34D399",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 4,
  },
  incorrect: {
    color: "#F05936",
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 4,
  },
});
