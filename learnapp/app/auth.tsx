import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Platform,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

export default function AuthScreen() {
  const router = useRouter();

  const [formType, setFormType] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Use conditional URL for web and native
  const API_URL =
    Platform.OS === "web"
      ? "http://localhost:5000/api/auth"
      : "http://192.168.1.100:5000/api/auth";

  const handleLogin = async () => {
    setFormError("");
    if (!email || !password) {
      setFormError("Please enter your email and password.");
      return;
    }
    setIsSubmitting(true);

    // Hardcoded test logic to bypass backend for now
    if (email === "test@test.com" && password === "password") {
      setTimeout(() => {
        setIsSubmitting(false);
        router.replace("/welcome");
      }, 1000);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      if (response.data.success) {
        if (Platform.OS !== "web") {
          await SecureStore.setItemAsync("userToken", response.data.token);
        }
        router.replace("/welcome");
      } else {
        setFormError(response.data.message);
      }
    } catch (error: any) {
      if (error.response) {
        setFormError(
          error.response.data.message ||
            "Login failed. Please check your credentials."
        );
      } else if (error.request) {
        setFormError(
          "Network error. Please check your IP address and if the backend is running."
        );
      } else {
        setFormError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async () => {
    setFormError("");
    if (!email || !password || !confirmPassword || !hasConsented) {
      setFormError("Please fill out all fields and consent.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
      });
      if (response.data.success) {
        if (Platform.OS !== "web") {
          await SecureStore.setItemAsync("userToken", response.data.token);
        }
        router.replace("/welcome");
      } else {
        setFormError(response.data.message);
      }
    } catch (error: any) {
      if (error.response) {
        setFormError(
          error.response.data.message ||
            "Registration failed. Please try again."
        );
      } else if (error.request) {
        setFormError(
          "Network error. Please check your IP address and if the backend is running."
        );
      } else {
        setFormError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ fontSize: 30 }}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.logoText}>Leximate</Text>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.authContainer}>
          <View style={styles.formToggleContainer}>
            <TouchableOpacity
              style={[
                styles.formToggleButton,
                formType === "signup" && styles.formToggleButtonActive,
              ]}
              onPress={() => setFormType("signup")}
            >
              <Text
                style={[
                  styles.formToggleButtonText,
                  formType === "signup" && styles.formToggleButtonTextActive,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.formToggleButton,
                formType === "login" && styles.formToggleButtonActive,
              ]}
              onPress={() => setFormType("login")}
            >
              <Text
                style={[
                  styles.formToggleButtonText,
                  formType === "login" && styles.formToggleButtonTextActive,
                ]}
              >
                Log In
              </Text>
            </TouchableOpacity>
          </View>
          {formType === "signup" ? (
            <View style={styles.formSection}>
              <Text style={styles.formTitle}>Create a Parent Account</Text>
              <TextInput
                style={styles.input}
                placeholder="Parent Email"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Create Password"
                placeholderTextColor="#A0A0A0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#A0A0A0"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <View style={styles.consentContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setHasConsented(!hasConsented)}
                >
                  {hasConsented && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
                <Text style={styles.consentText}>
                  I am a parent or guardian and I agree to the{" "}
                  <Text style={styles.linkText}>Terms</Text> and{" "}
                  <Text style={styles.linkText}>Privacy Policy</Text>.
                </Text>
              </View>
              {formError ? (
                <Text style={styles.errorText}>{formError}</Text>
              ) : null}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSignup}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formSection}>
              <Text style={styles.formTitle}>Log In to Your Account</Text>
              <TextInput
                style={styles.input}
                placeholder="Parent Email"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {formError ? (
                <Text style={styles.errorText}>{formError}</Text>
              ) : null}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleLogin}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Log In</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
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
  authContainer: {
    marginBottom: 40,
    paddingHorizontal: Platform.OS === "web" ? "20%" : 0,
  },
  formToggleContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 20,
    padding: 5,
  },
  formToggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  formToggleButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  formToggleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  formToggleButtonTextActive: {
    color: "#394693",
  },
  formSection: {
    width: "100%",
    alignItems: "center",
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#394693",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  consentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkmark: {
    color: "#6C63FF",
    fontSize: 16,
  },
  consentText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    flexWrap: "wrap",
  },
  linkText: {
    color: "#6C63FF",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 10,
  },
  submitButton: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34D399",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
