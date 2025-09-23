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
    {label}{" "}
  </Text>
);

export default function TabLayout() {
  return (
    <Tabs>
          <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="two" options={{ title: "Learn" }} />
            <Tabs.Screen name="progress" options={{ title: "Progress" }} />
            <Tabs.Screen name="settings" options={{ title: "Settings" }} />   {" "}
    </Tabs>
  );
}
