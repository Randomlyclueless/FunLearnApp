import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Animated,
  SafeAreaView
} from 'react-native';
import { auth, firestore, functions } from '../config/firebase'; // Adjust import path
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

const { width, height } = Dimensions.get('window');

// Test categories with emojis
const CATEGORIES = {
  reading: { emoji: '📚', name: 'Reading', color: '#FF6B6B' },
  math: { emoji: '🔢', name: 'Math', color: '#4ECDC4' },
  memory: { emoji: '🧠', name: 'Memory', color: '#45B7D1' },
  vocabulary: { emoji: '💬', name: 'Vocabulary', color: '#96CEB4' },
  attention: { emoji: '👁️', name: 'Attention', color: '#FECA57' }
};

// Difficulty levels
const DIFFICULTY_LEVELS = {
  easy: { label: 'Easy', color: '#2ECC71', emoji: '😊' },
  medium: { label: 'Medium', color: '#F39C12', emoji: '🤔' },
  hard: { label: 'Hard', color: '#E74C3C', emoji: '🤯' }
};

// Feedback messages
const FEEDBACK_MESSAGES = {
  correct: [
    '🌟 Awesome!', '🎉 Great job!', '✨ Perfect!', 
    '🚀 Amazing!', '🎯 Excellent!', '💫 Fantastic!'
  ],
  incorrect: [
    '💪 Keep trying!', '🌈 Almost there!', '🔄 Good effort!',
    '🎈 Nice try!', '⭐ You can do it!', '🌟 Keep going!'
  ]
};

export default function SkillAssessmentTest({ navigation, route }) {
  // Get user data from route params or auth
  const currentUser = auth.currentUser;
  const userGrade = route?.params?.userGrade || 'Grade 1';
  
  // State management
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [score, setScore] = useState({ total: 0, byCategory: {} });
  const [difficulty, setDifficulty] = useState('easy');

  // Animation refs
  const progressAnim = useRef(new Animated.Value(0)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  // Initialize test on mount
  useEffect(() => {
    initializeTest();
  }, []);

  // Update progress animation
  useEffect(() => {
    if (questions.length > 0) {
      const progress = (currentQuestionIndex + 1) / questions.length;
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentQuestionIndex, questions.length]);

  const initializeTest = async () => {
    try {
      setLoading(true);
      
      // Get user data to determine difficulty
      const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
      const userData = userDoc.data();
      
      // Determine difficulty based on grade or previous results
      let testDifficulty = 'easy';
      if (userData?.grade) {
        const gradeNum = parseInt(userData.grade.replace('Grade ', ''));
        if (gradeNum >= 3) testDifficulty = 'medium';
        if (gradeNum >= 5) testDifficulty = 'hard';
      }
      setDifficulty(testDifficulty);

      // Call Firebase Cloud Function to get questions
      const getTestQuestions = httpsCallable(functions, 'getTestQuestions');
      
      const result = await getTestQuestions({
        userId: currentUser.uid,
        grade: userGrade,
        categories: Object.keys(CATEGORIES),
        difficulty: testDifficulty,
        questionsPerCategory: 2 // 2 questions per category = 10 total
      });

      if (result.data.success) {
        setQuestions(result.data.questions);
        setAnswers(new Array(result.data.questions.length).fill(null));
        
        // Initialize score tracking
        const initialScore = { total: 0, byCategory: {} };
        Object.keys(CATEGORIES).forEach(cat => {
          initialScore.byCategory[cat] = { correct: 0, total: 0 };
        });
        setScore(initialScore);
      } else {
        throw new Error(result.data.error || 'Failed to load questions');
      }

    } catch (error) {
      console.error('Error initializing test:', error);
      Alert.alert(
        'Oops! 🤖', 
        'We had trouble loading your test. Let\'s try again!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (showFeedback) return; // Prevent multiple selections during feedback
    
    setSelectedAnswer(answerIndex);
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answerIndex === currentQuestion.correctAnswer;
    
    setIsCorrect(correct);
    
    // Update answers array
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: correct,
      category: currentQuestion.category,
      timeToAnswer: Date.now() - currentQuestion.startTime
    };
    setAnswers(newAnswers);
    
    // Show feedback animation
    setShowFeedback(true);
    
    Animated.sequence([
      Animated.timing(feedbackAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();

    // Auto-advance after showing feedback
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    
    Animated.timing(feedbackAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Set start time for next question
      const nextQ = questions[currentQuestionIndex + 1];
      nextQ.startTime = Date.now();
    } else {
      completeTest();
    }
  };

  const completeTest = async () => {
    try {
      setTestComplete(true);
      
      // Calculate final scores
      const finalScore = { total: 0, byCategory: {} };
      Object.keys(CATEGORIES).forEach(cat => {
        finalScore.byCategory[cat] = { correct: 0, total: 0 };
      });

      answers.forEach(answer => {
        if (answer) {
          finalScore.byCategory[answer.category].total += 1;
          if (answer.isCorrect) {
            finalScore.byCategory[answer.category].correct += 1;
            finalScore.total += 1;
          }
        }
      });

      setScore(finalScore);

      // Calculate rewards
      const totalQuestions = answers.length;
      const correctAnswers = finalScore.total;
      const percentage = (correctAnswers / totalQuestions) * 100;
      
      let stars = 0;
      let badge = null;
      
      if (percentage >= 90) {
        stars = 5;
        badge = '🏆 Master Scholar';
      } else if (percentage >= 80) {
        stars = 4;
        badge = '🌟 Super Learner';
      } else if (percentage >= 70) {
        stars = 3;
        badge = '⭐ Great Student';
      } else if (percentage >= 60) {
        stars = 2;
        badge = '💫 Good Effort';
      } else {
        stars = 1;
        badge = '🌈 Keep Learning';
      }

      // Save results to Firestore
      const testResults = {
        userId: currentUser.uid,
        completedAt: new Date().toISOString(),
        totalQuestions,
        correctAnswers,
        percentage: Math.round(percentage),
        scoreByCategory: finalScore.byCategory,
        answers: answers.filter(a => a !== null),
        difficulty,
        grade: userGrade,
        stars,
        badge
      };

      await setDoc(
        doc(firestore, 'testResults', `${currentUser.uid}_${Date.now()}`),
        testResults
      );

      // Update user profile
      await updateDoc(doc(firestore, 'users', currentUser.uid), {
        testCompleted: true,
        lastTestScore: percentage,
        totalStars: stars, // This could be cumulative in a real app
        lastBadge: badge,
        lastActive: new Date().toISOString()
      });

      // Save rewards if any
      if (badge) {
        await setDoc(
          doc(firestore, 'users', currentUser.uid, 'rewards', Date.now().toString()),
          {
            type: 'badge',
            name: badge,
            earnedAt: new Date().toISOString(),
            stars
          }
        );
      }

      // Show completion celebration
      setTimeout(() => {
        navigation.navigate('Dashboard', { 
          testCompleted: true, 
          score: percentage,
          badge,
          stars 
        });
      }, 3000);

    } catch (error) {
      console.error('Error completing test:', error);
      Alert.alert('Error', 'There was a problem saving your results. Please try again.');
    }
  };

  const getRandomFeedback = (correct) => {
    const messages = correct ? FEEDBACK_MESSAGES.correct : FEEDBACK_MESSAGES.incorrect;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>🎯 Preparing your test...</Text>
          <Text style={styles.loadingSubtext}>This will just take a moment!</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (testComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completionContainer}>
          <Text style={styles.completionTitle}>🎉 Test Complete!</Text>
          <Text style={styles.completionScore}>
            You got {score.total} out of {questions.length} correct!
          </Text>
          <Text style={styles.completionPercentage}>
            {Math.round((score.total / questions.length) * 100)}%
          </Text>
          <Text style={styles.completionMessage}>
            🌟 Great job! Taking you to your dashboard...
          </Text>
          <ActivityIndicator size="large" color="#4ECDC4" style={{ marginTop: 20 }} />
        </View>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>😅 No questions available</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const category = CATEGORIES[currentQuestion.category];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Progress */}
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
          <Text style={styles.categoryEmoji}>{category.emoji}</Text>
          <Text style={styles.categoryName}>{category.name}</Text>
        </View>
        
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        
        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]}
          />
        </View>
      </View>

      {/* Question */}
      <ScrollView style={styles.questionContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        
        {/* Answer Options */}
        <View style={styles.answersContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.answerButton,
                selectedAnswer === index && styles.selectedAnswer,
                showFeedback && selectedAnswer === index && isCorrect && styles.correctAnswer,
                showFeedback && selectedAnswer === index && !isCorrect && styles.incorrectAnswer
              ]}
              onPress={() => handleAnswerSelect(index)}
              disabled={showFeedback}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.answerText,
                selectedAnswer === index && styles.selectedAnswerText
              ]}>
                {String.fromCharCode(65 + index)}. {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Feedback Overlay */}
      {showFeedback && (
        <Animated.View 
          style={[
            styles.feedbackOverlay,
            {
              opacity: feedbackAnim,
              transform: [{ scale: bounceAnim }]
            }
          ]}
        >
          <Text style={styles.feedbackText}>
            {getRandomFeedback(isCorrect)}
          </Text>
          {isCorrect && (
            <View style={styles.correctFeedback}>
              <Text style={styles.correctIcon}>✅</Text>
              <Text style={styles.correctText}>Correct!</Text>
            </View>
          )}
          {!isCorrect && (
            <View style={styles.incorrectFeedback}>
              <Text style={styles.incorrectIcon}>💪</Text>
              <Text style={styles.incorrectText}>
                The answer was: {String.fromCharCode(65 + currentQuestion.correctAnswer)}
              </Text>
            </View>
          )}
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginTop: 10,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 4,
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    lineHeight: 28,
    marginBottom: 30,
    textAlign: 'center',
  },
  answersContainer: {
    gap: 15,
  },
  answerButton: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedAnswer: {
    borderColor: '#4ECDC4',
    backgroundColor: '#F0FDFA',
  },
  correctAnswer: {
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
  },
  incorrectAnswer: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  answerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    lineHeight: 22,
  },
  selectedAnswerText: {
    color: '#0F766E',
    fontWeight: '600',
  },
  feedbackOverlay: {
    position: 'absolute',
    top: '40%',
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 15,
  },
  correctFeedback: {
    alignItems: 'center',
  },
  correctIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  correctText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
  },
  incorrectFeedback: {
    alignItems: 'center',
  },
  incorrectIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  incorrectText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A5568',
    textAlign: 'center',
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 20,
  },
  completionScore: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 10,
  },
  completionPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4ECDC4',
    textAlign: 'center',
    marginBottom: 20,
  },
  completionMessage: {
    fontSize: 18,
    color: '#4A5568',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});