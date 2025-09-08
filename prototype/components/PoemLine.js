import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import styles from "../poemStyles";

export const PoemLine = ({
  line,
  lineIndex,
  currentLine,
  isActive,
  animationValue,
  rhymeColor,
  isCompleted,
  onWordTap,
  loadingDefinition,
  currentWord,
  wordAnimValue,
}) => {
  const words = line.split(/\s+/).filter((w) => w.trim());

  return (
    <View key={lineIndex} style={styles.lineContainer}>
      <Animated.View
        style={[
          styles.lineWrapper,
          currentLine === lineIndex &&
            isActive && {
              backgroundColor: "rgba(255, 235, 59, 0.3)",
              transform: [{ scale: animationValue }],
            },
          rhymeColor && {
            borderLeftColor: rhymeColor,
            borderLeftWidth: 4,
            paddingLeft: 10,
          },
          isCompleted && {
            backgroundColor: "rgba(76, 175, 80, 0.1)",
          },
        ]}
      >
        <Text style={styles.lineNumber}> {lineIndex + 1} </Text>{" "}
        {isCompleted && <Text style={styles.completedIcon}> ✅ </Text>}{" "}
        <View style={styles.wordsContainer}>
          {" "}
          {words.map((word, wordIndex) => (
            <TouchableOpacity
              key={`${lineIndex}-${wordIndex}`}
              onPress={() => onWordTap(word, lineIndex, wordIndex)}
              style={styles.wordTouchable}
              disabled={loadingDefinition}
            >
              <Animated.Text
                style={[
                  styles.word,
                  currentLine === lineIndex &&
                    currentWord === wordIndex && {
                      color: "#FF4081",
                      fontWeight: "bold",
                      backgroundColor: "#FFEB3B",
                      transform: [{ scale: wordAnimValue }],
                    },
                ]}
              >
                {" "}
                {word}{" "}
              </Animated.Text>{" "}
            </TouchableOpacity>
          ))}{" "}
        </View>{" "}
      </Animated.View>{" "}
    </View>
  );
};
