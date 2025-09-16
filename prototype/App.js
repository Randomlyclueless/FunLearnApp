// App.js
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
// import Poem from "./poem";   // ❌ not needed now
import Words from "./words"; // ✅ only Words page is active

// 👇 currently using Words page
const DEFAULT_PAGE = "words";

export default function App() {
  return (
    <View style={styles.container}>
      {" "}
      {/* ✅ show only Words page */}{" "}
      {DEFAULT_PAGE === "poem" ? null : <Words />} <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
