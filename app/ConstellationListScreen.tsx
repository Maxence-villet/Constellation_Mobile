import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../routes/app.routes";
import { useConstellationController } from "../src/Http/Controllers/useConstellationController";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ConstellationListScreen() {
  const { constellations, isLoading, refresh } = useConstellationController();
  const navigation = useNavigation<NavigationProp>();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, []),
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.placeholder}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (constellations.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Mes Constellations</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("CreateConstellation")}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.placeholder}>Aucune constellation trouvée</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Constellations</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("CreateConstellation")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={constellations}
        keyExtractor={(item, index) =>
          item?.id ? String(item.id) : `fallback-${index}`
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleBlock}>
                <Text style={styles.constName}>{item.name}</Text>
                <Text style={styles.constDesc}>{item.description}</Text>
              </View>
              <TouchableOpacity
                style={styles.inviteBtn}
                onPress={() =>
                  navigation.navigate("InviteMember", {
                    constellationId: item.id,
                    constellationName: item.name,
                  })
                }
              >
                <Text style={styles.inviteBtnText}>+ Inviter</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.members}>
              {item.members?.slice(0, 3).map((member) => (
                <Text key={String(member.id)} style={styles.memberText}>
                  {member.user.firstName?.charAt(0) ?? "?"}
                </Text>
              ))}
            </View>
          </View>
        )}
        refreshing={isLoading}
        onRefresh={refresh}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: { fontSize: 24, fontWeight: "700", color: "#0a2540" },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0d084d",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 32,
  },
  card: {
    backgroundColor: "#f8fafc",
    marginHorizontal: 24,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  cardTitleBlock: { flex: 1, marginRight: 8 },
  constName: { fontSize: 18, fontWeight: "600", color: "#0f172a" },
  constDesc: { fontSize: 14, color: "#475569", marginTop: 4 },
  inviteBtn: {
    backgroundColor: "#0d084d",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  inviteBtnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  placeholder: { textAlign: "center", color: "#94a3b8", fontSize: 16 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  members: {
    flexDirection: "row",
    marginTop: 16,
    gap: 8,
  },
  memberText: {
    backgroundColor: "#FF660070",
    width: 40,
    height: 40,
    borderRadius: 20,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#FF6600",
    fontWeight: "bold",
  },
});
