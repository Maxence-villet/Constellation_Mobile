// app/CreateTaskScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConstellationsStackParamList } from "../routes/app.routes";
import { CreateTaskDTO } from "../src/DTOs/CreateTaskDTO";
import { TaskCategory, TaskPriority } from "../src/Models/Task";
import { useTaskController } from "../src/Http/Controllers/useTaskController";
import { useConstellationController } from "@/src/Http/Controllers/useConstellationController";
type Props = NativeStackScreenProps<ConstellationsStackParamList, "CreateTask">;
type NavigationProp = NativeStackNavigationProp<ConstellationsStackParamList>;

const PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: "low", label: "Faible", color: "#10b981" },
  { value: "medium", label: "Moyenne", color: "#f59e0b" },
  { value: "high", label: "Haute", color: "#ef4444" },
];

function getRoleColor(role: string): string {
  switch (role) {
    case "Sirius":
      return "#8b5cf6";
    case "Soleil":
      return "#f59e0b";
    case "Etoile":
      return "#3b82f6";
    default:
      return "#94a3b8";
  }
}

const CATEGORIES: { value: TaskCategory; label: string; icon: string }[] = [
  { value: "chore", label: "Taches menageres", icon: "home-outline" },
  { value: "errand", label: "Courses", icon: "bag-outline" },
  { value: "work", label: "Travail", icon: "briefcase-outline" },
  { value: "other", label: "Autre", icon: "ellipsis-horizontal-outline" },
];

export default function CreateTaskScreen({ route }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const { constellationId, constellationName } = route.params;

  const { createTask } = useTaskController(constellationId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [category, setCategory] = useState<TaskCategory>("work");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { constellations, isLoading, refresh } = useConstellationController();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Trouve la constellation cible dans la liste chargée par le contrôleur */
  const targetConstellation = useMemo(
    () =>
      constellations.find((c) => String(c.id) === String(constellationId)) ??
      null,
    [constellations, constellationId],
  );

  /** Membres de la constellation cible (objets bruts depuis l'API) */
  const members: any[] = useMemo(
    () => (targetConstellation as any)?.members ?? [],
    [targetConstellation],
  );

  const canSubmit = title.trim().length > 0 && selectedUserId !== null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    try {
      setIsSubmitting(true);

      const dto: CreateTaskDTO = {
        title: title.trim(),
        description: description.trim(),
        constellation_id: constellationId,
        assigned_to: selectedUserId,
        priority,
        category,
      };
      await createTask(dto);
      navigation.goBack();
    } catch (err: any) {
      setError(err.message ?? "Erreur lors de la creation de la tache.");
    } finally {
      setIsSubmitting(false);
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
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Nouvelle tache</Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {constellationName}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Titre */}
          <Text style={styles.label}>Titre *</Text>
          <TextInput
            style={[
              styles.input,
              error && !title.trim() ? styles.inputError : null,
            ]}
            placeholder="Ex: Faire les courses, Nettoyer..."
            placeholderTextColor="#9ca3af"
            value={title}
            onChangeText={(v) => {
              setTitle(v);
              setError(null);
            }}
          />

          {/* Description */}
          <Text style={styles.label}>Description (optionnelle)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Details supplementaires..."
            placeholderTextColor="#9ca3af"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          {/* Priorite */}
          <Text style={styles.label}>Priorite</Text>
          <View style={styles.row}>
            {PRIORITIES.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[
                  styles.pill,
                  priority === p.value && {
                    backgroundColor: p.color + "22",
                    borderColor: p.color,
                  },
                ]}
                onPress={() => setPriority(p.value)}
              >
                <View style={[styles.dot, { backgroundColor: p.color }]} />
                <Text
                  style={[
                    styles.pillLabel,
                    priority === p.value && {
                      color: p.color,
                      fontWeight: "700",
                    },
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Categorie */}
          <Text style={styles.label}>Categorie</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c.value}
                style={[
                  styles.categoryCard,
                  category === c.value && styles.categoryCardActive,
                ]}
                onPress={() => setCategory(c.value)}
              >
                <Ionicons
                  name={c.icon as any}
                  size={20}
                  color={category === c.value ? "#0d084d" : "#94a3b8"}
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    category === c.value && styles.categoryLabelActive,
                  ]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Assigne */}
          <Text style={styles.label}>Assigner a *</Text>
          {isLoading && members.length === 0 ? (
            <ActivityIndicator
              size="small"
              color="#0d084d"
              style={{ marginBottom: 18 }}
            />
          ) : members.length === 0 ? (
            <Text style={styles.emptyMembers}>
              Aucun membre dans cette constellation.
            </Text>
          ) : (
            <FlatList
              data={members}
              keyExtractor={(member, index) =>
                member?.id
                  ? String(member.id)
                  : member?.id_user
                    ? String(member.id_user)
                    : `member-${index}`
              }
              scrollEnabled={false}
              contentContainerStyle={styles.memberList}
              refreshing={isLoading}
              onRefresh={refresh}
              renderItem={({ item: member }) => {
                const user = (member as any)?.user ?? {};
                const firstName = user.firstName ?? user.first_name ?? "";
                const lastName = user.lastName ?? user.last_name ?? "";
                const pseudo = user.pseudo ?? "";
                const role: string = member.role ?? "";
                const memberId: string = member.id_user ?? member.id ?? "";
                const isSelected = selectedUserId === memberId;
                const roleColor = getRoleColor(role);
                const initial = firstName
                  ? firstName.charAt(0).toUpperCase()
                  : pseudo
                    ? pseudo.charAt(0).toUpperCase()
                    : "?";

                return (
                  <TouchableOpacity
                    style={[
                      styles.memberRow,
                      isSelected && styles.memberRowSelected,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedUserId(isSelected ? null : memberId);
                      setError(null);
                    }}
                  >
                    <View
                      style={[
                        styles.memberAvatar,
                        isSelected && styles.memberAvatarSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.memberAvatarText,
                          isSelected && styles.memberAvatarTextSelected,
                        ]}
                      >
                        {initial}
                      </Text>
                    </View>
                    <View style={styles.memberInfo}>
                      <Text
                        style={[
                          styles.memberName,
                          isSelected && styles.memberNameSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {firstName} {lastName}
                      </Text>
                      <View style={styles.memberMeta}>
                        {pseudo ? (
                          <Text style={styles.memberPseudo}>@{pseudo}</Text>
                        ) : null}
                        {role ? (
                          <View
                            style={[
                              styles.roleBadge,
                              { backgroundColor: roleColor + "22" },
                            ]}
                          >
                            <Text
                              style={[
                                styles.roleBadgeText,
                                { color: roleColor },
                              ]}
                            >
                              {role}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Bouton de soumission */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              (!canSubmit || isSubmitting) && styles.submitBtnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Creer la tache</Text>
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
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: { fontSize: 22, fontWeight: "700", color: "#0d084d" },
  headerCenter: { alignItems: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#0a2540" },
  headerSub: { fontSize: 12, color: "#64748b", marginTop: 2 },

  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0a2540",
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: "#0f172a",
    backgroundColor: "#f8fafc",
    marginBottom: 18,
  },
  inputError: { borderColor: "#ef4444" },
  textArea: { height: 90, textAlignVertical: "top" },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  pillLabel: { fontSize: 13, fontWeight: "500", color: "#64748b" },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  categoryCard: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  categoryCardActive: {
    borderColor: "#0d084d",
    backgroundColor: "#0d084d0a",
  },
  categoryLabel: { fontSize: 13, color: "#64748b", fontWeight: "500", flex: 1 },
  categoryLabelActive: { color: "#0d084d", fontWeight: "700" },

  memberList: { gap: 8, marginBottom: 20 },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  memberRowSelected: {
    borderColor: "#0d084d",
    backgroundColor: "#0d084d08",
  },
  memberAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  memberAvatarSelected: { backgroundColor: "#0d084d22" },
  memberAvatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748b",
  },
  memberAvatarTextSelected: { color: "#0d084d" },
  memberInfo: { flex: 1, gap: 2 },
  memberName: { fontSize: 15, fontWeight: "500", color: "#0f172a" },
  memberNameSelected: { fontWeight: "700" },
  memberMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  memberPseudo: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  emptyMembers: { color: "#94a3b8", fontSize: 14, marginBottom: 18 },

  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },

  submitBtn: {
    backgroundColor: "#0d084d",
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
