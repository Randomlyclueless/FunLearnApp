import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useFonts } from "expo-font";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

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
    OpenDyslexic: require("../assets/fonts/OpenDyslexic3-Bold.ttf"),
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

  if (!fontsLoaded) {
    return null;
  }

  const features = [
    {
      emoji: "🤖",
      title: "AI-Powered Learning",
      description:
        "Our adaptive AI personalizes lessons, identifies tricky patterns, and adjusts content in real-time to match your child's unique pace.",
    },
    {
      emoji: "👁️",
      title: "Computer Vision",
      description:
        "Using our proprietary tech, we can correct common letter reversals like 'b' and 'd' by analyzing your child's hand movements during writing practice.",
    },
    {
      emoji: "🎤",
      title: "Conversational Intelligence",
      description:
        "A friendly AI companion listens to your child's pronunciation and provides instant, empathetic feedback to improve their phonetic awareness.",
    },
  ];

  return (
    <ScrollView style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Animatable.View
            animation="fadeInDown"
            duration={1000}
            style={styles.logoContainer}
          >
            <LinearGradient
              colors={["#6C63FF", "#800080"]}
              style={styles.logoIcon}
            >
              <Text style={styles.logoIconText}>🧠</Text>
            </LinearGradient>
            <Text style={styles.logoText}>Leximate</Text>
          </Animatable.View>
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

        <Animatable.View
          style={styles.heroSection}
          animation="fadeIn"
          duration={1500}
        >
          <Animatable.Text
            style={styles.heroTitle}
            animation="fadeInUp"
            delay={200}
          >
            <Text style={{ color: "#6C63FF" }}>A New Way to</Text>
            {"\n"}
            <Text style={{ color: "#800080" }}>Conquer Dyslexia</Text>
          </Animatable.Text>
          <Animatable.Text
            style={styles.heroSubtitle}
            animation="fadeInUp"
            delay={400}
          >
            The first AI-first platform that uses cutting-edge technology to
            make learning intuitive, personal, and fun.
          </Animatable.Text>
        </Animatable.View>

        <View style={styles.ctaButtonContainer}>
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            duration={2000}
          >
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push("/auth")}
            >
              <Text style={styles.ctaButtonText}>Get Started (Parents)</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our AI-First Features</Text>
            <Text style={styles.sectionSubtitle}>
              We use a suite of intelligent tools to create a personalized
              learning journey for every child.
            </Text>
          </View>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <Animatable.View
                key={index}
                style={styles.featureCard}
                animation="fadeInUp"
                delay={index * 200 + 500}
              >
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>{feature.emoji}</Text>
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </Animatable.View>
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Built for Your Child's Success
            </Text>
            <Text style={styles.sectionSubtitle}>
              Every part of our app is designed with a dyslexic-friendly
              approach in mind, from the content to the UI.
            </Text>
          </View>
          <View style={styles.benefitsGrid}>
            <Animatable.View
              style={styles.benefitCard}
              animation="fadeInLeft"
              delay={1000}
            >
              <Text style={styles.benefitEmoji}>📖</Text>
              <Text style={styles.benefitText}>
                Dyslexic-friendly font for better readability.
              </Text>
            </Animatable.View>
            <Animatable.View
              style={styles.benefitCard}
              animation="fadeInRight"
              delay={1200}
            >
              <Text style={styles.benefitEmoji}>⭐</Text>
              <Text style={styles.benefitText}>
                Interactive and rewarding learning games.
              </Text>
            </Animatable.View>
            <Animatable.View
              style={styles.benefitCard}
              animation="fadeInLeft"
              delay={1400}
            >
              <Text style={styles.benefitEmoji}>🗓️</Text>
              <Text style={styles.benefitText}>
                Track your child's progress with weekly reports.
              </Text>
            </Animatable.View>
            <Animatable.View
              style={styles.benefitCard}
              animation="fadeInRight"
              delay={1600}
            >
              <Text style={styles.benefitEmoji}>✨</Text>
              <Text style={styles.benefitText}>
                A friendly AI mascot to guide every step of the journey.
              </Text>
            </Animatable.View>
          </View>
        </View>

        <Animatable.View
          style={styles.finalCtaCard}
          animation="zoomIn"
          delay={1800}
        >
          <Text style={styles.finalCtaText}>
            Ready to empower your child's learning?
          </Text>
          <TouchableOpacity
            style={styles.finalCtaButton}
            onPress={() => router.push("/auth")}
          >
            <Text style={styles.finalCtaButtonText}>
              Join the Leximate Family
            </Text>
          </TouchableOpacity>
        </Animatable.View>
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
    fontFamily: "OpenDyslexic",
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
    fontFamily: "OpenDyslexic",
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
    justifyContent: "center",
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
  sectionContainer: {
    marginBottom: 40,
  },
  sectionHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: "OpenDyslexic",
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
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  featureCard: {
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
  featureIconContainer: {
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 50,
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: "OpenDyslexic",
    fontWeight: "bold",
    color: "#394693",
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  benefitCard: {
    width: "45%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    margin: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  benefitEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: "OpenDyslexic",
    fontWeight: "bold",
    color: "#394693",
    textAlign: "center",
  },
  finalCtaCard: {
    backgroundColor: "#E3ECFB",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  finalCtaText: {
    fontSize: 24,
    fontFamily: "OpenDyslexic",
    fontWeight: "bold",
    color: "#394693",
    marginBottom: 10,
    textAlign: "center",
  },
  finalCtaButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  finalCtaButtonText: {
    color: "#394693",
    fontSize: 18,
    fontWeight: "bold",
  },
});
