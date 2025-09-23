// app/(tabs)/dictionary.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DictionaryScreen() {
  const [word, setWord] = useState("");
  // Placeholder values
  const definition = "Meaning will appear here!";
  const example = "Example sentence here.";
  const history = ["cat", "dog", "apple", "jump"];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mascot}>📚</Text>
        <Text style={styles.title}>Dictionary</Text>
      </View>
      <TextInput
        style={styles.input}
        value={word}
        onChangeText={setWord}
        placeholder="Type a word…"
      />
      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.word}>{word || "Word"}</Text>
          <TouchableOpacity style={styles.speaker}>
            <Ionicons name="volume-high" size={30} color="#4285F4" />
          </TouchableOpacity>
        </View>
        <Text style={styles.def}>{definition}</Text>
        <Text style={styles.ex}>{example}</Text>
        <Text style={styles.emoji}>🦉</Text>
      </View>
      <Text style={styles.subhead}>Recent:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 8 }}
      >
        {history.map((w) => (
          <View key={w} style={styles.bubble}>
            <Text>{w}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F8FF", padding: 24 },
  header: { flexDirection: "row", alignItems: "center", gap: 8 },
  mascot: { fontSize: 36 },
  title: { fontSize: 32, fontWeight: "700", color: "#39386B" },
  input: {
    marginVertical: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    fontSize: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  card: {
    backgroundColor: "#E3ECFB",
    borderRadius: 20,
    padding: 24,
    marginVertical: 16,
    alignItems: "flex-start",
  },
  word: { fontSize: 28, fontWeight: "600", color: "#1F2937" },
  speaker: { marginLeft: 10 },
  def: { marginTop: 12, fontSize: 18, color: "#334155" },
  ex: { fontStyle: "italic", color: "#64748B", marginTop: 8 },
  emoji: { fontSize: 36, alignSelf: "center", marginTop: 14 },
  subhead: { fontWeight: "600", fontSize: 16, marginTop: 10 },
  bubble: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
});
