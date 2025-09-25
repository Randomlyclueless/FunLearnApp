import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import styles from "../(tabs)/styles";

interface MainAppContentProps {
  mascotMood: string;
  getMascotEmoji: () => string;
  handleMascotClick: () => void;
  isLoading: boolean;
  isSpeaking: boolean;
  currentGreeting: string;
}

export default function MainAppContent({
  mascotMood,
  getMascotEmoji,
  handleMascotClick,
  isLoading,
  isSpeaking,
  currentGreeting,
}: MainAppContentProps) {
  return (
    <>
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>
          <Text style={{ color: "#6C63FF" }}>Hi Amazing</Text>
          {"\n"}
          <Text style={{ color: "#800080" }}>Reader!</Text>
          {"\n"}
          <Text style={{ color: "#394693" }}>Let's start your journey.</Text>
        </Text>
        <Text style={styles.heroSubtitle}>
          Welcome to your special place where reading becomes a super fun
          adventure! I'm your AI friend who makes letters dance and words sing!
          🎵✨
        </Text>
      </View>

      <View style={styles.mascotArea}>
        <TouchableOpacity
          style={styles.mascotButton}
          onPress={handleMascotClick}
          disabled={isLoading || isSpeaking}
        >
          <Text style={styles.mascotEmoji}>{getMascotEmoji()}</Text>
          {isLoading || isSpeaking ? (
            <View
              style={[
                styles.spinnerContainer,
                { ...StyleSheet.absoluteFillObject },
              ]}
            >
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : null}
        </TouchableOpacity>
        {currentGreeting && (
          <View style={styles.greetingBox}>
            <View style={styles.greetingIconContainer}>
              <Text style={{ fontSize: 24 }}>🎤</Text>
            </View>
            <Text style={styles.greetingText}>{currentGreeting}</Text>
          </View>
        )}
      </View>
    </>
  );
}
