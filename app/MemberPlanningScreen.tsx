// app/MemberPlanningScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConstellationsStackParamList } from "../routes/app.routes";
import { useAuth } from "../src/Contexts/AuthContexts";
import { useAppointmentController } from "../src/Http/Controllers/useAppointmentController";
import { Appointment } from "../src/Models/Appointment";
import AppointmentCard from "../src/View/Components/AppointmentCard";

type Props = NativeStackScreenProps<
  ConstellationsStackParamList,
  "MemberPlanning"
>;

export default function MemberPlanningScreen({ route }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<ConstellationsStackParamList>>();
  const { memberId, memberName, constellationId, constellationName } =
    route.params;

  const { user } = useAuth();
  const { appointments, isLoading, loadForMember, remove } =
    useAppointmentController();

  useEffect(() => {
    loadForMember(memberId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

  // Seul le créateur peut supprimer ou modifier son rendez-vous
  const canManage = (appointment: Appointment) =>
    appointment.created_by_user_id === user?.id;

  const handleEdit = (appointment: Appointment) => {
    navigation.navigate("CreateAppointment", {
      constellationId,
      constellationName,
      appointment: appointment.toJSON(),
      assignedToMemberId: memberId,
      assignedToMemberName: memberName,
    });
  };

  const handleDelete = (appointment: Appointment) => {
    Alert.alert(
      "Supprimer le rendez-vous",
      `Voulez-vous supprimer "${appointment.title}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await remove(appointment);
            } catch (err: any) {
              Alert.alert(
                "Erreur",
                err.message ?? "Impossible de supprimer ce rendez-vous.",
              );
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Planning
        </Text>
        <View style={styles.backBtn} />
      </View>

      {/* Sous-titre */}
      <View style={styles.subtitleRow}>
        <Ionicons name="person-outline" size={14} color="#0d084d" />
        <Text style={styles.subtitle}>{memberName}</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0d084d" />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <AppointmentCard
              appointment={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canDelete={canManage(item)}
              canEdit={canManage(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyText}>
                Aucun rendez-vous pour {memberName}.
              </Text>
            </View>
          }
        />
      )}

      {/* FAB — ajouter un RDV pour ce membre */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("CreateAppointment", {
            constellationId,
            constellationName,
            assignedToMemberId: memberId,
            assignedToMemberName: memberName,
          })
        }
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: { fontSize: 22, fontWeight: "700", color: "#0d084d" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#0a2540",
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0d084d",
  },
  loader: { flex: 1 },
  list: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 48,
  },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0d084d",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0d084d",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.38,
    shadowRadius: 12,
    elevation: 10,
  },
});
