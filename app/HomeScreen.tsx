// app/HomeScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../routes/app.routes";
import { useAuth } from "../src/Contexts/AuthContexts";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.notifButton}
        onPress={() => navigation.navigate("Notifications")}
      >
        <Text style={styles.notifIcon}>🔔</Text>
      </TouchableOpacity>

      <Text style={styles.welcome}>
        Bienvenue {user?.pseudo}#{user?.code} !
      </Text>

      <TouchableOpacity
        style={styles.constellationsButton}
        onPress={() => navigation.navigate("ConstellationList")}
      >
        <Text style={styles.constellationsButtonText}>Mes Constellations</Text>
      </TouchableOpacity>

      <Button title="Se déconnecter" onPress={logout} color="#ef4444" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  notifButton: {
    position: "absolute",
    top: 60,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  notifIcon: { fontSize: 20 },
  welcome: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0a2540",
    marginBottom: 40,
    textAlign: "center",
  },
  constellationsButton: {
    backgroundColor: "#0d084d",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 30,
    shadowColor: "#0d084d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  constellationsButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
