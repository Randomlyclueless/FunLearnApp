import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import * as Animatable from "react-native-animatable";
import { styles } from "../../dontknowyet/styles";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const router = useRouter();

  // Load OpenDyslexic font
  const [fontsLoaded] = useFonts({
    OpenDyslexic: require("../../assets/fonts/OpenDyslexic3-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Show splash screen while fonts load
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFF8E7" barStyle="dark-content" />

      {/* Floating background elements */}
      <Animatable.View
        style={[
          styles.floatingCircle,
          styles.circle1,
          { pointerEvents: "none" },
        ]}
        animation="pulse"
        iterationCount="infinite"
        duration={3000}
      />
      <Animatable.View
        style={[
          styles.floatingCircle,
          styles.circle2,
          { pointerEvents: "none" },
        ]}
        animation="bounce"
        iterationCount="infinite"
        duration={4000}
      />
      <Animatable.View
        style={[
          styles.floatingCircle,
          styles.circle3,
          { pointerEvents: "none" },
        ]}
        animation="rotate"
        iterationCount="infinite"
        duration={8000}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with mascot */}
        <Animatable.View
          style={styles.header}
          animation="fadeInDown"
          duration={1000}
        >
          <Animatable.Image
            source={require("../../assets/mascot.png")}
            style={styles.mascot}
            resizeMode="contain"
            animation="bounceIn"
            duration={1500}
          />

          <View style={styles.welcomeSection}>
            <Animatable.Text
              style={styles.greeting}
              animation="fadeInRight"
              delay={500}
            >
              Hi there! 👋
            </Animatable.Text>
            <Animatable.Text
              style={styles.title}
              animation="wobble"
              delay={800}
              duration={2000}
            >
              Welcome to Leximate
            </Animatable.Text>
            <Animatable.Text
              style={styles.subtitle}
              animation="fadeInUp"
              delay={1000}
            >
              Your magical reading buddy! 🌟
            </Animatable.Text>
          </View>
        </Animatable.View>

        {/* Quick Stats Card */}
        <Animatable.View
          style={styles.statsCard}
          animation="fadeInUp"
          delay={1200}
        >
          <Text style={styles.statsTitle}>Today's Progress 📈</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Words Read</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Stories Done</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Stars Earned</Text>
            </View>
          </View>
        </Animatable.View>

        {/* Main Action Buttons */}
        <View style={styles.buttonSection}>
          <Animatable.View animation="fadeInUp" delay={1400}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => router.push("/(tabs)/reading")}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonEmoji}>📖</Text>
                <View style={styles.buttonTextSection}>
                  <Text style={styles.buttonTitle}>Start Reading</Text>
                  <Text style={styles.buttonSubtitle}>
                    Interactive stories & games
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={1600}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.push("/(tabs)/phonics")}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonEmoji}>🔤</Text>
                <View style={styles.buttonTextSection}>
                  <Text style={styles.buttonTitle}>Letter Sounds</Text>
                  <Text style={styles.buttonSubtitle}>
                    Practice phonics & pronunciation
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={1800}>
            <TouchableOpacity
              style={[styles.button, styles.tertiaryButton]}
              onPress={() => router.push("/(tabs)/writing")}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonEmoji}>✏️</Text>
                <View style={styles.buttonTextSection}>
                  <Text style={styles.buttonTitle}>Writing Practice</Text>
                  <Text style={styles.buttonSubtitle}>
                    Trace letters & words
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        </View>

        {/* Additional Tools Row */}
        <View style={styles.toolsSection}>
          <Animatable.View animation="fadeInLeft" delay={2000}>
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => router.push("/(tabs)/progress")}
              activeOpacity={0.8}
            >
              <Text style={styles.toolEmoji}>📊</Text>
              <Text style={styles.toolText}>Progress</Text>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={2200}>
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => router.push("/(tabs)/dictionary")}
              activeOpacity={0.8}
            >
              <Text style={styles.toolEmoji}>📚</Text>
              <Text style={styles.toolText}>Dictionary</Text>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="fadeInRight" delay={2400}>
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => router.push("/(tabs)/settings")}
              activeOpacity={0.8}
            >
              <Text style={styles.toolEmoji}>⚙️</Text>
              <Text style={styles.toolText}>Settings</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>

        {/* Daily Challenge Card */}
        <Animatable.View
          style={styles.challengeCard}
          animation="fadeInUp"
          delay={2600}
        >
          <Text style={styles.challengeTitle}>Daily Challenge 🎯</Text>
          <Text style={styles.challengeText}>
            Read 5 new words today and earn a special badge!
          </Text>
          <TouchableOpacity
            style={styles.challengeButton}
            onPress={() => router.push("/(tabs)/challenge")}
          >
            <Text style={styles.challengeButtonText}>Accept Challenge 🏆</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </View>
  );
}
