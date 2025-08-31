import React, { useEffect, useRef, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";

const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = ({ onSelectFeature }) => {
  const journey = [
    {
      key: "learnABC",
      title: "Learn ABC",
      emoji: "🔤",
      color: "#FF6B6B",
      position: { x: 0.2, y: 0.1 },
      description: "Start your alphabet adventure!",
    },
    {
      key: "colorsPatterns",
      title: "Colors & Patterns",
      emoji: "🎨",
      color: "#FFE066",
      position: { x: 0.75, y: 0.25 },
      description: "Discover beautiful colors",
    },
    {
      key: "audioPractice",
      title: "Audio Practice",
      emoji: "🔊",
      color: "#51CF66",
      position: { x: 0.15, y: 0.45 },
      description: "Listen and learn sounds",
    },
    {
      key: "wordGames",
      title: "Word Games",
      emoji: "🎮",
      color: "#339AF0",
      position: { x: 0.8, y: 0.65 },
      description: "Play fun word puzzles",
    },
    {
      key: "progress",
      title: "Progress",
      emoji: "⭐",
      color: "#FF922B",
      position: { x: 0.4, y: 0.85 },
      description: "See how far you've come!",
    },
  ];

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = journey.map(() => useRef(new Animated.Value(0)).current);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation for the whole screen
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Staggered scale animation for stops
    Animated.stagger(
      200,
      scaleAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        })
      )
    ).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 0.6, // 60% progress
      duration: 1500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, []);

  const handlePressIn = (index) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Animated.spring(scaleAnims[index], {
      toValue: 1.1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index) => {
    Animated.spring(scaleAnims[index], {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const renderPathSegment = (fromStop, toStop, index) => {
    if (!toStop) return null;

    const containerWidth = screenWidth - 80;
    const containerHeight = 500;

    const fromX = fromStop.position.x * containerWidth + 40;
    const fromY = fromStop.position.y * containerHeight + 40;
    const toX = toStop.position.x * containerWidth + 40;
    const toY = toStop.position.y * containerHeight + 40;

    const distance = Math.sqrt(
      Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2)
    );
    const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);

    const segments = Math.floor(distance / 20);
    const pathElements = [];

    for (let i = 0; i < segments; i++) {
      const segmentX = fromX + (toX - fromX) * (i / segments);
      const segmentY = fromY + (toY - fromY) * (i / segments);

      pathElements.push(
        <Animated.View
          key={`path-${index}-${i}`}
          style={[
            styles.pathSegment,
            {
              left: segmentX - 4,
              top: segmentY - 2,
              backgroundColor: i % 2 === 0 ? "#74C0FC" : "#FF8CC8",
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.8 - i * 0.01],
              }),
            },
          ]}
        />
      );
    }

    return pathElements;
  };

  const renderStop = (stop, index) => {
    const containerWidth = screenWidth - 80;
    const containerHeight = 500;
    const x = stop.position.x * containerWidth;
    const y = stop.position.y * containerHeight;

    const isCompleted = false; // Add completion logic here
    const isUnlocked = true; // Add unlock logic here

    return (
      <Animated.View
        key={stop.key}
        style={[
          styles.stopContainer,
          {
            left: x,
            top: y,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnims[index] }],
          },
        ]}
        accessible={true}
        accessibilityLabel={`${stop.title}. ${stop.description}. ${
          isCompleted ? "Completed" : "Not completed"
        }`}
      >
        <View
          style={[styles.glowEffect, { backgroundColor: stop.color + "30" }]}
        />

        {index > 0 && (
          <View style={styles.pathConnector}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Animated.View
                key={`connector-${index}-${i}`}
                style={[
                  styles.connectorDot,
                  {
                    backgroundColor: stop.color,
                    opacity: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.6 - i * 0.1],
                    }),
                    left: -30 - i * 8,
                    top: 35,
                  },
                ]}
              />
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.stopButton,
            {
              backgroundColor: stop.color,
              opacity: isUnlocked ? 1 : 0.6,
            },
          ]}
          onPress={() => {
            onSelectFeature(stop.key);
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
            }
          }}
          onPressIn={() => handlePressIn(index)}
          onPressOut={() => handlePressOut(index)}
          disabled={!isUnlocked}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityHint={`Navigate to ${stop.title}`}
        >
          <View
            style={[styles.innerRing, { borderColor: stop.color + "60" }]}
          />
          <Text style={styles.stopEmoji}>{stop.emoji}</Text>
          {isCompleted && (
            <View style={styles.completionBadge}>
              <Text style={styles.completionCheck}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={[styles.stopNumber, { backgroundColor: stop.color }]}>
          <Text style={styles.stopNumberText}>{index + 1}</Text>
        </View>

        <View style={[styles.stopInfo, { borderTopColor: stop.color }]}>
          <Text style={[styles.stopTitle, { color: stop.color }]}>
            {stop.title}
          </Text>
          <Text style={styles.stopDescription}>{stop.description}</Text>

          <View style={styles.progressDots}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Animated.View
                key={`progress-${index}-${i}`}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: i < 3 ? stop.color : "#E0E0E0",
                    opacity: fadeAnim,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {index === 0 && (
          <View style={styles.startFlag}>
            <Text style={styles.flagEmoji}>🚩</Text>
          </View>
        )}

        {index === journey.length - 1 && (
          <View style={styles.finishFlag}>
            <Text style={styles.flagEmoji}>🏁</Text>
          </View>
        )}

        <Animated.View
          style={[styles.sparkle, styles.sparkle1, { opacity: fadeAnim }]}
        >
          <Text style={styles.sparkleText}>✨</Text>
        </Animated.View>
        {index % 2 === 0 && (
          <Animated.View
            style={[styles.sparkle, styles.sparkle2, { opacity: fadeAnim }]}
          >
            <Text style={styles.sparkleText}>⭐</Text>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const renderWindingPath = () => {
    const pathElements = [];

    for (let i = 0; i < journey.length - 1; i++) {
      pathElements.push(...renderPathSegment(journey[i], journey[i + 1], i));
    }

    return pathElements;
  };

  return (
    <Animated.ScrollView
      style={[styles.scrollView, { opacity: fadeAnim }]}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      accessibilityLabel="Learning adventure map"
    >
      <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
        <Text style={styles.header}>🗺️ Your Learning Adventure</Text>
        <Text style={styles.subHeader}>
          Follow the magical path and discover new skills at every stop!
        </Text>
        <View style={styles.headerDecoration}>
          <Text style={styles.decorativeEmoji}>🌈</Text>
          <Text style={styles.decorativeEmoji}>🦋</Text>
          <Text style={styles.decorativeEmoji}>🌟</Text>
        </View>
      </Animated.View>

      <View style={styles.journeyMap}>
        <View style={styles.backgroundDecor}>
          <Animated.View
            style={[styles.cloud, styles.cloud1, { opacity: fadeAnim }]}
          >
            <Text style={styles.cloudEmoji}>☁️</Text>
          </Animated.View>
          <Animated.View
            style={[styles.cloud, styles.cloud2, { opacity: fadeAnim }]}
          >
            <Text style={styles.cloudEmoji}>🌤️</Text>
          </Animated.View>
          <View style={[styles.mountain, styles.mountain1]}>
            <Text style={styles.mountainEmoji}>🏔️</Text>
          </View>
          <View style={[styles.tree, styles.tree1]}>
            <Text style={styles.treeEmoji}>🌳</Text>
          </View>
          <View style={[styles.tree, styles.tree2]}>
            <Text style={styles.treeEmoji}>🌲</Text>
          </View>
        </View>

        <View style={styles.pathContainer}>{renderWindingPath()}</View>

        <View style={styles.stopsContainer}>
          {journey.map((stop, index) => renderStop(stop, index))}
        </View>
      </View>

      <Animated.View style={[styles.footerContainer, { opacity: fadeAnim }]}>
        <View style={styles.motivationSection}>
          <Text style={styles.footer}>
            🚀 Every step brings you closer to becoming a reading hero! 🦸‍♂️
          </Text>
          <View style={styles.encouragementBadges}>
            <View style={[styles.badge, { backgroundColor: "#FF6B6B" }]}>
              <Text style={styles.badgeText}>🏆 You're Amazing!</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: "#51CF66" }]}>
              <Text style={styles.badgeText}>💪 Keep Going!</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: "#339AF0" }]}>
              <Text style={styles.badgeText}>🌟 Superstar!</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressSummary}>
          <Text style={styles.progressTitle}>Your Journey Progress</Text>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            3 out of 5 adventures completed! 🎉
          </Text>
        </View>
      </Animated.View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  container: {
    padding: 20,
    minHeight: "100%",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
    padding: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 2,
    borderColor: "#E6F3FF",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
    marginBottom: 15,
  },
  headerDecoration: {
    flexDirection: "row",
    gap: 15,
  },
  decorativeEmoji: {
    fontSize: 20,
  },
  journeyMap: {
    position: "relative",
    height: 600,
    marginVertical: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  backgroundDecor: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  pathContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  pathSegment: {
    position: "absolute",
    width: 8,
    height: 4,
    borderRadius: 2,
  },
  stopsContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  stopContainer: {
    position: "absolute",
    width: 120,
    height: 160,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  glowEffect: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    top: -10,
  },
  pathConnector: {
    position: "absolute",
  },
  connectorDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stopButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    position: "relative",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  innerRing: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
  },
  stopEmoji: {
    fontSize: 30,
    zIndex: 1,
  },
  completionBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    backgroundColor: "#48BB78",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  completionCheck: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  stopNumber: {
    position: "absolute",
    top: -12,
    left: -12,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  stopNumberText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  stopInfo: {
    position: "absolute",
    top: 85,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 15,
    minWidth: 110,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderTopWidth: 3,
  },
  stopTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  stopDescription: {
    fontSize: 11,
    color: "#666666",
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 8,
  },
  progressDots: {
    flexDirection: "row",
    gap: 3,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  startFlag: {
    position: "absolute",
    top: -20,
    right: -15,
  },
  finishFlag: {
    position: "absolute",
    top: -20,
    left: -15,
  },
  flagEmoji: {
    fontSize: 16,
  },
  sparkle: {
    position: "absolute",
  },
  sparkle1: {
    top: 10,
    right: 10,
  },
  sparkle2: {
    top: 20,
    left: 5,
  },
  sparkleText: {
    fontSize: 12,
    opacity: 0.7,
  },
  cloud: {
    position: "absolute",
  },
  cloud1: {
    top: 30,
    right: 40,
  },
  cloud2: {
    top: 200,
    left: 20,
  },
  cloudEmoji: {
    fontSize: 24,
    opacity: 0.4,
  },
  mountain: {
    position: "absolute",
  },
  mountain1: {
    bottom: 80,
    right: 30,
  },
  mountainEmoji: {
    fontSize: 20,
    opacity: 0.3,
  },
  tree: {
    position: "absolute",
  },
  tree1: {
    bottom: 120,
    left: 40,
  },
  tree2: {
    bottom: 60,
    right: 60,
  },
  treeEmoji: {
    fontSize: 18,
    opacity: 0.3,
  },
  footerContainer: {
    marginTop: 30,
    padding: 25,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  motivationSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  footer: {
    fontSize: 16,
    color: "#2D3748",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 20,
    lineHeight: 24,
  },
  encouragementBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  progressSummary: {
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E6F3FF",
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 10,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#E6F3FF",
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#339AF0",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#4A5568",
    fontWeight: "500",
  },
});

export default memo(HomeScreen);
