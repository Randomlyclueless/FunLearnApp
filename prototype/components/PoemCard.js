import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { PoemAnalyzer } from "../services/PoemAnalyzer";
import styles from "../poemStyles";

export const PoemCard = ({ poem, isSelected, onSelect, loadingTheme }) => {
  const poemDifficulty = PoemAnalyzer.analyzeDifficulty(poem.content);

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={onSelect}
    >
      <Text style={styles.cardTitle}>
        {" "}
        {poem.emoji} {poem.title}{" "}
      </Text>{" "}
      <Text style={styles.cardTheme}>
        {" "}
        {poem.theme ||
          (loadingTheme ? "Analyzing theme..." : "Fetching theme...")}{" "}
      </Text>{" "}
      <View
        style={[
          styles.miniDifficultyBadge,
          poemDifficulty === "Easy"
            ? styles.easyBadge
            : poemDifficulty === "Medium"
            ? styles.mediumBadge
            : styles.hardBadge,
        ]}
      >
        <Text style={styles.miniDifficultyText}> {poemDifficulty} </Text>{" "}
      </View>{" "}
    </TouchableOpacity>
  );
};
