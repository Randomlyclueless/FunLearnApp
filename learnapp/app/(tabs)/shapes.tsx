import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  Animated,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useFonts } from "expo-font";
import shapesData from "../data/shapes.json";

const { width, height } = Dimensions.get("window");

interface Shape {
  name: string;
  type: string;
  image: string;
  description: string;
  sides: number;
  angles: number;
  funFact: string;
}

const imageMap: { [key: string]: any } = {
  "triangle.png": require("../../assets/shapes/triangle.png"),
  "square.png": require("../../assets/shapes/square.png"),
  "circle.png": require("../../assets/shapes/circle.png"),
  "star.png": require("../../assets/shapes/star.png"),
  "heart.png": require("../../assets/shapes/heart.png"),
  "oval.png": require("../../assets/shapes/oval.png"),
  "rectangle.png": require("../../assets/shapes/rectangle.png"),
};

export default function ShapesScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bounceAnim] = useState(new Animated.Value(1));
  const [showFunFact, setShowFunFact] = useState(false);

  const [fontsLoaded] = useFonts({
    OpenDyslexic: require("../../assets/fonts/OpenDyslexic3-Bold.ttf"),
  });

  // Auto-speak when shape changes - FIXED useEffect
  useEffect(() => {
    if (!fontsLoaded) return;

    // Stop any previous speech first
    Speech.stop();

    // Use setTimeout to ensure speech starts after component renders
    const timer = setTimeout(() => {
      Speech.speak(
        `This is a ${currentShape.name}. ${currentShape.description}`,
        {
          language: "en-US",
          rate: 0.7,
          pitch: 1.1,
        }
      );
    }, 300);

    // Cleanup function - return void, not a Promise
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

  const handleNextShape = () => {
    bounceAnimation();
    setShowFunFact(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % shapesData.length);
  };

  const handlePreviousShape = () => {
    bounceAnimation();
    setShowFunFact(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? shapesData.length - 1 : prevIndex - 1
    );
  };

  const speakShapeName = () => {
    Speech.speak(currentShape.name, {
      language: "en-US",
      rate: 0.7,
      pitch: 1.1,
    });
  };

  const speakDescription = () => {
    Speech.speak(currentShape.description, {
      language: "en-US",
      rate: 0.7,
      pitch: 1.1,
    });
  };

  const speakFunFact = () => {
    Speech.speak(currentShape.funFact, {
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

  const currentShape = shapesData[currentIndex] as Shape;

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
          <Text style={styles.headerTitle}>Shape Explorer</Text>
          <Text style={styles.subtitle}>Discover Amazing Shapes! 🔍</Text>
        </View>

        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {currentIndex + 1}/{shapesData.length}
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={[styles.shapeCard, { transform: [{ scale: bounceAnim }] }]}
        >
          {/* Shape Image */}
          <View style={styles.imageContainer}>
            <Image
              source={imageMap[currentShape.image]}
              style={styles.shapeImage}
              resizeMode="contain"
            />
          </View>

          {/* Shape Name */}
          <TouchableOpacity
            onPress={speakShapeName}
            style={styles.nameContainer}
          >
            <Text style={styles.shapeName}>
              {currentShape.name.toUpperCase()} ✨
            </Text>
            <Text style={styles.speakHint}>Tap to hear name</Text>
          </TouchableOpacity>

          {/* Shape Description */}
          <TouchableOpacity
            onPress={speakDescription}
            style={styles.descriptionContainer}
          >
            <Text style={styles.shapeDescription}>
              {currentShape.description}
            </Text>
          </TouchableOpacity>

          {/* Shape Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailNumber}>{currentShape.sides}</Text>
              <Text style={styles.detailLabel}>SIDES</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailNumber}>{currentShape.angles}</Text>
              <Text style={styles.detailLabel}>ANGLES</Text>
            </View>
          </View>

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
              <Text style={styles.funFactText}>{currentShape.funFact}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>

      {/* Navigation Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={handlePreviousShape}
          style={[styles.navButton, styles.prevButton]}
        >
          <Text style={styles.navButtonText}>⬅️ Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNextShape}
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
  shapeCard: {
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
  imageContainer: {
    width: width - 100,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#F8FAFF",
    borderRadius: 20,
    padding: 10,
  },
  shapeImage: {
    width: "100%",
    height: "100%",
  },
  nameContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  shapeName: {
    fontSize: 32,
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
  shapeDescription: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    fontFamily: "OpenDyslexic",
    lineHeight: 24,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 30,
  },
  detailItem: {
    alignItems: "center",
    backgroundColor: "#FF9E7D",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 90,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  detailNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    fontFamily: "OpenDyslexic",
  },
  detailLabel: {
    fontSize: 14,
    color: "white",
    fontFamily: "OpenDyslexic",
    fontWeight: "bold",
    marginTop: 2,
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
