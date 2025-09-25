import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

export default function StreakWelcome() {
  const [currentDay, setCurrentDay] = useState("");

  // Example streak data
  const daysOfWeek = [
    { day: "S", isCompleted: true, emoji: "🌟" },
    { day: "M", isCompleted: true, emoji: "⭐" },
    { day: "T", isCompleted: true, emoji: "✨" },
    { day: "W", isCompleted: false, emoji: "🎯" },
    { day: "T", isCompleted: false, emoji: "🚀" },
    { day: "F", isCompleted: false, emoji: "🎉" },
    { day: "S", isCompleted: false, emoji: "🏆" },
  ];

  useEffect(() => {
    const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
    const today = new Date().getDay();
    setCurrentDay(dayNames[today]);
  }, []);

  const completedCount = daysOfWeek.filter((day) => day.isCompleted).length;

  const getMotivationalMessage = () => {
    if (completedCount === 0) return "Ready to start your adventure? 🌈";
    if (completedCount <= 2) return "You're doing great! Keep going! 🎈";
    if (completedCount <= 4) return "Wow! You're on fire! 🔥";
    if (completedCount <= 6) return "Amazing streak! You're a star! ⭐";
    return "Perfect week! You're incredible! 🏆";
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="bounceIn" duration={1200} style={styles.card}>
        {/* Floating decorative elements */}
        <Animatable.Text
          animation="swing"
          iterationCount="infinite"
          duration={2000}
          style={styles.floatingEmoji1}
        >
          🌈
        </Animatable.Text>
        <Animatable.Text
          animation="swing"
          iterationCount="infinite"
          duration={2500}
          delay={500}
          style={styles.floatingEmoji2}
        >
          ⚡
        </Animatable.Text>

        {/* Header with fire */}
        <View style={styles.header}>
          <Text style={styles.fireEmoji}>🔥</Text>
          <Text style={styles.title}>
            {completedCount > 0
              ? `${completedCount}-Day Streak!`
              : "Start Your Streak!"}
          </Text>
          <Text style={styles.fireEmoji}>🔥</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animatable.View
              animation="slideInLeft"
              duration={1500}
              style={[
                styles.progressFill,
                { width: `${(completedCount / 7) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Days Row with cartoon bubbles */}
        <View style={styles.daysContainer}>
          {daysOfWeek.map((item, index) => (
            <Animatable.View
              key={index}
              animation={item.isCompleted ? "bounceIn" : "fadeIn"}
              duration={800}
              delay={index * 150}
              style={styles.dayWrapper}
            >
              <View
                style={[
                  styles.dayBubble,
                  item.day === currentDay && styles.currentDayBubble,
                  item.isCompleted && styles.completedDayBubble,
                ]}
              >
                {item.isCompleted && (
                  <Animatable.Text
                    animation="pulse"
                    iterationCount="infinite"
                    duration={1500}
                    style={styles.completedEmoji}
                  >
                    {item.emoji}
                  </Animatable.Text>
                )}
                {!item.isCompleted && item.day === currentDay && (
                  <Animatable.View
                    animation="pulse"
                    iterationCount="infinite"
                    duration={1000}
                  >
                    <Text style={styles.currentDayText}>{item.day}</Text>
                    <Text style={styles.todayLabel}>TODAY!</Text>
                  </Animatable.View>
                )}
                {!item.isCompleted && item.day !== currentDay && (
                  <View>
                    <Text style={styles.dayText}>{item.day}</Text>
                    <Text style={styles.miniEmoji}>{item.emoji}</Text>
                  </View>
                )}
              </View>

              {/* Completion celebration */}
              {item.isCompleted && (
                <Animatable.Text
                  animation="bounceIn"
                  duration={1000}
                  delay={index * 200}
                  style={styles.celebrationText}
                >
                  Done! 🎉
                </Animatable.Text>
              )}
            </Animatable.View>
          ))}
        </View>

        {/* Motivational message with cartoon speech bubble */}
        <Animatable.View
          animation="fadeInUp"
          delay={1000}
          duration={800}
          style={styles.speechBubble}
        >
          <Text style={styles.motivationText}>{getMotivationalMessage()}</Text>
          <View style={styles.speechTail} />
        </Animatable.View>

        {/* Mascot character */}
        <Animatable.Text
          animation="bounce"
          iterationCount="infinite"
          duration={3000}
          style={styles.mascot}
        >
          🦄
        </Animatable.Text>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#E0E7FF",
    position: "relative",
    overflow: "visible",
  },
  floatingEmoji1: {
    position: "absolute",
    top: -10,
    right: 20,
    fontSize: 20,
    zIndex: 1,
  },
  floatingEmoji2: {
    position: "absolute",
    top: -5,
    left: 15,
    fontSize: 18,
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  fireEmoji: {
    fontSize: 24,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#4338CA",
    textShadowColor: "#E0E7FF",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 20,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  dayWrapper: {
    alignItems: "center",
  },
  dayBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8FAFC",
    borderWidth: 3,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  currentDayBubble: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
    borderWidth: 4,
    transform: [{ scale: 1.2 }],
    shadowColor: "#F59E0B",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  completedDayBubble: {
    backgroundColor: "#D1FAE5",
    borderColor: "#10B981",
    borderWidth: 4,
    shadowColor: "#10B981",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  dayText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "center",
  },
  miniEmoji: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
  },
  currentDayText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#D97706",
    textAlign: "center",
  },
  todayLabel: {
    fontSize: 8,
    fontWeight: "800",
    color: "#F59E0B",
    textAlign: "center",
    marginTop: 1,
  },
  completedEmoji: {
    fontSize: 20,
  },
  celebrationText: {
    fontSize: 8,
    fontWeight: "600",
    color: "#10B981",
    textAlign: "center",
    marginTop: 2,
  },
  speechBubble: {
    backgroundColor: "#F0F9FF",
    borderRadius: 20,
    padding: 12,
    borderWidth: 2,
    borderColor: "#0EA5E9",
    position: "relative",
    marginBottom: 16,
  },
  speechTail: {
    position: "absolute",
    bottom: -8,
    left: "50%",
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#0EA5E9",
  },
  motivationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0C4A6E",
    textAlign: "center",
  },
  mascot: {
    fontSize: 32,
    marginTop: 8,
  },
});
