// app/(tabs)/progress.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProgressScreen() {
  const wordsLearned = 17; // Example number
  const challengesCompleted = 5;
  const readingStreak = 9; // Days
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mascot}>🦉</Text>
        <Text style={styles.title}>Your Progress</Text>
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.bigNum}>{wordsLearned}</Text>
        <Text style={styles.label}>Words Learned</Text>
        <View style={styles.barBg}>
          <View
            style={[
              styles.barFill,
              { width: `${Math.min(wordsLearned, 20) * 5}%` },
            ]}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{challengesCompleted}</Text>
          <Text style={styles.statLabel}>Challenges</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{readingStreak}</Text>
          <Text style={styles.statLabel}>Reading Streak</Text>
        </View>
      </View>
      <View style={styles.promptArea}>
        <Text style={styles.prompt}>
          Keep going! You're on a {readingStreak}-day streak. 🎉
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 26 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  mascot: { fontSize: 40, marginRight: 10 },
  title: { fontSize: 28, fontWeight: "700", color: "#2155CD" },
  summaryCard: {
    backgroundColor: "#E3ECFB",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,
  },
  bigNum: { fontSize: 36, fontWeight: "800", color: "#3460B5" },
  label: { fontSize: 19, color: "#29405F", marginTop: 8, marginBottom: 10 },
  barBg: {
    width: "100%",
    height: 15,
    backgroundColor: "#CFE2FD",
    borderRadius: 10,
    overflow: "hidden",
  },
  barFill: { height: 15, backgroundColor: "#34D399" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
    gap: 20,
  },
  statBox: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    width: 120,
    elevation: 1,
  },
  statNum: { fontSize: 28, color: "#38BDF8", fontWeight: "700" },
  statLabel: { fontSize: 15, color: "#64748B", marginTop: 6 },
  promptArea: {
    marginTop: 36,
    backgroundColor: "#E0F7FA",
    borderRadius: 12,
    padding: 16,
  },
  prompt: {
    fontSize: 18,
    textAlign: "center",
    color: "#338C89",
    fontWeight: "600",
  },
});
