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

const { width } = Dimensions.get("window");

// Define types for better TypeScript support
interface WordItem {
  word: string;
  image: string;
  phonics: string[];
}

interface WordsData {
  [key: string]: WordItem[];
}

// Enhanced words data organized by alphabet
const wordsData: WordsData = {
  A: [
    {
      word: "apple",
      image:
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop",
      phonics: ["a", "p", "p", "l", "e"],
    },
    {
      word: "ant",
      image:
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=300&h=200&fit=crop",
      phonics: ["a", "n", "t"],
    },
    {
      word: "airplane",
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=200&fit=crop",
      phonics: ["a", "i", "r", "p", "l", "a", "n", "e"],
    },
  ],
  B: [
    {
      word: "ball",
      image:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop",
      phonics: ["b", "a", "l", "l"],
    },
    {
      word: "butterfly",
      image:
        "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=300&h=200&fit=crop",
      phonics: ["b", "u", "t", "t", "e", "r", "f", "l", "y"],
    },
    {
      word: "banana",
      image:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop",
      phonics: ["b", "a", "n", "a", "n", "a"],
    },
  ],
  C: [
    {
      word: "cat",
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=200&fit=crop",
      phonics: ["c", "a", "t"],
    },
    {
      word: "car",
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&h=200&fit=crop",
      phonics: ["c", "a", "r"],
    },
    {
      word: "cake",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop",
      phonics: ["c", "a", "k", "e"],
    },
  ],
  D: [
    {
      word: "dog",
      image:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop",
      phonics: ["d", "o", "g"],
    },
    {
      word: "duck",
      image:
        "https://images.unsplash.com/photo-1518537123985-74be8ec5388c?w=300&h=200&fit=crop",
      phonics: ["d", "u", "c", "k"],
    },
    {
      word: "dolphin",
      image:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop",
      phonics: ["d", "o", "l", "p", "h", "i", "n"],
    },
  ],
  E: [
    {
      word: "elephant",
      image:
        "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=300&h=200&fit=crop",
      phonics: ["e", "l", "e", "p", "h", "a", "n", "t"],
    },
    {
      word: "egg",
      image:
        "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=300&h=200&fit=crop",
      phonics: ["e", "g", "g"],
    },
    {
      word: "eagle",
      image:
        "https://images.unsplash.com/photo-1520637836862-4d197d17c46a?w=300&h=200&fit=crop",
      phonics: ["e", "a", "g", "l", "e"],
    },
  ],
  // Add more letters as needed...
};

const alphabets = Object.keys(wordsData);

export default function WordsScreen() {
  const router = useRouter();
  const [currentAlphabet, setCurrentAlphabet] = useState("A");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(wordsData["A"][0]);
  const [isSpelling, setIsSpelling] = useState(false);
  const [currentPhoneticIndex, setCurrentPhoneticIndex] = useState(-1);

  useEffect(() => {
    const currentWords = wordsData[currentAlphabet as keyof WordsData] || [];
    if (currentWords.length > 0) {
      setCurrentWord(currentWords[currentWordIndex]);
      speakWord(currentWords[currentWordIndex].word);
    }
  }, [currentAlphabet, currentWordIndex]);

  const speakWord = (wordToSpeak: string) => {
    Speech.speak(wordToSpeak, {
      language: "en-US",
      rate: 0.8,
    });
  };

  const speakLetter = (letter: string) => {
    Speech.speak(letter, {
      language: "en-US",
      rate: 0.6,
    });
  };

  const handleSpellWord = async () => {
    setIsSpelling(true);
    setCurrentPhoneticIndex(-1);

    // First say "Let's spell"
    Speech.speak("Let's spell " + currentWord.word, {
      language: "en-US",
      rate: 0.8,
    });

    // Wait a moment, then spell each letter
    setTimeout(() => {
      currentWord.phonics.forEach((letter, index) => {
        setTimeout(() => {
          setCurrentPhoneticIndex(index);
          speakLetter(letter);

          // Reset highlighting after last letter
          if (index === currentWord.phonics.length - 1) {
            setTimeout(() => {
              setCurrentPhoneticIndex(-1);
              setIsSpelling(false);
              // Say the complete word again
              setTimeout(() => speakWord(currentWord.word), 500);
            }, 800);
          }
        }, index * 1200);
      });
    }, 1500);
  };

  const handleNextWord = () => {
    const currentWords = wordsData[currentAlphabet as keyof WordsData] || [];
    setCurrentWordIndex((prevIndex) =>
      prevIndex < currentWords.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleAlphabetChange = (alphabet: string) => {
    setCurrentAlphabet(alphabet);
    setCurrentWordIndex(0);
  };

  const renderPhonics = () => {
    return currentWord.phonics.map((letter, index) => (
      <Animatable.Text
        key={index}
        animation={currentPhoneticIndex === index ? "pulse" : undefined}
        style={{
          fontSize: 40,
          fontWeight: "bold",
          marginHorizontal: 8,
          color: currentPhoneticIndex === index ? "#FF6B6B" : "#394693",
          backgroundColor:
            currentPhoneticIndex === index ? "#FFE5E5" : "transparent",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
          minWidth: 50,
          textAlign: "center",
        }}
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
        style={{ marginBottom: 20 }}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {alphabets.map((alphabet) => (
          <TouchableOpacity
            key={alphabet}
            onPress={() => handleAlphabetChange(alphabet)}
            style={{
              backgroundColor:
                currentAlphabet === alphabet ? "#6C63FF" : "#E5E7EB",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 20,
              marginHorizontal: 4,
            }}
          >
            <Text
              style={{
                color: currentAlphabet === alphabet ? "#fff" : "#374151",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {alphabet}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 24,
          paddingTop: 50,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 30 }}>⬅️</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1F2937" }}>
          Learn Words
        </Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Alphabet Selector */}
      {renderAlphabetSelector()}

      {/* Main Content */}
      <View style={{ alignItems: "center", paddingHorizontal: 24 }}>
        {/* Current Letter Display */}
        <Animatable.Text
          animation="bounceIn"
          duration={800}
          style={{
            fontSize: 80,
            fontWeight: "bold",
            color: "#6C63FF",
            marginBottom: 10,
          }}
        >
          {currentAlphabet}
        </Animatable.Text>

        {/* Word Display */}
        <Animatable.Text
          animation="zoomIn"
          duration={800}
          style={{
            fontSize: 36,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {currentWord.word.toUpperCase()}
        </Animatable.Text>

        {/* Image Display */}
        <Animatable.View
          animation="fadeIn"
          duration={1000}
          style={{
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 30,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          <Image
            source={{ uri: currentWord.image }}
            style={{
              width: width - 48,
              height: 240,
            }}
            resizeMode="cover"
          />
        </Animatable.View>

        {/* Phonics Display */}
        <Animatable.View
          animation="fadeInUp"
          delay={300}
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
            marginBottom: 30,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            width: "100%",
          }}
        >
          {renderPhonics()}
        </Animatable.View>

        {/* Action Buttons */}
        <View style={{ width: "100%", gap: 15 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#10B981",
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 3,
            }}
            onPress={handleSpellWord}
            disabled={isSpelling}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
              {isSpelling ? "Spelling..." : "🔤 Spell Word"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#6C63FF",
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 3,
            }}
            onPress={() => speakWord(currentWord.word)}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
              🔊 Say Word
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#F59E0B",
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 3,
            }}
            onPress={handleNextWord}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
              ➡️ Next Word
            </Text>
          </TouchableOpacity>
        </View>

        {/* Word Counter */}
        <Text
          style={{
            marginTop: 20,
            color: "#6B7280",
            fontSize: 16,
            marginBottom: 40,
          }}
        >
          Word {currentWordIndex + 1} of{" "}
          {(wordsData[currentAlphabet as keyof WordsData] || []).length}
        </Text>
      </View>
    </ScrollView>
  );
}
