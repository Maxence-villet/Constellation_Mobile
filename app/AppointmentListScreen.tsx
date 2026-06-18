// app/AppointmentListScreen.tsx
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
import { useAppointmentController } from "../src/Http/Controllers/useAppointmentController";
import { Appointment } from "../src/Models/Appointment";
import AppointmentCard from "../src/View/Components/AppointmentCard";

type Props = NativeStackScreenProps<
  ConstellationsStackParamList,
  "AppointmentList"
>;

export default function AppointmentListScreen({ route }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<ConstellationsStackParamList>>();
  const { constellationId, constellationName } = route.params;

  const { appointments, isLoading, load, remove } = useAppointmentController();

  useEffect(() => {
    load(constellationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [constellationId]);

  const handleEdit = (appointment: Appointment) => {
    navigation.navigate("CreateAppointment", {
      constellationId,
      constellationName,
      appointment: appointment.toJSON(),
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
          Rendez-vous
        </Text>
        <View style={styles.backBtn} />
      </View>

      <Text style={styles.subtitle} numberOfLines={1}>
        {constellationName}
      </Text>

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
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Aucun rendez-vous pour cette constellation.
            </Text>
          }
        />
      )}

      {/* FAB Créer */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("CreateAppointment", {
            constellationId,
            constellationName,
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
  subtitle: {
    textAlign: "center",
    fontSize: 13,
    color: "#64748b",
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  loader: { flex: 1 },
  list: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 48,
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
