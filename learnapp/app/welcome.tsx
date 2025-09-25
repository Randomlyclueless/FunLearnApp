import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
  Animated,
  Easing,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter, Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";
import * as SplashScreen from "expo-splash-screen";
import * as Animatable from "react-native-animatable";
import { useFonts } from "expo-font";

import WelcomeStyles from "./components/WelcomeStyles";
import StreakWelcome from "./components/StreakWelcome";
import Header from "./components/Header";
import MainAppContent from "./components/MainAppContent";
import FeaturesSection from "./components/FeaturesSection";
import ActivitiesSection from "./components/ActivitiesSection";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [bounceValue] = useState(new Animated.Value(1));
  const [spinValue] = useState(new Animated.Value(0));

  const [fontsLoaded] = useFonts({
    OpenDyslexic: require("../assets/fonts/OpenDyslexic3-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      startBounceAnimation();
      startSpinAnimation();
    }
  }, [fontsLoaded]);

  const startBounceAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startSpinAnimation = () => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleButtonPress = (route: Href) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    setTimeout(() => router.push(route), 500);
  };

  if (!fontsLoaded) {
    return null;
  }

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

  return (
    <View style={WelcomeStyles.container}>
      <StatusBar backgroundColor="#FFF8E7" barStyle="dark-content" />

      {showConfetti && (
        <ConfettiCannon
          count={50}
          origin={{ x: width / 2, y: 0 }}
          autoStart={true}
          fadeOut={true}
        />
      )}

      <Animatable.View
        style={[WelcomeStyles.floatingElement, WelcomeStyles.floatingElement1]}
        animation="pulse"
        iterationCount="infinite"
        duration={2000}
      />
      <Animatable.View
        style={[WelcomeStyles.floatingElement, WelcomeStyles.floatingElement2]}
        animation="bounce"
        iterationCount="infinite"
        duration={3000}
      />
      <Animatable.View
        style={[WelcomeStyles.floatingElement, WelcomeStyles.floatingElement3]}
        animation="rotate"
        iterationCount="infinite"
        duration={6000}
      />
      <Animatable.View
        style={[WelcomeStyles.floatingElement, WelcomeStyles.floatingElement4]}
        animation="swing"
        iterationCount="infinite"
        duration={4000}
      />

      <ScrollView
        contentContainerStyle={WelcomeStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animatable.View
          style={WelcomeStyles.header}
          animation="fadeInDown"
          duration={1000}
        >
          <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
            <Image
              source={require("../assets/mascot.png")}
              style={WelcomeStyles.mascotImage}
              resizeMode="contain"
            />
          </Animated.View>

          <View style={WelcomeStyles.welcomeTextContainer}>
            <Animatable.Text
              style={WelcomeStyles.greetingText}
              animation="tada"
              delay={500}
              duration={1500}
            >
              Hi there! 👋
            </Animatable.Text>
            <Animatable.Text
              style={WelcomeStyles.welcomeTitle}
              animation="bounceIn"
              delay={800}
              duration={2000}
            >
              Welcome to Leximate! 🎉
            </Animatable.Text>
            <Animatable.Text
              style={WelcomeStyles.welcomeSubtitle}
              animation="fadeInUp"
              delay={1000}
            >
              Where reading becomes an adventure! 🚀
            </Animatable.Text>
          </View>
        </Animatable.View>

        <StreakWelcome />

        <Animatable.View
          style={WelcomeStyles.statsCard}
          animation="zoomIn"
          delay={1200}
        >
          <View style={WelcomeStyles.statsHeader}>
            <Text style={WelcomeStyles.statsTitle}>
              Today's Adventure Map 🗺️
            </Text>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Text style={WelcomeStyles.spinningStar}>⭐</Text>
            </Animated.View>
          </View>
          <View style={WelcomeStyles.statsRow}>
            <Animatable.View
              style={WelcomeStyles.statItem}
              animation="pulse"
              delay={1400}
              iterationCount="infinite"
            >
              <Text style={WelcomeStyles.statNumber}>12</Text>
              <Text style={WelcomeStyles.statLabel}>Words Discovered</Text>
            </Animatable.View>
            <Animatable.View
              style={WelcomeStyles.statItem}
              animation="pulse"
              delay={1600}
              iterationCount="infinite"
            >
              <Text style={WelcomeStyles.statNumber}>3</Text>
              <Text style={WelcomeStyles.statLabel}>Quests Completed</Text>
            </Animatable.View>
            <Animatable.View
              style={WelcomeStyles.statItem}
              animation="pulse"
              delay={1800}
              iterationCount="infinite"
            >
              <Text style={WelcomeStyles.statNumber}>5</Text>
              <Text style={WelcomeStyles.statLabel}>Magic Stars</Text>
            </Animatable.View>
          </View>
        </Animatable.View>

        <View style={WelcomeStyles.actionButtonsContainer}>
          <Animatable.View animation="slideInLeft" delay={1400} duration={1000}>
            <TouchableOpacity
              style={WelcomeStyles.mainActionButton}
              onPress={() => handleButtonPress("/(tabs)/reading")}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={WelcomeStyles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Animatable.Text
                  animation="bounce"
                  iterationCount="infinite"
                  style={WelcomeStyles.buttonEmoji}
                >
                  📖
                </Animatable.Text>
                <View style={WelcomeStyles.buttonTextContainer}>
                  <Text style={WelcomeStyles.mainButtonText}>
                    Learn Alphabets
                  </Text>
                  <Text style={WelcomeStyles.mainButtonSubtitle}>✨</Text>
                </View>
                <Text style={WelcomeStyles.arrow}>➡️</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View
            animation="slideInRight"
            delay={1600}
            duration={1000}
          >
            <TouchableOpacity
              style={WelcomeStyles.mainActionButton}
              onPress={() => handleButtonPress("/(tabs)/phonics")}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["#4ECDC4", "#44A08D"]}
                style={WelcomeStyles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Animatable.Text
                  animation="swing"
                  iterationCount="infinite"
                  style={WelcomeStyles.buttonEmoji}
                >
                  🔤
                </Animatable.Text>
                <View style={WelcomeStyles.buttonTextContainer}>
                  <Text style={WelcomeStyles.mainButtonText}>Sound Safari</Text>
                  <Text style={WelcomeStyles.mainButtonSubtitle}>
                    Discover letter sounds! 🎵
                  </Text>
                </View>
                <Text style={WelcomeStyles.arrow}>➡️</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="slideInLeft" delay={1800} duration={1000}>
            <TouchableOpacity
              style={WelcomeStyles.mainActionButton}
              onPress={() => handleButtonPress("/(tabs)/writing")}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["#FFD93D", "#FF9C33"]}
                style={WelcomeStyles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Animatable.Text
                  animation="rubberBand"
                  iterationCount="infinite"
                  style={WelcomeStyles.buttonEmoji}
                >
                  ✏️
                </Animatable.Text>
                <View style={WelcomeStyles.buttonTextContainer}>
                  <Text style={WelcomeStyles.mainButtonText}>
                    Writing Wizard
                  </Text>
                  <Text style={WelcomeStyles.mainButtonSubtitle}>
                    Draw magical letters! 🎨
                  </Text>
                </View>
                <Text style={WelcomeStyles.arrow}>➡️</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        </View>

        <Animatable.View
          style={WelcomeStyles.toolsContainer}
          animation="fadeInUp"
          delay={2000}
        >
          <Text style={WelcomeStyles.toolsTitle}>Magic Tools 🧰</Text>
          <View style={WelcomeStyles.toolsRow}>
            <TouchableOpacity
              style={WelcomeStyles.toolButton}
              onPress={() => handleButtonPress("/(tabs)/progress")}
              activeOpacity={0.8}
            >
              <Animatable.Text
                animation="tada"
                delay={2200}
                style={WelcomeStyles.toolEmoji}
              >
                📊
              </Animatable.Text>
              <Text style={WelcomeStyles.toolLabel}>Progress Map</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={WelcomeStyles.toolButton}
              onPress={() => handleButtonPress("/(tabs)/dictionary")}
              activeOpacity={0.8}
            >
              <Animatable.Text
                animation="tada"
                delay={2400}
                style={WelcomeStyles.toolEmoji}
              >
                📚
              </Animatable.Text>
              <Text style={WelcomeStyles.toolLabel}>Word Treasure</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={WelcomeStyles.toolButton}
              onPress={() => handleButtonPress("/(tabs)/settings")}
              activeOpacity={0.8}
            >
              <Animatable.Text
                animation="tada"
                delay={2600}
                style={WelcomeStyles.toolEmoji}
              >
                ⚙️
              </Animatable.Text>
              <Text style={WelcomeStyles.toolLabel}>Magic Settings</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        <Animatable.View
          style={WelcomeStyles.challengeCard}
          animation="bounceInUp"
          delay={2800}
        >
          <View style={WelcomeStyles.challengeHeader}>
            <Text style={WelcomeStyles.challengeTitle}>
              Daily Magic Quest! 🎯
            </Text>
            <Text style={WelcomeStyles.challengeBadge}>🏆 NEW!</Text>
          </View>
          <Text style={WelcomeStyles.challengeSubtitle}>
            Read 5 magical words and unlock the "Word Wizard" badge today!
          </Text>
          <TouchableOpacity
            style={WelcomeStyles.challengeButton}
            onPress={() => handleButtonPress("/challenge")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#A78BFA", "#7C3AED"]}
              style={WelcomeStyles.challengeButtonGradient}
            >
              <Text style={WelcomeStyles.challengeButtonText}>
                Start Quest! 🚀
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View
          style={WelcomeStyles.footer}
          animation="fadeIn"
          delay={3000}
        >
          <Text style={WelcomeStyles.footerText}>
            Ready for today's adventure? 🌈
          </Text>
        </Animatable.View>
      </ScrollView>
    </View>
  );
}
