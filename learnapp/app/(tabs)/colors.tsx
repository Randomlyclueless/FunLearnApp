import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Animated,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useFonts } from "expo-font";
import colorsData from "../data/colors.json";

const { width } = Dimensions.get("window");

interface Color {
  name: string;
  colorCode: string;
  description: string;
  funFact: string;
}

export default function ColorsScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bounceAnim] = useState(new Animated.Value(1));
  const [showFunFact, setShowFunFact] = useState(false);

  const [fontsLoaded] = useFonts({
    OpenDyslexic: require("../../assets/fonts/OpenDyslexic3-Bold.ttf"),
  });

  // Auto-speak when color changes
  useEffect(() => {
    if (!fontsLoaded) return;

    Speech.stop();

    const timer = setTimeout(() => {
      Speech.speak(
        `This is the color ${currentColor.name}. ${currentColor.description}`,
        {
          language: "en-US",
          rate: 0.7,
          pitch: 1.1,
        }
      );
    }, 300);

    return () => {
      clearTimeout(timer);
      Speech.stop();
    };
  }, [currentIndex, fontsLoaded]);

  const bounceAnimation = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNextColor = () => {
    bounceAnimation();
    setShowFunFact(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % colorsData.length);
  };

  const handlePreviousColor = () => {
    bounceAnimation();
    setShowFunFact(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? colorsData.length - 1 : prevIndex - 1
    );
  };

  const speakColorName = () => {
    Speech.speak(currentColor.name, {
      language: "en-US",
      rate: 0.7,
      pitch: 1.1,
    });
  };

  const speakDescription = () => {
    Speech.speak(currentColor.description, {
      language: "en-US",
      rate: 0.7,
      pitch: 1.1,
    });
  };

  const speakFunFact = () => {
    Speech.speak(currentColor.funFact, {
      language: "en-US",
      rate: 0.7,
      pitch: 1.1,
    });
  };

  const toggleFunFact = () => {
    setShowFunFact(!showFunFact);
  };

  if (!fontsLoaded) {
    return null;
  }

  const currentColor = colorsData[currentIndex] as Color;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>🏠 Home</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Color Explorer</Text>
          <Text style={styles.subtitle}>Discover Amazing Colors! 🌈</Text>
        </View>

        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {currentIndex + 1}/{colorsData.length}
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={[styles.colorCard, { transform: [{ scale: bounceAnim }] }]}
        >
          {/* Color Display - Simplified without hex code */}
          <View
            style={[
              styles.colorDisplay,
              { backgroundColor: currentColor.colorCode },
            ]}
          >
            <Text style={styles.colorNameDisplay}>
              THIS IS {currentColor.name.toUpperCase()}
            </Text>
          </View>

          {/* Color Name */}
          <TouchableOpacity
            onPress={speakColorName}
            style={styles.nameContainer}
          >
            <Text style={styles.colorName}>
              {currentColor.name.toUpperCase()} 🎨
            </Text>
            <Text style={styles.speakHint}>Tap to hear color name</Text>
          </TouchableOpacity>

          {/* Color Description */}
          <TouchableOpacity
            onPress={speakDescription}
            style={styles.descriptionContainer}
          >
            <Text style={styles.colorDescription}>
              {currentColor.description}
            </Text>
          </TouchableOpacity>

          {/* Fun Fact Section */}
          <TouchableOpacity
            onPress={toggleFunFact}
            style={styles.funFactToggle}
          >
            <Text style={styles.funFactToggleText}>
              {showFunFact ? "🙈 Hide Fun Fact" : "🤔 Show Fun Fact!"}
            </Text>
          </TouchableOpacity>

          {showFunFact && (
            <TouchableOpacity
              onPress={speakFunFact}
              style={styles.funFactContainer}
            >
              <Text style={styles.funFactTitle}>Did You Know? 🌟</Text>
              <Text style={styles.funFactText}>{currentColor.funFact}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>

      {/* Navigation Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={handlePreviousColor}
          style={[styles.navButton, styles.prevButton]}
        >
          <Text style={styles.navButtonText}>⬅️ Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNextColor}
          style={[styles.navButton, styles.nextButton]}
        >
          <Text style={styles.navButtonText}>Next ➡️</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4FF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 10,
    backgroundColor: "#5E7CE2",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "OpenDyslexic",
    fontWeight: "bold",
    textAlign: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    fontFamily: "OpenDyslexic",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontFamily: "OpenDyslexic",
    textAlign: "center",
    marginTop: 2,
  },
  counter: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 60,
  },
  counterText: {
    color: "white",
    fontSize: 14,
    fontFamily: "OpenDyslexic",
    fontWeight: "bold",
    textAlign: "center",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  colorCard: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 25,
    width: "100%",
    shadowColor: "#5E7CE2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    alignItems: "center",
    borderColor: "#A4B6FF",
    borderWidth: 3,
  },
  colorDisplay: {
    width: width - 100,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.8)",
  },
  colorNameDisplay: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    fontFamily: "OpenDyslexic",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    textAlign: "center",
  },
  nameContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  colorName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#5E7CE2",
    fontFamily: "OpenDyslexic",
    textAlign: "center",
    textTransform: "capitalize",
  },
  speakHint: {
    fontSize: 12,
    color: "#888",
    fontFamily: "OpenDyslexic",
    marginTop: 4,
    fontStyle: "italic",
  },
  descriptionContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  colorDescription: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    fontFamily: "OpenDyslexic",
    lineHeight: 24,
  },
  funFactToggle: {
    backgroundColor: "#6BCF7F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 15,
  },
  funFactToggleText: {
    color: "white",
    fontSize: 16,
    fontFamily: "OpenDyslexic",
    fontWeight: "bold",
  },
  funFactContainer: {
    backgroundColor: "#FFF9C4",
    padding: 20,
    borderRadius: 20,
    borderLeftWidth: 6,
    borderLeftColor: "#FFD93D",
    width: "100%",
  },
  funFactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E67E22",
    fontFamily: "OpenDyslexic",
    marginBottom: 8,
  },
  funFactText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "OpenDyslexic",
    lineHeight: 20,
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    gap: 15,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  prevButton: {
    backgroundColor: "#FFB74D",
  },
  nextButton: {
    backgroundColor: "#5E7CE2",
  },
  navButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "OpenDyslexic",
  },
});
