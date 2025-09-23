import { Stack } from "expo-router";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    OpenDyslexic: require("../assets/fonts/OpenDyslexic3-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack>
      {/* This makes the onboarding screen the first page the user sees */}
      <Stack.Screen name="_onboarding" options={{ headerShown: false }} />
      {/* The rest of the app is within the (tabs) folder */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
