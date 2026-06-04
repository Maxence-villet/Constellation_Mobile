// app/HomeScreen.tsx
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../src/Contexts/AuthContexts";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenue {user?.firstName} !</Text>
      <Button title="Se déconnecter" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcome: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
