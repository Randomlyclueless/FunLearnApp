import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../(tabs)/styles";

interface HeaderProps {
  audioEnabled: boolean;
  onPressAudio: () => void;
}

export default function Header({ audioEnabled, onPressAudio }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoIconText}>🧠</Text>
        </View>
        <Text style={styles.logoText}>Leximate</Text>
      </View>
      <TouchableOpacity onPress={onPressAudio} style={styles.audioButton}>
        {audioEnabled ? (
          <Text style={{ fontSize: 24 }}>🔊</Text>
        ) : (
          <Text style={{ fontSize: 24 }}>🔇</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
