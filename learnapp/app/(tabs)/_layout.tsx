// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useFonts } from "expo-font";

// Define font family constant
const FONT_FAMILY = "OpenDyslexic";

// TabText component for emoji icons
interface TabTextProps {
  label: string;
  color: string;
  size: number;
}

const TabText: React.FC<TabTextProps> = ({ label, color, size }) => (
  <Text style={{ fontSize: size, color, fontFamily: FONT_FAMILY }}>
    {label}
  </Text>
);

export default function Layout() {
  // Load OpenDyslexic font
  const [fontsLoaded] = useFonts({
    OpenDyslexic: require("../../assets/fonts/OpenDyslexic3-Bold.ttf"),
  });

  // Wait until font is loaded
  if (!fontsLoaded) return null;

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <TabText label="🏠" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="reading"
        options={{
          title: "Reading",
          tabBarIcon: ({ color, size }) => (
            <TabText label="📖" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="phonics"
        options={{
          title: "Phonics",
          tabBarIcon: ({ color, size }) => (
            <TabText label="🔤" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="writing"
        options={{
          title: "Writing",
          tabBarIcon: ({ color, size }) => (
            <TabText label="✏️" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size }) => (
            <TabText label="📊" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="dictionary"
        options={{
          title: "Dictionary",
          tabBarIcon: ({ color, size }) => (
            <TabText label="📚" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="challenge"
        options={{
          title: "Challenge",
          tabBarIcon: ({ color, size }) => (
            <TabText label="🎯" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <TabText label="⚙️" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
