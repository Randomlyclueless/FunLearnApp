import { StyleSheet, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7", // Warm, cream background
  },

  scrollContent: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  // Floating background elements
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

  // Header Section
  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  mascot: {
    width: width * 0.6, // 60% of screen width to accommodate the wider image
    height: width * 0.3, // Maintain proper aspect ratio (2:1)
    marginBottom: 15,
    // Updated shadow syntax for web compatibility
    ...Platform.select({
      ios: {
        shadowColor: "#FFD93D",
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: "0px 8px 15px rgba(255, 217, 61, 0.3)",
      },
    }),
  },

  welcomeSection: {
    alignItems: "center",
  },

  greeting: {
    fontSize: 18,
    fontFamily: Platform.OS === "web" ? "OpenDyslexic, Comic Sans MS, Comic Sans, cursive" : "OpenDylsexic3-Bold",
    color: "#4A5568",
    marginBottom: 5,
    fontWeight: "600",
  },

  title: {
    fontSize: 28,
    fontFamily: Platform.OS === "web" ? "OpenDyslexic, Comic Sans MS, Comic Sans, cursive" : "OpenDylsexic3-Bold",
    fontWeight: "800",
    color: "#2D3748",
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 8,
    // Updated text shadow syntax for web compatibility
    ...Platform.select({
      ios: {
        textShadowColor: "rgba(255, 217, 61, 0.3)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
      },
      android: {
        textShadowColor: "rgba(255, 217, 61, 0.3)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
      },
      web: {
        textShadow: "1px 1px 3px rgba(255, 217, 61, 0.3)",
      },
    }),
  },

  subtitle: {
    fontSize: 16,
    fontFamily: Platform.OS === "web" ? "OpenDyslexic, Comic Sans MS, Comic Sans, cursive" : "OpenDylsexic3-Bold",
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "600",
  },

  // Stats Card
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: "#F0E68C",
    // Updated shadow syntax for web compatibility
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      },
    }),
  },

  statsTitle: {
    fontSize: 18,
    fontFamily: Platform.OS === "web" ? "OpenDyslexic, Comic Sans MS, Comic Sans, cursive" : "OpenDylsexic3-Bold",
    fontWeight: "700",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 15,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  statItem: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 24,
    fontFamily: Platform.OS === "web" ? "OpenDyslexic, Comic Sans MS, Comic Sans, cursive" : "OpenDylsexic3-Bold",
    fontWeight: "800",
    color: "#FF6B6B",
    marginBottom: 5,
  },

  statLabel: {
    fontSize: 12,
    fontFamily: Platform.OS === "web" ? "OpenDyslexic, Comic Sans MS, Comic Sans, cursive" : "OpenDylsexic3-Bold",
    color: "#4A5568",
    fontWeight: "600",
    textAlign: "center",
  },

  // Button Section
  buttonSection: {
    marginBottom: 25,
  },

  button: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 8,
    borderWidth: 2,
    // Updated shadow syntax for web compatibility
    ...Platform.select({
      ios: {
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
      },
    }),
  },

  primaryButton: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF5252",
    shadowColor: "#FF6B6B",
  },

  secondaryButton: {
    backgroundColor: "#4ECDC4",
    borderColor: "#26C6DA",
    shadowColor: "#4ECDC4",
  },

  tertiaryButton: {
    backgroundColor: "#45B7D1",
    borderColor: "#2196F3",
    shadowColor: "#45B7D1",
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  buttonEmoji: {
    fontSize: 32,
    marginRight: 15,
  },

  buttonTextSection: {
    flex: 1,
  },

  buttonTitle: {
    fontSize: 18,
    fontFamily: Platform.OS === "web" ? "OpenDyslexic, Comic Sans MS, Comic Sans, cursive" : "OpenDylsexic3-Bold",
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
    // Updated text shadow syntax for web compatibility
    ...Platform.select({
      ios: {
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      },
      android: {
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      },
      web: {
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
      },
    }),
  },

  buttonSubtitle: {
    fontSize: 13,
    fontFamily: Platform.OS === "web" ? "OpenDyslexic, Comic Sans MS, Comic Sans, cursive" : "OpenDylsexic3-Bold",
    color: "#FFFFFF",
    opacity: 0.9,
    fontWeight: "500",
  },

  // Tools Section
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
    // Updated shadow syntax for web compatibility
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
      },
    }),
  },

  toolEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },

  toolText: {
    fontSize: 12,
    fontFamily: Platform.OS === "web" ? "OpenDyslexic, Comic Sans MS, Comic Sans, cursive" : "OpenDylsexic3-Bold",
    fontWeight: "600",
    color: "#4A5568",
    textAlign: "center",
  },

  // Challenge Card
  challengeCard: {
    backgroundColor: "#F7FAFC",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#9F7AEA",
    // Updated shadow syntax for web compatibility
    ...Platform.select({
      ios: {
        shadowColor: "#9F7AEA",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 2px 10px rgba(159, 122, 234, 0.2)",
      },
    }),
  },

  challengeTitle: {
    fontSize: 18,
    fontFamily: Platform.OS === "web" ? "OpenDyslexic, Comic Sans MS, Comic Sans, cursive" : "OpenDylsexic3-Bold",
    fontWeight: "700",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 10,
  },

  challengeText: {
    fontSize: 14,
    fontFamily: Platform.OS === "web" ? "OpenDyslexic, Comic Sans MS, Comic Sans, cursive" : "OpenDylsexic3-Bold",
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 15,
    fontWeight: "500",
  },

  challengeButton: {
    backgroundColor: "#9F7AEA",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "center",
  },

  challengeButtonText: {
    fontSize: 14,
    fontFamily: Platform.OS === "web" ? "OpenDyslexic, Comic Sans MS, Comic Sans, cursive" : "OpenDylsexic3-Bold",
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
});