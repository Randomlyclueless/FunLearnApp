import React from "react";
import { View, Text } from "react-native";
import styles from "../(tabs)/styles";

interface ActivitiesSectionProps {
  activities: { emoji: string; title: string; subtitle: string }[];
}

export default function ActivitiesSection({
  activities,
}: ActivitiesSectionProps) {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Amazing Things We Can Do! 🎪</Text>
      </View>
      <View style={styles.activitiesGrid}>
        {activities.map((activity, index) => (
          <View key={index} style={styles.activityCard}>
            <Text style={styles.activityIcon}>{activity.emoji}</Text>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
