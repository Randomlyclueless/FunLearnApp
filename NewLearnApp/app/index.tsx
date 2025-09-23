import {
  View,
  Text,
  StyleSheet,
  // Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFF8E7" barStyle="dark-content" />

      {/* Floating background elements */}
      <Animatable.View
        pointerEvents="none"
        style={[styles.floatingCircle, styles.circle1]}
        animation="pulse"
        iterationCount="infinite"
        duration={3000}
      />
      <Animatable.View
        pointerEvents="none"
        style={[styles.floatingCircle, styles.circle2]}
        animation="bounce"
        iterationCount="infinite"
        duration={4000}
      />
      <Animatable.View
        pointerEvents="none"
        style={[styles.floatingCircle, styles.circle3]}
        animation="rotate"
        iterationCount="infinite"
        duration={8000}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with mascot */}
        <Animatable.View
          style={styles.header}
          animation="fadeInDown"
          duration={1000}
        >
          <Animatable.Image
            source={require("../assets/mascot.png")}
            style={styles.mascot}
            resizeMode="contain"
            animation="bounceIn"
            duration={1500}
          />

          <View style={styles.welcomeSection}>
            <Animatable.Text
              style={styles.greeting}
              animation="fadeInRight"
              delay={500}
            >
              Hi there! 👋
            </Animatable.Text>
            <Animatable.Text
              style={styles.title}
              animation="wobble"
              delay={800}
              duration={2000}
            >
              Welcome to Leximate
            </Animatable.Text>
            <Animatable.Text
              style={styles.subtitle}
              animation="fadeInUp"
              delay={1000}
            >
              Your magical reading buddy! 🌟
            </Animatable.Text>
          </View>
        </Animatable.View>

        {/* Quick Stats Card */}
        <Animatable.View
          style={styles.statsCard}
          animation="fadeInUp"
          delay={1200}
        >
          <Text style={styles.statsTitle}>Progress 📈</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Words Read</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Stories Done</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Stars Earned</Text>
            </View>
          </View>
        </Animatable.View>

        {/* Main Action Buttons */}
        <View style={styles.buttonSection}>
          <Animatable.View animation="fadeInUp" delay={1600}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.push("/(tabs)/phonics")}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonEmoji}>🔤</Text>
                <View style={styles.buttonTextSection}>
                  <Text style={styles.buttonTitle}>Letter Sounds</Text>
                  <Text style={styles.buttonSubtitle}>
                    Practice phonics & pronunciation
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={1800}>
            <TouchableOpacity
              style={[styles.button, styles.tertiaryButton]}
              onPress={() => router.push("/(tabs)/writing")}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonEmoji}>✏️</Text>
                <View style={styles.buttonTextSection}>
                  <Text style={styles.buttonTitle}>Writing Practice</Text>
                  <Text style={styles.buttonSubtitle}>
                    Trace letters & words
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        </View>

        {/* Additional Tools Row */}
        <View style={styles.toolsSection}>
          <Animatable.View animation="fadeInLeft" delay={2000}>
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => router.push("/(tabs)/progress")}
              activeOpacity={0.8}
            >
              <Text style={styles.toolEmoji}>📊</Text>
              <Text style={styles.toolText}>Progress</Text>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={2200}>
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => router.push("/(tabs)/dictionary")}
              activeOpacity={0.8}
            >
              <Text style={styles.toolEmoji}>📚</Text>
              <Text style={styles.toolText}>Dictionary</Text>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="fadeInRight" delay={2400}>
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => router.push("/(tabs)/settings")}
              activeOpacity={0.8}
            >
              <Text style={styles.toolEmoji}>⚙️</Text>
              <Text style={styles.toolText}>Settings</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },
  scrollContent: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  floatingCircle: {
    position: "absolute",
    borderRadius: 50,
    opacity: 0.1,
  },
  circle1: {
    width: 80,
    height: 80,
    backgroundColor: "#FF6B6B",
    top: "8%",
    left: "10%",
  },
  circle2: {
    width: 60,
    height: 60,
    backgroundColor: "#4ECDC4",
    top: "45%",
    right: "5%",
  },
  circle3: {
    width: 70,
    height: 70,
    backgroundColor: "#45B7D1",
    bottom: "15%",
    left: "5%",
  },

  header: { alignItems: "center", marginBottom: 25 },
  mascot: {
    width: width * 0.6,
    height: width * 0.3,
    marginBottom: 15,
    ...(Platform.OS !== "web"
      ? {
          shadowColor: "#FFD93D",
          shadowOpacity: 0.3,
          shadowRadius: 15,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8,
        }
      : { boxShadow: "0px 8px 15px rgba(255, 217, 61, 0.3)" }),
  },
  welcomeSection: { alignItems: "center" },
  greeting: {
    fontSize: 18,
    fontFamily:
      Platform.OS === "web" ? "Comic Sans MS, cursive" : "ComicSansMS",
    color: "#4A5568",
    marginBottom: 5,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontFamily:
      Platform.OS === "web" ? "Comic Sans MS, cursive" : "ComicSansMS",
    fontWeight: "800",
    color: "#2D3748",
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 8,
    ...(Platform.OS !== "web"
      ? {
          textShadowColor: "rgba(255, 217, 61, 0.3)",
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 3,
        }
      : { textShadow: "1px 1px 3px rgba(255, 217, 61, 0.3)" }),
  },
  subtitle: {
    fontSize: 16,
    fontFamily:
      Platform.OS === "web" ? "Comic Sans MS, cursive" : "ComicSansMS",
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "600",
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: "#F0E68C",
    ...(Platform.OS !== "web"
      ? {
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 2 },
          elevation: 5,
        }
      : { boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)" }),
  },
  statsTitle: {
    fontSize: 18,
    fontFamily:
      Platform.OS === "web" ? "Comic Sans MS, cursive" : "ComicSansMS",
    fontWeight: "700",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 15,
  },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center" },
  statNumber: {
    fontSize: 24,
    fontFamily:
      Platform.OS === "web" ? "Comic Sans MS, cursive" : "ComicSansMS",
    fontWeight: "800",
    color: "#FF6B6B",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    fontFamily:
      Platform.OS === "web" ? "Comic Sans MS, cursive" : "ComicSansMS",
    color: "#4A5568",
    fontWeight: "600",
    textAlign: "center",
  },
  buttonSection: { marginBottom: 25 },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 8,
    borderWidth: 2,
    ...(Platform.OS !== "web"
      ? {
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        }
      : { boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)" }),
  },
  primaryButton: { backgroundColor: "#FF6B6B", borderColor: "#FF5252" },
  secondaryButton: { backgroundColor: "#4ECDC4", borderColor: "#26C6DA" },
  tertiaryButton: { backgroundColor: "#45B7D1", borderColor: "#2196F3" },
  buttonContent: { flexDirection: "row", alignItems: "center" },
  buttonEmoji: { fontSize: 32, marginRight: 15 },
  buttonTextSection: { flex: 1 },
  buttonTitle: {
    fontSize: 18,
    fontFamily:
      Platform.OS === "web" ? "Comic Sans MS, cursive" : "ComicSansMS",
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
    ...(Platform.OS !== "web"
      ? {
          textShadowColor: "rgba(0, 0, 0, 0.2)",
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
        }
      : { textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }),
  },
  buttonSubtitle: {
    fontSize: 13,
    fontFamily:
      Platform.OS === "web" ? "Comic Sans MS, cursive" : "ComicSansMS",
    color: "#FFFFFF",
    opacity: 0.9,
    fontWeight: "500",
  },
  toolsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  toolButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 12,
    alignItems: "center",
    minWidth: width * 0.25,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    ...(Platform.OS !== "web"
      ? {
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 4,
        }
      : { boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)" }),
  },
  toolEmoji: { fontSize: 24, marginBottom: 8 },
  toolText: {
    fontSize: 12,
    fontFamily:
      Platform.OS === "web" ? "Comic Sans MS, cursive" : "ComicSansMS",
    fontWeight: "600",
    color: "#4A5568",
    textAlign: "center",
  },
});
