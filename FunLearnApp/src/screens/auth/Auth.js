import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, firestore } from '../config/firebase'; // Adjust import path
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection 
} from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

// Avatar options - emoji based for simplicity
const AVATARS = ['🐻', '🦊', '🐸', '🐱', '🐶', '🦁', '🐰', '🐼', '🐯', '🐨'];
const GRADES = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'];
const RELATIONSHIPS = ['Parent', 'Guardian', 'Caregiver', 'Other'];

export default function AuthScreen({ navigation }) {
  // Mode switching
  const [isSignUpMode, setIsSignUpMode] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('Grade 1');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  
  // Parent info (optional)
  const [showParentInfo, setShowParentInfo] = useState(false);
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [relationship, setRelationship] = useState('Parent');

  // Form validation
  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Missing Information', 'Please enter your email address');
      return false;
    }
    if (!password.trim() || password.length < 6) {
      Alert.alert('Password Error', 'Password must be at least 6 characters long');
      return false;
    }
    if (isSignUpMode) {
      if (!childName.trim()) {
        Alert.alert('Missing Information', 'Please enter your child\'s name');
        return false;
      }
      if (!age.trim() || isNaN(age) || age < 5 || age > 12) {
        Alert.alert('Age Error', 'Please enter a valid age between 5-12');
        return false;
      }
    }
    return true;
  };

  // Handle Sign In
  const handleSignIn = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Navigate based on test completion status
        if (userData.testCompleted) {
          navigation.navigate('Dashboard');
        } else {
          navigation.navigate('InitialTest');
        }
      } else {
        // User exists in Auth but not in Firestore - shouldn't happen normally
        Alert.alert('Error', 'User profile not found. Please contact support.');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Sign In Failed', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore
      const userData = {
        name: childName.trim(),
        age: parseInt(age),
        grade: grade,
        avatar: selectedAvatar,
        email: email.toLowerCase().trim(),
        testCompleted: false,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      
      await setDoc(doc(firestore, 'users', user.uid), userData);
      
      // Save parent info if provided
      if (showParentInfo && parentName.trim()) {
        const parentData = {
          name: parentName.trim(),
          email: parentEmail.toLowerCase().trim(),
          relationship: relationship,
          createdAt: new Date().toISOString()
        };
        
        await setDoc(doc(firestore, 'users', user.uid, 'parentProfile', 'main'), parentData);
      }
      
      Alert.alert(
        'Welcome!', 
        `Hi ${childName}! Your account has been created successfully.`,
        [{ text: 'Let\'s Start!', onPress: () => navigation.navigate('InitialTest') }]
      );
      
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Sign Up Failed', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Get user-friendly error messages
  const getErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Try signing in instead.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email. Try signing up instead.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  // Toggle between sign-up and sign-in
  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    // Clear form when switching modes
    setEmail('');
    setPassword('');
    setChildName('');
    setAge('');
    setGrade('Grade 1');
    setSelectedAvatar(AVATARS[0]);
    setShowParentInfo(false);
    setParentName('');
    setParentEmail('');
    setRelationship('Parent');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isSignUpMode ? '🌟 Let\'s Get Started!' : '👋 Welcome Back!'}
          </Text>
          <Text style={styles.subtitle}>
            {isSignUpMode 
              ? 'Create your learning adventure account' 
              : 'Sign in to continue your learning journey'
            }
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>📧 Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your.email@example.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Email input"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>🔒 Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry
              accessibilityLabel="Password input"
            />
          </View>

          {/* Sign-Up Only Fields */}
          {isSignUpMode && (
            <>
              {/* Child's Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>👦 Child's Name</Text>
                <TextInput
                  style={styles.input}
                  value={childName}
                  onChangeText={setChildName}
                  placeholder="Enter your child's name"
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                  accessibilityLabel="Child name input"
                />
              </View>

              {/* Age Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>🎂 Age</Text>
                <TextInput
                  style={styles.input}
                  value={age}
                  onChangeText={setAge}
                  placeholder="Enter age (5-12)"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={2}
                  accessibilityLabel="Age input"
                />
              </View>

              {/* Grade Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>🎓 Grade</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={grade}
                    onValueChange={setGrade}
                    style={styles.picker}
                    accessibilityLabel="Grade picker"
                  >
                    {GRADES.map((gradeOption) => (
                      <Picker.Item 
                        key={gradeOption} 
                        label={gradeOption} 
                        value={gradeOption} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Avatar Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>🎭 Choose Your Avatar</Text>
                <View style={styles.avatarContainer}>
                  {AVATARS.map((avatar) => (
                    <TouchableOpacity
                      key={avatar}
                      style={[
                        styles.avatarOption,
                        selectedAvatar === avatar && styles.selectedAvatar
                      ]}
                      onPress={() => setSelectedAvatar(avatar)}
                      accessibilityLabel={`Select ${avatar} avatar`}
                    >
                      <Text style={styles.avatarEmoji}>{avatar}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Parent Info Toggle */}
              <TouchableOpacity
                style={styles.parentToggle}
                onPress={() => setShowParentInfo(!showParentInfo)}
                accessibilityLabel="Toggle parent information section"
              >
                <Text style={styles.parentToggleText}>
                  👪 {showParentInfo ? 'Hide' : 'Add'} Parent Information (Optional)
                </Text>
                <Text style={styles.toggleIcon}>
                  {showParentInfo ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {/* Parent Info Fields */}
              {showParentInfo && (
                <View style={styles.parentSection}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>👨‍👩‍👧‍👦 Parent/Guardian Name</Text>
                    <TextInput
                      style={styles.input}
                      value={parentName}
                      onChangeText={setParentName}
                      placeholder="Enter parent/guardian name"
                      placeholderTextColor="#999"
                      autoCapitalize="words"
                      accessibilityLabel="Parent name input"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>📧 Parent Email</Text>
                    <TextInput
                      style={styles.input}
                      value={parentEmail}
                      onChangeText={setParentEmail}
                      placeholder="parent@example.com"
                      placeholderTextColor="#999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      accessibilityLabel="Parent email input"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>🤝 Relationship</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={relationship}
                        onValueChange={setRelationship}
                        style={styles.picker}
                        accessibilityLabel="Relationship picker"
                      >
                        {RELATIONSHIPS.map((rel) => (
                          <Picker.Item key={rel} label={rel} value={rel} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>
              )}
            </>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={isSignUpMode ? handleSignUp : handleSignIn}
          disabled={loading}
          accessibilityLabel={isSignUpMode ? "Create account" : "Sign in"}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isSignUpMode ? "🚀 Let's Go!" : "🔐 Sign In"}
            </Text>
          )}
        </TouchableOpacity>

        {/* Mode Toggle */}
        <TouchableOpacity 
          style={styles.toggleModeButton}
          onPress={toggleMode}
          accessibilityLabel={isSignUpMode ? "Switch to sign in" : "Switch to sign up"}
        >
          <Text style={styles.toggleModeText}>
            {isSignUpMode 
              ? "Already have an account? Tap here to log in 👆" 
              : "Don't have an account? Tap here to sign up 👆"
            }
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    color: '#2D3748',
    minHeight: 55,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  picker: {
    height: 55,
    color: '#2D3748',
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  avatarOption: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedAvatar: {
    borderColor: '#4299E1',
    backgroundColor: '#EBF8FF',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  parentToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  parentToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4299E1',
    flex: 1,
  },
  toggleIcon: {
    fontSize: 16,
    color: '#4299E1',
    fontWeight: 'bold',
  },
  parentSection: {
    backgroundColor: '#F7FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#4299E1',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#4299E1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#A0AEC0',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleModeButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  toggleModeText: {
    fontSize: 16,
    color: '#4299E1',
    textAlign: 'center',
    fontWeight: '500',
  },
});