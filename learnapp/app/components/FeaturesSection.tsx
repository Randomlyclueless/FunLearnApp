import React from "react";
import { View, Text } from "react-native";
import styles from "../(tabs)/styles";

interface FeaturesSectionProps {
  powers: {
    emoji: string;
    title: string;
    subtitle: string;
    description: string;
  }[];
}

export default function FeaturesSection({ powers }: FeaturesSectionProps) {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>What Makes Me Special? 🌈</Text>
        <Text style={styles.sectionSubtitle}>
          I have three super cool powers that help you become an amazing reader!
        </Text>
      </View>
      <View style={styles.powersGrid}>
        {powers.map((power, index) => (
          <View key={index} style={styles.powerCard}>
            <View style={styles.powerIconContainer}>
              <Text style={styles.powerIcon}>{power.emoji}</Text>
            </View>
            <Text style={styles.powerTitle}>{power.title}</Text>
            <Text style={styles.powerSubtitle}>{power.subtitle}</Text>
            <Text style={styles.powerDescription}>{power.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
