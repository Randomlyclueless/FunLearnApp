// trial.js
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";

export default function Trial() {
  const frameWidth = 256; // adjust based on your sprite frame width
  const frameHeight = 256; // adjust based on your sprite frame height
  const totalFrames = 6; // since sprite2.png has 6 frames

  const [currentFrame, setCurrentFrame] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, 150); // animation speed (ms)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const col = currentFrame % 2; // 2 columns
    const row = Math.floor(currentFrame / 2); // rows

    Animated.timing(translateX, {
      toValue: -col * frameWidth,
      duration: 0,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateY, {
      toValue: -row * frameHeight,
      duration: 0,
      useNativeDriver: true,
    }).start();
  }, [currentFrame]);

  return (
    <View style={styles.container}>
      <View
        style={{ width: frameWidth, height: frameHeight, overflow: "hidden" }}
      >
        <Animated.Image
          source={require("./sprite2.png")}
          style={{
            width: frameWidth * 2, // 2 columns
            height: frameHeight * 3, // 3 rows
            transform: [{ translateX }, { translateY }],
          }}
        />{" "}
      </View>{" "}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
