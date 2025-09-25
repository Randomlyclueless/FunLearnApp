import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

interface StreakCardProps {
  API_URL: string;
}

export default function StreakCard({ API_URL }: StreakCardProps) {
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success && response.data.user) {
        setStreak(response.data.user.streak);
      }
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to load streak. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateStreak = async () => {
    setLoading(true);
    setError("");
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/streak/update`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setStreak(response.data.streak);
        console.log(response.data.message);
      }
    } catch (err: any) {
      console.error("Failed to update streak:", err);
      setError("Failed to update streak. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#394693",
          marginBottom: 5,
        }}
      >
        Daily Streak 🔥
      </Text>
      {loading ? (
        <ActivityIndicator
          color="#6C63FF"
          size="small"
          style={{ marginVertical: 10 }}
        />
      ) : (
        <Text
          style={{
            fontSize: 48,
            fontWeight: "bold",
            color: "#6C63FF",
            marginVertical: 5,
          }}
        >
          {streak}
        </Text>
      )}
      {error ? (
        <Text
          style={{
            color: "#EF4444",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          {error}
        </Text>
      ) : (
        <TouchableOpacity
          onPress={updateStreak}
          style={{
            backgroundColor: "#FFD700",
            paddingVertical: 12,
            paddingHorizontal: 25,
            borderRadius: 25,
            marginTop: 10,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 3,
          }}
        >
          <Text
            style={{
              color: "#394693",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Update Streak
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
