// app/(tabs)/settings.tsx
import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";

export default function SettingsScreen() {
  const [sound, setSound] = useState(true);
  const [dark, setDark] = useState(false);

  return (
    <View style={[styles.container, dark && { backgroundColor: "#1F2937" }]}>
      <View style={styles.header}>
        <Text style={styles.gear}>⚙️</Text>
        <Text style={[styles.title, dark && { color: "#FFF" }]}>Settings</Text>
        <Text style={styles.mascot}>🦉</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, dark && { color: "#FFF" }]}>Sound</Text>
        <Switch value={sound} onValueChange={setSound} />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, dark && { color: "#FFF" }]}>Dark Mode</Text>
        <Switch value={dark} onValueChange={setDark} />
      </View>
      <TouchableOpacity style={styles.avatarEdit}>
        <Text style={styles.avatar}>👦</Text>
        <Text style={styles.edit}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 24 },
  header: { flexDirection: "row", alignItems: "center", gap: 8 },
  gear: { fontSize: 32 },
  mascot: { fontSize: 32 },
  title: { fontSize: 28, fontWeight: "700", color: "#2155CD", flex: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#ECECEC",
  },
  label: { fontSize: 20, color: "#29405F" },
  avatarEdit: { flexDirection: "row", alignItems: "center", marginTop: 36 },
  avatar: { fontSize: 36, marginRight: 12 },
  edit: { color: "#4285F4", fontWeight: "600", fontSize: 18 },
});
