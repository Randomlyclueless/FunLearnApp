// app/(tabs)/challenge.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

export default function ChallengeScreen() {
  const [progress, setProgress] = useState(1);
  const TOTAL = 3;
  const history = [
    { task: "Say 3 new words", done: true },
    { task: "Trace letters", done: true },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Challenge</Text>
        <Text style={styles.emoji}>🎉</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.task}>Read 3 new words aloud!</Text>
        <View style={styles.barContainer}>
          <View
            style={[styles.bar, { width: `${(progress / TOTAL) * 100}%` }]}
          />
        </View>
        <Text style={styles.progText}>
          {progress}/{TOTAL} words read
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setProgress(Math.min(progress + 1, TOTAL))}
        >
          <Text style={styles.btnText}>
            {progress < TOTAL ? "Start Challenge" : "Completed!"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.mascot}>{progress < TOTAL ? "🦉" : "💃"}</Text>
      </View>
      <Text style={styles.subhead}>History</Text>
      <FlatList
        data={history}
        keyExtractor={(i) => i.task}
        renderItem={({ item }) => (
          <View style={styles.histItem}>
            <Text style={{ fontSize: 17 }}>
              {item.done ? "✅" : "⬜️"} {item.task}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#DBEAFE", flex: 1, padding: 22 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  title: { fontSize: 30, fontWeight: "700", color: "#334155", flex: 1 },
  emoji: { fontSize: 32 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 24,
    elevation: 2,
    marginBottom: 24,
  },
  task: { fontSize: 22, fontWeight: "600", color: "#295FA6", marginBottom: 14 },
  barContainer: {
    height: 18,
    backgroundColor: "#CFE2FD",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  bar: { height: 18, backgroundColor: "#4285F4", borderRadius: 10 },
  progText: { fontSize: 17, marginBottom: 18, color: "#29405F" },
  button: {
    backgroundColor: "#34D399",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnText: { fontSize: 18, color: "#FFF", fontWeight: "700" },
  mascot: { fontSize: 36, alignSelf: "center", marginTop: 12 },
  subhead: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "#38598B",
  },
  histItem: { marginBottom: 8 },
});
