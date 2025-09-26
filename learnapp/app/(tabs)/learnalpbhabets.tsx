import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

interface TracingError {
  perfect: string[];
  commonMistakes: string[];
  feedback: string;
}

const tracingErrors: Record<string, TracingError> = {
  A: {
    perfect: ["A"],
    commonMistakes: ["O", "U"],
    feedback:
      "That's close to a circle! An 'A' has a pointed top and a line in the middle.",
  },
  B: {
    perfect: ["B"],
    commonMistakes: ["D", "P"],
    feedback:
      "That looks like a 'd'! Remember, 'b' has a tall stick with its belly on the right side.",
  },
  C: {
    perfect: ["C"],
    commonMistakes: ["O", "G"],
    feedback: "That looks like a 'g'! A 'C' is a simple curve, not a loop.",
  },
  D: {
    perfect: ["D"],
    commonMistakes: ["B"],
    feedback:
      "That looks like a 'b'! Remember, 'd' has its belly on the left side.",
  },
};

const alphabet = "ABCD".split(""); // MVP: focus on A–D for Summit

// ------------------ DYNAMIC ANALYSIS ------------------ //
const analyzeTrace = (letter: string, path: { x: number; y: number }[]) => {
  if (!path || path.length < 5) {
    return { status: "incorrect", message: "Try tracing more of the letter." };
  }

  const xs = path.map((p) => p.x);
  const ys = path.map((p) => p.y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  const aspect = height / (width || 1);

  // Simple heuristics for each letter
  if (letter === "A") {
    if (aspect > 1.2) {
      return { status: "correct", message: "Nice! That looks like an A." };
    }
  }
  if (letter === "B") {
    if (height > width && width > height * 0.4) {
      return { status: "correct", message: "Great job! That's a B shape." };
    }
  }
  if (letter === "C") {
    if (width > height * 0.8 && height > width * 0.5) {
      return { status: "correct", message: "Well done! That's a C shape." };
    }
  }
  if (letter === "D") {
    if (height > width && width > height * 0.3) {
      return { status: "correct", message: "Awesome! That's a D shape." };
    }
  }

  // fallback → use confusion feedback
  if (tracingErrors[letter]) {
    return { status: "incorrect", message: tracingErrors[letter].feedback };
  }

  return {
    status: "incorrect",
    message: "Hmm, try to match the shape more closely.",
  };
};

export default function ReadingScreen() {
  const [currentLetter, setCurrentLetter] = useState("A");
  const [feedback, setFeedback] = useState("");
  const [paths, setPaths] = useState<Array<{ x: number; y: number }[]>>([]);
  const currentPath = useRef<Array<{ x: number; y: number }>>([]);

  const [fontsLoaded] = useFonts({
    OpenDyslexic: require("../../assets/fonts/OpenDyslexic3-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        currentPath.current = [
          { x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY },
        ];
        setPaths([...paths, currentPath.current]);
      },
      onPanResponderMove: (evt) => {
        currentPath.current.push({
          x: evt.nativeEvent.locationX,
          y: evt.nativeEvent.locationY,
        });
        setPaths([...paths.slice(0, -1), currentPath.current]);
      },
      onPanResponderRelease: () => {
        const result = analyzeTrace(currentLetter, currentPath.current);

        if (result.status === "correct") {
          setFeedback(result.message);
          setTimeout(() => {
            nextLetter();
          }, 1500);
        } else {
          setFeedback(result.message);
        }
      },
    })
  ).current;

  const nextLetter = () => {
    const currentIndex = alphabet.indexOf(currentLetter);
    const nextIndex = (currentIndex + 1) % alphabet.length;
    setCurrentLetter(alphabet[nextIndex]);
    setPaths([]);
    setFeedback("");
  };

  const clearDrawing = () => {
    setPaths([]);
    setFeedback("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trace the letter:</Text>

      <View style={styles.drawingArea} {...panResponder.panHandlers}>
        <Text style={styles.letter}>{currentLetter}</Text>
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
          {paths.map(
            (path, index) =>
              path.length > 0 && (
                <Path
                  key={index}
                  d={`M${path[0].x},${path[0].y} ${path
                    .slice(1)
                    .map((p) => `L${p.x},${p.y}`)
                    .join(" ")}`}
                  stroke="#4285F4"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )
          )}
        </Svg>
      </View>

      <Text style={styles.feedbackText}>{feedback}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearDrawing}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={nextLetter}>
          <Text style={styles.buttonText}>Next Letter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ------------------ STYLES ------------------ //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F0FE",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2B2B81",
    fontFamily: "OpenDyslexic",
  },
  drawingArea: {
    width: "90%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  letter: {
    fontSize: 250,
    fontWeight: "bold",
    color: "#D6E0F1",
    position: "absolute",
    fontFamily: "OpenDyslexic",
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#375B92",
    marginBottom: 20,
    minHeight: 40,
    textAlign: "center",
    fontFamily: "OpenDyslexic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
  },
  button: {
    backgroundColor: "#4285F4",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 36,
  },
  clearButton: {
    backgroundColor: "#E5E5E5",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 36,
  },
  buttonText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
    fontFamily: "OpenDyslexic",
  },
});
