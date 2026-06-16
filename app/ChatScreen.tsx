// app/ChatScreen.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.icon}>💬</Text>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Bientot disponible</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  icon: { fontSize: 52, marginBottom: 16 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0a2540",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#94a3b8",
    textAlign: "center",
  },
});
