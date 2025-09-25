import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";
import { useFonts } from "expo-font";
import wordsData from "../data/words.json";

const { width } = Dimensions.get("window");
const alphabets = Object.keys(wordsData);

export default function WordsScreen() {
  const router = useRouter();
  const [currentAlphabet, setCurrentAlphabet] = useState("A");
  const [isSpelling, setIsSpelling] = useState(false);
  const [currentPhoneticIndex, setCurrentPhoneticIndex] = useState(-1);
  const [spellingWordId, setSpellingWordId] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    OpenDyslexic: require("../../assets/fonts/OpenDyslexic3-Bold.ttf"),
  });

  const speakWord = (wordToSpeak: string) => {
    Speech.speak(wordToSpeak, {
      language: "en-US",
      rate: 0.8,
    });
  };

  const speakLetter = (letter: string, onDone?: () => void) => {
    // --- FIX 1: Debounce speak call and use onDone callback for syncing ---
    Speech.speak(letter, {
      language: "en-US",
      rate: 0.6,
      onDone: onDone,
    });
  };

  const handleSpellWord = async (wordItem: any, wordIndex: number) => {
    if (isSpelling) return; // Prevent multiple calls

    setIsSpelling(true);
    const uniqueWordId = `${currentAlphabet}-${wordIndex}`;
    setSpellingWordId(uniqueWordId);
    setCurrentPhoneticIndex(-1);

    Speech.speak("Let's spell " + wordItem.word, {
      language: "en-US",
      rate: 0.8,
      onDone: () => {
        let i = 0;
        const spellNextLetter = () => {
          if (i < wordItem.phonics.length) {
            setCurrentPhoneticIndex(i);
            speakLetter(wordItem.phonics[i], () => {
              i++;
              spellNextLetter();
            });
          } else {
            // Finished spelling
            setCurrentPhoneticIndex(-1);
            setIsSpelling(false);
            setSpellingWordId(null);
            setTimeout(() => speakWord(wordItem.word), 500);
          }
        };
        spellNextLetter();
      },
    });
  };

  const handleAlphabetChange = (alphabet: string) => {
    setCurrentAlphabet(alphabet);
  };

  const renderPhonics = (wordItem: any, wordIndex: number) => {
    const uniqueWordId = `${currentAlphabet}-${wordIndex}`;
    return wordItem.phonics.map((letter: string, index: number) => (
      <Animatable.Text
        key={index}
        animation={
          spellingWordId === uniqueWordId && currentPhoneticIndex === index
            ? "pulse"
            : undefined
        }
        style={[
          styles.phoneticLetter,
          spellingWordId === uniqueWordId &&
            currentPhoneticIndex === index &&
            styles.phoneticLetterActive,
        ]}
        onPress={() => speakLetter(letter)}
      >
        {letter.toUpperCase()}
      </Animatable.Text>
    ));
  };

  const renderAlphabetSelector = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.alphabetSelectorScroll}
        contentContainerStyle={styles.alphabetSelectorContainer}
      >
        {alphabets.map((alphabet) => (
          <TouchableOpacity
            key={alphabet}
            onPress={() => handleAlphabetChange(alphabet)}
            style={[
              styles.alphabetButton,
              currentAlphabet === alphabet && styles.alphabetButtonActive,
            ]}
          >
            <Text
              style={[
                styles.alphabetButtonText,
                currentAlphabet === alphabet && styles.alphabetButtonTextActive,
              ]}
            >
              {alphabet}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  const currentWords =
    wordsData[currentAlphabet as keyof typeof wordsData] || [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 30 }}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Word Explorer</Text>
        <View style={{ width: 30 }} />
      </View>

      {renderAlphabetSelector()}

      <View style={styles.mainContent}>
        <Animatable.Text
          animation="bounceIn"
          duration={800}
          style={styles.currentLetterTitle}
        >
          {currentAlphabet}
        </Animatable.Text>

        {currentWords.map((wordItem, index) => (
          <Animatable.View
            key={index}
            animation="zoomIn"
            duration={800}
            style={styles.wordCard}
          >
            <Animatable.Image
              animation="fadeIn"
              duration={1000}
              source={{ uri: wordItem.image }}
              style={styles.wordImage}
              resizeMode="contain"
              onError={(e) =>
                console.log("Image failed to load", e.nativeEvent.error)
              }
            />

            <Animatable.Text
              animation="pulse"
              iterationCount="infinite"
              duration={2000}
              style={styles.wordTitle}
            >
              {wordItem.word.toUpperCase()}
            </Animatable.Text>

            <Animatable.View
              animation="fadeInUp"
              delay={300}
              style={styles.phoneticsContainer}
            >
              {renderPhonics(wordItem, index)}
            </Animatable.View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleSpellWord(wordItem, index)}
                disabled={
                  isSpelling && spellingWordId === `${currentAlphabet}-${index}`
                }
              >
                <LinearGradient
                  colors={
                    isSpelling &&
                    spellingWordId === `${currentAlphabet}-${index}`
                      ? ["#E5E7EB", "#E5E7EB"]
                      : ["#FFD700", "#FFB000"]
                  }
                  style={styles.buttonGradient}
                >
                  <Text style={styles.actionButtonText}>
                    {isSpelling &&
                    spellingWordId === `${currentAlphabet}-${index}`
                      ? "Spelling..."
                      : "Spell Word 🔤"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                onPress={() => speakWord(wordItem.word)}
                style={styles.actionButton}
              >
                <LinearGradient
                  colors={["#6C63FF", "#800080"]}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.actionButtonText}>Hear Full Word 🔊</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    fontFamily: "OpenDyslexic",
  },
  alphabetSelectorScroll: {
    marginBottom: 20,
  },
  alphabetSelectorContainer: {
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  alphabetButton: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  alphabetButtonActive: {
    backgroundColor: "#6C63FF",
  },
  alphabetButtonText: {
    color: "#374151",
    fontSize: 18,
    fontWeight: "bold",
  },
  alphabetButtonTextActive: {
    color: "#fff",
  },
  mainContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  currentLetterTitle: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#6C63FF",
    marginBottom: 20,
  },
  wordCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  wordImage: {
    width: width - 88,
    height: 180,
    borderRadius: 12,
    marginBottom: 15,
    borderColor: "#E5E7EB",
    borderWidth: 2,
  },
  wordTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#394693",
    marginBottom: 15,
    fontFamily: "OpenDyslexic",
  },
  phoneticsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  phoneticLetter: {
    fontSize: 28,
    fontWeight: "bold",
    marginHorizontal: 4,
    color: "#394693",
    fontFamily: "OpenDyslexic",
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 45,
    textAlign: "center",
  },
  phoneticLetterActive: {
    backgroundColor: "#FF6B6B",
    color: "#fff",
  },
  actionButtonsRow: {
    width: "100%",
    marginBottom: 15,
  },
  actionButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "OpenDyslexic",
  },
});
