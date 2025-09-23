import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

SplashScreen.preventAutoHideAsync();

export default function ProgressScreen() {
  // Simulated data from our AI backend
  const [reportData] = useState({
    startDate: "September 1, 2023",
    endDate: "September 7, 2023",
    totalSessions: 7,
    wordsPracticed: 25,
    commonErrors: {
      "b/d confusions": 5,
      "p/q confusions": 3,
      "m/n confusions": 2,
    },
    sentiment: {
      mostCommon: "Engaged",
      summary:
        "The learner showed high levels of engagement, especially during tracing activities.",
    },
  });

  const [fontsLoaded] = useFonts({
    OpenDyslexic: require("../../assets/fonts/OpenDyslexic3-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // ✅ Export function (handles null documentDirectory)
  const exportReport = async () => {
    try {
      const reportContent = `
Child's Weekly Progress Report
------------------------------
Date Range: ${reportData.startDate} - ${reportData.endDate}

Learning Summary:
- Total Sessions: ${reportData.totalSessions}
- Words Practiced: ${reportData.wordsPracticed}

Common Error Patterns:
${Object.entries(reportData.commonErrors)
  .map(([error, count]) => `- ${error}: ${count} times`)
  .join("\n")}

Sentiment Analysis:
- Most Common Emotion: ${reportData.sentiment.mostCommon}
- Summary: ${reportData.sentiment.summary}
`;

      // ✅ Use cacheDirectory as fallback
      const fileUri =
        // @ts-ignore
        (FileSystem.documentDirectory ?? FileSystem.cacheDirectory) +
        "ProgressReport.txt";

      await FileSystem.writeAsStringAsync(fileUri, reportContent);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Export not supported on this device");
      }
    } catch (error: any) {
      Alert.alert("Error", "Could not export report: " + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Child's Progress</Text>
        <Text style={styles.dateRange}>
          Weekly Report: {reportData.startDate} - {reportData.endDate}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Learning Summary</Text>
        <Text style={styles.cardText}>
          Total sessions completed:{" "}
          <Text style={styles.highlight}>{reportData.totalSessions}</Text>
        </Text>
        <Text style={styles.cardText}>
          Words practiced:{" "}
          <Text style={styles.highlight}>{reportData.wordsPracticed}</Text>
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Common Error Patterns</Text>
        {Object.entries(reportData.commonErrors).map(([error, count]) => (
          <View key={error} style={styles.errorRow}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorCount}>{count} times</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sentiment Analysis</Text>
        <Text style={styles.cardText}>
          Most common emotion:{" "}
          <Text style={styles.highlight}>
            {reportData.sentiment.mostCommon}
          </Text>
        </Text>
        <Text style={styles.cardText}>{reportData.sentiment.summary}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Email Report Preview</Text>
        <Text style={styles.cardText}>
          This is a preview of the report sent to the parent's email. It
          provides a full breakdown of progress and suggestions for future
          activities.
        </Text>
        <Image
          source={{
            uri: "https://placehold.co/300x200/AEE7F8/222222?text=Email+Report+Preview",
          }}
          style={styles.imagePlaceholder}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Send Now</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Export Report Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#3B6EF7" }]}
        onPress={exportReport}
      >
        <Text style={styles.buttonText}>Export Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F8FF",
    padding: 24,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#394693",
    fontFamily: "OpenDyslexic",
  },
  dateRange: {
    fontSize: 16,
    color: "#838383",
    fontFamily: "OpenDyslexic",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#394693",
    marginBottom: 10,
    fontFamily: "OpenDyslexic",
  },
  cardText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    fontFamily: "OpenDyslexic",
  },
  highlight: {
    fontWeight: "bold",
    color: "#3B6EF7",
  },
  errorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "OpenDyslexic",
  },
  errorCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F05936",
    fontFamily: "OpenDyslexic",
  },
  imagePlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: "#E8F0FE",
    borderRadius: 10,
    marginTop: 15,
  },
  button: {
    backgroundColor: "#34D399",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 20,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "OpenDyslexic",
  },
});
