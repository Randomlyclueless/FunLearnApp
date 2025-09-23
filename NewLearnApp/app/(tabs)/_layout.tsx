// (tabs)/layout.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Slot } from "expo-router";

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      {/* Renders the current active tab screen */}
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },
});
