import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useFonts } from "expo-font";

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [currentGreeting, setCurrentGreeting] = useState<string>("");
  const [timeOfDay, setTimeOfDay] = useState<"day" | "night">("day");
  const [mascotMood, setMascotMood] = useState<"happy" | "excited">("happy");

  const kidFriendlyGreetings: string[] = [
    "Hi there, awesome friend! 🌟 I'm Lexi, and I'm here to make reading super fun with you!",
    "Hello wonderful you! 🦋 Want to go on a magical letter adventure together?",
    "Hey superstar! ⭐ I have special powers to help you read in the most amazing way!",
    "Hi amazing friend! 🌈 Let's discover how beautiful words can be when we work together!",
    "Hello there! 🎪 I'm like a friendly robot who loves helping kids become reading heroes!",
  ];

  const [fontsLoaded] = useFonts({
    OpenDyslexic: require("../../assets/fonts/OpenDyslexic3-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      handleMascotClick();
    }
    const hour = new Date().getHours();
    setTimeOfDay(hour >= 6 && hour < 18 ? "day" : "night");
  }, [fontsLoaded]);

  const handleMascotClick = async (): Promise<void> => {
    if (isLoading || isSpeaking) return;
    setIsLoading(true);
    setMascotMood("excited");
    const randomGreeting =
      kidFriendlyGreetings[
        Math.floor(Math.random() * kidFriendlyGreetings.length)
      ];
    setCurrentGreeting(randomGreeting);

    if (audioEnabled) {
      setIsSpeaking(true);
      const cleanText = randomGreeting.replace(/[🌟🦋⭐🌈🎪]/g, "");
      Speech.speak(cleanText, {
        language: "en-US",
        onDone: () => {
          setIsSpeaking(false);
          setMascotMood("happy");
        },
      });
    }

    setTimeout(() => setIsLoading(false), 1500);
  };

  const getMascotEmoji = (): string => {
    if (isLoading || isSpeaking) return "🤖";
    switch (mascotMood) {
      case "excited":
        return "🤖";
      case "happy":
        return "🤖";
      default:
        return "🤖";
    }
  };

  const handleGetStarted = () => {
    // This will take the user to the learn tab
    router.replace("/(tabs)/welcome");
  };

  if (!fontsLoaded) {
    return null;
  }

  const powers = [
    {
      emoji: "🎤",
      title: "I Can Talk & Listen!",
      subtitle: "Like Your Best Friend",
      description:
        "I can hear what you say and talk back to you! I give you high-fives when you do great and help you when you need it. It's like having a super smart friend who's always there to cheer you on!",
    },
    {
      emoji: "👁️",
      title: "I Can See Your Writing!",
      subtitle: "Magic Vision Powers",
      description:
        "I have special eyes that can watch you write letters! If you mix up 'b' and 'd' or 'p' and 'q', I'll gently help you fix it. It's like having a magical helper watching over your shoulder!",
    },
    {
      emoji: "🧠",
      title: "I Learn About You!",
      subtitle: "Smart Brain That Cares",
      description:
        "The more we play together, the better I understand how you like to learn! I remember what makes you happy and what you find tricky, so I can make everything perfect just for you!",
    },
  ];

  const activities = [
    { emoji: "📖", title: "Story Time", subtitle: "Read Together" },
    { emoji: "🎵", title: "Letter Songs", subtitle: "Sing & Learn" },
    { emoji: "✏️", title: "Write Letters", subtitle: "Practice Writing" },
    { emoji: "🎯", title: "Fun Games", subtitle: "Play & Learn" },
    { emoji: "🏆", title: "Earn Stars", subtitle: "Collect Rewards" },
    { emoji: "🌟", title: "Daily Wins", subtitle: "Celebrate Success" },
    { emoji: "📚", title: "Word Magic", subtitle: "Discover New Words" },
    { emoji: "🎨", title: "Creative Fun", subtitle: "Draw & Color" },
  ];

  return (
    <ScrollView style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        {/* Kid-Friendly Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoIconText}>🧠</Text>
            </View>
            <Text style={styles.logoText}>Leximate</Text>
          </View>
          <TouchableOpacity
            onPress={() => setAudioEnabled(!audioEnabled)}
            style={styles.audioButton}
          >
            {audioEnabled ? (
              <Text style={{ fontSize: 24 }}>🔊</Text>
            ) : (
              <Text style={{ fontSize: 24 }}>🔇</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
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
            adventure! I'm your AI friend who makes letters dance and words
            sing! 🎵✨
          </Text>
        </View>

        {/* AI Mascot - More Kid-Friendly */}
        <View style={styles.mascotArea}>
          <TouchableOpacity
            style={styles.mascotButton}
            onPress={handleMascotClick}
            disabled={isLoading || isSpeaking}
          >
            <Text style={styles.mascotEmoji}>{getMascotEmoji()}</Text>
            {isLoading || isSpeaking ? (
              <View style={[StyleSheet.absoluteFill, styles.spinnerContainer]}>
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

        {/* Big Fun Buttons */}
        <View style={styles.ctaButtonContainer}>
          <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
            <View style={styles.ctaButtonContent}>
              <Text style={styles.ctaButtonText}>Let's Start Reading!</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* What Makes Me Special - Kid Version */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>What Makes Me Special? 🌈</Text>
            <Text style={styles.sectionSubtitle}>
              I have three super cool powers that help you become an amazing
              reader!
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

        {/* Fun Activities */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Amazing Things We Can Do! 🎪
            </Text>
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

        {/* Encouragement Section */}
        <View style={styles.encouragementContainer}>
          <Text style={styles.encouragementText}>You Are Amazing! ⭐</Text>
          <Text style={styles.encouragementSubtitle}>
            Every superhero reader started just like you!
          </Text>
          <TouchableOpacity
            style={styles.encouragementButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.encouragementButtonText}>
              Let's Begin Our Adventure! 🚀
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#F2F8FF",
  },
  innerContainer: {
    padding: 24,
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    width: 56,
    height: 56,
    backgroundColor: "#6C63FF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "5deg" }],
  },
  logoIconText: {
    fontSize: 32,
    color: "#fff",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#394693",
    marginLeft: 10,
  },
  audioButton: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 60,
  },
  heroSubtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    lineHeight: 28,
  },
  mascotArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  mascotButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#AEE7F8",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  mascotEmoji: {
    fontSize: 100,
  },
  spinnerContainer: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  greetingBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  greetingIconContainer: {
    backgroundColor: "#6C63FF",
    borderRadius: 20,
    padding: 5,
    marginRight: 10,
  },
  greetingText: {
    fontSize: 16,
    color: "#394693",
    textAlign: "center",
    flex: 1,
  },
  ctaButtonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  ctaButton: {
    backgroundColor: "#34D399",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 14,
    width: "80%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  ctaButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionContainer: {
    marginBottom: 40,
  },
  sectionHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#394693",
    marginBottom: 10,
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    maxWidth: 600,
  },
  powersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  powerCard: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    margin: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  powerIconContainer: {
    marginBottom: 10,
  },
  powerIcon: {
    fontSize: 50,
  },
  powerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#394693",
    textAlign: "center",
  },
  powerSubtitle: {
    fontSize: 12,
    color: "#6C63FF",
    textAlign: "center",
    marginBottom: 10,
  },
  powerDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  activitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  activityCard: {
    width: "22%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    margin: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  activityIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#394693",
    textAlign: "center",
  },
  activitySubtitle: {
    fontSize: 10,
    color: "#6C63FF",
    textAlign: "center",
  },
  encouragementContainer: {
    backgroundColor: "#E3ECFB",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  encouragementText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#394693",
    marginBottom: 5,
  },
  encouragementSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  encouragementButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  encouragementButtonText: {
    color: "#394693",
    fontSize: 18,
    fontWeight: "bold",
  },
});
