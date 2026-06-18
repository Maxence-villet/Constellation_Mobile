// app/CreateAppointmentScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConstellationsStackParamList } from "../routes/app.routes";
import { useAppointmentController } from "../src/Http/Controllers/useAppointmentController";
import { Appointment, ReminderAttributes } from "../src/Models/Appointment";

type Props = NativeStackScreenProps<
  ConstellationsStackParamList,
  "CreateAppointment"
>;

// Options de rappel personnalisé (une seule sélectionnable en plus)
const CUSTOM_REMINDER_OPTIONS: ReminderAttributes[] = [
  { offsetMinutes: 15, label: "15 min avant" },
  { offsetMinutes: 30, label: "30 min avant" },
  { offsetMinutes: 2 * 60, label: "2h avant" },
  { offsetMinutes: 6 * 60, label: "6h avant" },
  { offsetMinutes: 12 * 60, label: "12h avant" },
];

function parseDateTimeToISO(date: string, time: string): string {
  // date : "JJ/MM/AAAA", time : "HH:MM"
  const [day, month, year] = date.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${time}:00`;
}

function isoToDateStr(iso: string): string {
  // "2024-12-25T14:30:00" → "25/12/2024"
  const [datePart] = iso.split("T");
  const [year, month, day] = datePart.split("-");
  return `${day}/${month}/${year}`;
}

function isoToTimeStr(iso: string): string {
  // "2024-12-25T14:30:00" → "14:30"
  const [, timePart] = iso.split("T");
  return timePart.substring(0, 5);
}

export default function CreateAppointmentScreen({ route }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<ConstellationsStackParamList>>();
  const {
    constellationId,
    constellationName,
    appointment,
    assignedToMemberId,
    assignedToMemberName,
  } = route.params;
  const isEditMode = !!appointment;

  const { create, update } = useAppointmentController();

  // Pré-remplir si mode édition
  const [title, setTitle] = useState(appointment?.title ?? "");
  const [description, setDescription] = useState(
    appointment?.description ?? "",
  );
  const [dateStr, setDateStr] = useState(
    appointment ? isoToDateStr(appointment.date) : "",
  );
  const [timeStr, setTimeStr] = useState(
    appointment ? isoToTimeStr(appointment.date) : "",
  );

  // Rappel personnalisé sélectionné (index dans CUSTOM_REMINDER_OPTIONS, ou null)
  const existingCustom = appointment?.reminders.find(
    (r) =>
      !Appointment.DEFAULT_REMINDERS.some(
        (d) => d.offsetMinutes === r.offsetMinutes,
      ),
  );
  const [customReminderIndex, setCustomReminderIndex] = useState<number | null>(
    existingCustom
      ? CUSTOM_REMINDER_OPTIONS.findIndex(
          (o) => o.offsetMinutes === existingCustom.offsetMinutes,
        )
      : null,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildReminders = (): ReminderAttributes[] => {
    const reminders = [...Appointment.DEFAULT_REMINDERS];
    if (customReminderIndex !== null) {
      reminders.push(CUSTOM_REMINDER_OPTIONS[customReminderIndex]);
    }
    return reminders;
  };

  const validateDate = (val: string): boolean =>
    /^\d{2}\/\d{2}\/\d{4}$/.test(val);

  const validateTime = (val: string): boolean => /^\d{2}:\d{2}$/.test(val);

  const handleSubmit = async () => {
    setError(null);

    if (!title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }
    if (!validateDate(dateStr)) {
      setError("Format de date invalide. Utilisez JJ/MM/AAAA.");
      return;
    }
    if (!validateTime(timeStr)) {
      setError("Format d'heure invalide. Utilisez HH:MM.");
      return;
    }

    const isoDate = parseDateTimeToISO(dateStr, timeStr);
    const reminders = buildReminders();

    try {
      setIsLoading(true);

      if (isEditMode && appointment) {
        await update({
          id: appointment.id,
          title: title.trim(),
          description: description.trim() || undefined,
          date: isoDate,
          reminders,
        });
      } else {
        await create({
          title: title.trim(),
          description: description.trim() || undefined,
          date: isoDate,
          constellationId,
          reminders,
          assigned_to_member_id: assignedToMemberId ?? null,
        });
      }

      navigation.goBack();
    } catch (err: any) {
      Alert.alert(
        "Erreur",
        err.message ?? "Impossible de sauvegarder le rendez-vous.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {isEditMode ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
          </Text>
          <View style={styles.backBtn} />
        </View>

        <Text style={styles.headerSubtitle}>{constellationName}</Text>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Bandeau membre assigné */}
          {assignedToMemberName ? (
            <View style={styles.assigneeBanner}>
              <Ionicons name="person-outline" size={14} color="#0d084d" />
              <Text style={styles.assigneeBannerText}>
                Pour : {assignedToMemberName}
              </Text>
            </View>
          ) : null}

          {/* Titre */}
          <Text style={styles.label}>Titre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Réunion d'équipe, Anniversaire..."
            placeholderTextColor="#9ca3af"
            value={title}
            onChangeText={setTitle}
          />

          {/* Description */}
          <Text style={styles.label}>Description (optionnelle)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Détails du rendez-vous..."
            placeholderTextColor="#9ca3af"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          {/* Date */}
          <Text style={styles.label}>Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="JJ/MM/AAAA"
            placeholderTextColor="#9ca3af"
            value={dateStr}
            onChangeText={setDateStr}
            keyboardType="numeric"
            maxLength={10}
          />

          {/* Heure */}
          <Text style={styles.label}>Heure *</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            placeholderTextColor="#9ca3af"
            value={timeStr}
            onChangeText={setTimeStr}
            keyboardType="numeric"
            maxLength={5}
          />

          {/* Rappels par défaut */}
          <Text style={styles.sectionTitle}>
            <Ionicons name="notifications" size={15} color="#0d084d" />
            {"  "}Rappels par défaut
          </Text>
          <View style={styles.chipsRow}>
            {Appointment.DEFAULT_REMINDERS.map((r, i) => (
              <View key={i} style={styles.defaultChip}>
                <Ionicons name="checkmark-circle" size={13} color="#16a34a" />
                <Text style={styles.defaultChipText}>{r.label}</Text>
              </View>
            ))}
          </View>

          {/* Rappel personnalisé */}
          <Text style={styles.sectionTitle}>
            <Ionicons name="add-circle-outline" size={15} color="#0d084d" />
            {"  "}Rappel personnalisé (facultatif)
          </Text>
          <View style={styles.chipsRow}>
            {CUSTOM_REMINDER_OPTIONS.map((opt, i) => {
              const selected = customReminderIndex === i;
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.customChip,
                    selected && styles.customChipSelected,
                  ]}
                  onPress={() => setCustomReminderIndex(selected ? null : i)}
                >
                  <Text
                    style={[
                      styles.customChipText,
                      selected && styles.customChipTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Erreur */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Bouton soumettre */}
          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>
                {isEditMode ? "Mettre à jour" : "Créer le rendez-vous"}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
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
    fontSize: 17,
    fontWeight: "700",
    color: "#0a2540",
  },
  headerSubtitle: {
    textAlign: "center",
    fontSize: 13,
    color: "#64748b",
    paddingVertical: 6,
    paddingHorizontal: 24,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 48,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0a2540",
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#0d084d33",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0f172a",
    backgroundColor: "#fff",
    marginBottom: 18,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  assigneeBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#0d084d0f",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#0d084d20",
  },
  assigneeBannerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0d084d",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0a2540",
    marginBottom: 10,
    marginTop: 4,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  defaultChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  defaultChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#16a34a",
  },
  customChip: {
    borderWidth: 1,
    borderColor: "#0d084d33",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f8fafc",
  },
  customChipSelected: {
    backgroundColor: "#0d084d",
    borderColor: "#0d084d",
  },
  customChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0d084d",
  },
  customChipTextSelected: {
    color: "#fff",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: "#0d084d",
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
