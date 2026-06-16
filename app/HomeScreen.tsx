// app/HomeScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeStackParamList } from "../routes/app.routes";
import { useAuth } from "../src/Contexts/AuthContexts";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Bouton de notifications en haut a droite */}
      <TouchableOpacity
        style={styles.notifButton}
        onPress={() => navigation.navigate("Notifications")}
      >
        <Text style={styles.notifIcon}>🔔</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        {/* Salutation */}
        <Text style={styles.greeting}>Bonjour,</Text>
        <Text style={styles.username}>{user?.pseudo ?? "Utilisateur"} ✦</Text>

        {/* Carte de bienvenue */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tableau de bord</Text>
          <Text style={styles.cardSubtitle}>
            Utilisez la barre de navigation pour explorer vos constellations,
            messages et profil.
          </Text>
          <View style={styles.hintRow}>
            <Text style={styles.hintIcon}>+</Text>
            <Text style={styles.hintText}>
              Appuyez sur le bouton central pour creer rapidement
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  notifButton: {
    position: "absolute",
    top: 56,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  notifIcon: { fontSize: 20 },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
  },
  greeting: {
    fontSize: 18,
    color: "#64748b",
    fontWeight: "400",
    marginBottom: 4,
  },
  username: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0a2540",
    marginBottom: 36,
  },
  card: {
    backgroundColor: "#0d084d",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#0d084d",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.72)",
    lineHeight: 21,
    marginBottom: 20,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  hintIcon: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "300",
    width: 24,
    textAlign: "center",
  },
  hintText: {
    flex: 1,
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 18,
  },
});
