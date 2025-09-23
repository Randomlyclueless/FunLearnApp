import { View, Text, StyleSheet } from "react-native";

export default function ReadingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📖 Welcome to the Reading Screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF8E7", // same background style as your home
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
});
