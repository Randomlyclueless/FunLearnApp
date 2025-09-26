import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import * as Speech from "expo-speech";

// Import the data from your new JSON file
import numbersData from "../data/numbers.json";

const { width } = Dimensions.get("window");

// Define the type for a number item
interface NumberItem {
  id: number;
  number: string;
  spelling: string;
  image: string; // This is no longer used but kept for type safety with the JSON file
}

export default function NumbersScreen() {
  const router = useRouter();

  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [currentNumber, setCurrentNumber] = useState<NumberItem>(
    numbersData[0]
  );

  useEffect(() => {
    if (numbersData[currentNumberIndex]) {
      const newNumber = numbersData[currentNumberIndex];
      setCurrentNumber(newNumber);
      speakNumber(newNumber.spelling);
    }
  }, [currentNumberIndex]);

  const speakNumber = (numberSpelling: string) => {
    Speech.speak(numberSpelling, {
      language: "en-US",
      rate: 0.8,
    });
  };

  const handleNextNumber = () => {
    if (currentNumberIndex < numbersData.length - 1) {
      setCurrentNumberIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousNumber = () => {
    if (currentNumberIndex > 0) {
      setCurrentNumberIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNumberSelect = (index: number) => {
    setCurrentNumberIndex(index);
  };

  // This function generates the 3D blocks
  const renderBlocks = () => {
    const numberOfBlocks = currentNumber.id;
    return Array.from({ length: numberOfBlocks }).map((_, index) => (
      <View key={index} style={styles.blockWrapper}>
        <View style={styles.block} />
        <View style={styles.blockShadow} />
      </View>
    ));
  };

  // This function renders the top number selector
  const renderNumberSelector = () => {
    return (
      <View style={styles.selectorContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {numbersData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.numberButton,
                currentNumber.id === item.id && styles.activeNumberButton,
              ]}
              onPress={() => handleNumberSelect(item.id - 1)}
            >
              <Text
                style={[
                  styles.numberButtonText,
                  currentNumber.id === item.id && styles.activeNumberButtonText,
                ]}
              >
                {item.number}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learn Numbers</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Number Selector */}
      {renderNumberSelector()}

      <ScrollView style={styles.container}>
        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Number and Spelling Display */}
          <Animatable.View
            animation="bounceIn"
            duration={800}
            style={styles.numberContainer}
          >
            <Text style={styles.numberText}>{currentNumber.number}</Text>
            <Text style={styles.spellingText}>{currentNumber.spelling}</Text>
          </Animatable.View>

          {/* 3D Blocks Display */}
          <Animatable.View
            animation="fadeIn"
            duration={1000}
            style={styles.blocksContainer}
          >
            {renderBlocks()}
          </Animatable.View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.sayNumberButton]}
              onPress={() => speakNumber(currentNumber.spelling)}
            >
              <Text style={styles.buttonText}>🔊 Say Number</Text>
            </TouchableOpacity>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.navButton,
                currentNumberIndex === 0 && styles.disabledButton,
              ]}
              onPress={handlePreviousNumber}
              disabled={currentNumberIndex === 0}
            >
              <Text style={styles.buttonText}>⬅️ Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.navButton,
                currentNumberIndex === numbersData.length - 1 &&
                  styles.disabledButton,
              ]}
              onPress={handleNextNumber}
              disabled={currentNumberIndex === numbersData.length - 1}
            >
              <Text style={styles.buttonText}>Next ➡️</Text>
            </TouchableOpacity>
          </View>

          {/* Number Counter */}
          <Text style={styles.counterText}>
            Number {currentNumberIndex + 1} of {numbersData.length}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#F8FAFC",
  },
  backButton: {
    fontSize: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  selectorContainer: {
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  numberButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  activeNumberButton: {
    backgroundColor: "#6C63FF",
  },
  numberButtonText: {
    color: "#374151",
    fontWeight: "bold",
    fontSize: 18,
  },
  activeNumberButtonText: {
    color: "#FFFFFF",
  },
  mainContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20, // Added padding to separate from the selector
  },
  numberContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  numberText: {
    fontSize: 140,
    fontWeight: "bold",
    color: "#6C63FF",
  },
  spellingText: {
    fontSize: 52,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 5,
    letterSpacing: 2,
    textAlign: "center",
  },
  blocksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 30,
    padding: 15,
    backgroundColor: "#fff",
    minHeight: 280,
    width: width - 48,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  blockWrapper: {
    margin: 6,
  },
  block: {
    width: 45,
    height: 45,
    backgroundColor: "#818cf8",
    borderRadius: 5,
    zIndex: 1,
  },
  blockShadow: {
    width: 45,
    height: 45,
    backgroundColor: "#4338ca",
    borderRadius: 5,
    position: "absolute",
    top: 5,
    left: 5,
  },
  actionButtonsContainer: {
    width: "100%",
    marginBottom: 15,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sayNumberButton: {
    backgroundColor: "#10B981",
    width: "100%",
  },
  navButton: {
    backgroundColor: "#F59E0B",
    width: "48%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#D1D5DB",
  },
  counterText: {
    marginTop: 20,
    color: "#6B7280",
    fontSize: 16,
    marginBottom: 40,
  },
});
