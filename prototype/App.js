// App.js
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Poem from "./poem"; // ✅ must match filename

export default function App() {
  return (
    <View style={styles.container}>
      <Poem /> <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
