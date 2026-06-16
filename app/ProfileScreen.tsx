// app/ProfileScreen.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/Contexts/AuthContexts";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>
            {user?.pseudo?.charAt(0)?.toUpperCase() ?? "?"}
          </Text>
        </View>

        <Text style={styles.pseudo}>{user?.pseudo ?? "Utilisateur"}</Text>
        <Text style={styles.pseudoCode}>
          {user?.pseudo}#{user?.code}
        </Text>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Abonnement</Text>
          <Text style={styles.infoValue}>{user?.subscription ?? "FREE"}</Text>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Se deconnecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 48,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#0d084d",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#0d084d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
  },
  pseudo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0a2540",
    marginBottom: 4,
  },
  pseudoCode: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
    marginBottom: 32,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 16,
  },
  infoRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 15,
    color: "#64748b",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },
  logoutBtn: {
    marginTop: 24,
    width: "100%",
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "#ef4444",
    fontSize: 15,
    fontWeight: "600",
  },
});
