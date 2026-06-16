// app/NotificationsScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../routes/app.routes";
import { useMemberController } from "../src/Http/Controllers/useMemberController";
import { InvitationCard } from "../src/View/Components/InvitationCard";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function NotificationsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    invitations,
    isLoadingInvitations,
    loadInvitations,
    acceptInvitation,
    declineInvitation,
  } = useMemberController();

  // Stocke la référence de loadInvitations pour éviter d'inscrire de multiples listeners s'il change
  const loadInvitationsRef = useRef(loadInvitations);
  loadInvitationsRef.current = loadInvitations;

  useEffect(() => {
    // Premier chargement au montage
    loadInvitationsRef.current();

    // Re-chargement lorsque l'écran redevient actif
    const unsubscribe = navigation.addListener("focus", () => {
      loadInvitationsRef.current();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoadingInvitations && invitations.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.placeholder}>Chargement...</Text>
        </View>
      ) : invitations.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>Aucune notification</Text>
          <Text style={styles.emptySubtitle}>
            Les invitations aux constellations apparaîtront ici.
          </Text>
        </View>
      ) : (
        <FlatList
          data={invitations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={isLoadingInvitations}
          onRefresh={loadInvitations}
          ListHeaderComponent={
            <Text style={styles.sectionLabel}>
              {invitations.length} invitation
              {invitations.length > 1 ? "s" : ""} en attente
            </Text>
          }
          renderItem={({ item }) => (
            <InvitationCard
              invitation={item}
              onAccept={acceptInvitation}
              onDecline={declineInvitation}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  backButtonText: { fontSize: 24, color: "#0f172a", bottom: 2 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#0a2540" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0a2540",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
  },
  placeholder: { color: "#94a3b8", fontSize: 16 },
  list: { paddingTop: 16, paddingBottom: 32 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    paddingHorizontal: 24,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
