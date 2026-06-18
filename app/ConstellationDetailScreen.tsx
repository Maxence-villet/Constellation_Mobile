import { useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConstellationsStackParamList } from "../routes/app.routes";
import { useMemberController } from "../src/Http/Controllers/useMemberController";
import { useTodoController } from "../src/Http/Controllers/useTodoController";
import { Todo } from "../src/Models/Todo";

type Props = NativeStackScreenProps<
  ConstellationsStackParamList,
  "ConstellationDetail"
>;

const AVATAR_COLORS = [
  "#FF660070",
  "#3b82f670",
  "#8b5cf670",
  "#10b98170",
  "#f59e0b70",
];
const AVATAR_TEXT_COLORS = [
  "#FF6600",
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
];

function getRoleLabel(role: string): string {
  switch (role) {
    case "Sirius":
      return "Sirius \u2726";
    case "Soleil":
      return "Soleil \u2600";
    case "Etoile":
      return "\u00c9toile \u2605";
    default:
      return role;
  }
}

export default function ConstellationDetailScreen({ route }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<ConstellationsStackParamList>>();
  const { constellationName, constellationDescription } = route.params;

  // Etat local des membres pour refléter les exclusions sans rechargement
  const [members, setMembers] = useState<any[]>(route.params.members ?? []);

  const { excludeMember } = useMemberController();
  const { todos, remove } = useTodoController();

  // Détermine si l'utilisateur courant est le propriétaire (Sirius)
  const currentUserIsSirius =
    members.find((m: any) => m.user?.isCurrentUser === true)?.role === "Sirius";

  const handleDeleteTask = (todo: Todo) => {
    Alert.alert(
      "Supprimer la tâche",
      `Voulez-vous supprimer la tâche "${todo.title}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await remove(todo);
            } catch (err: any) {
              Alert.alert(
                "Erreur",
                err.message ?? "Impossible de supprimer cette tâche.",
              );
            }
          },
        },
      ],
    );
  };

  const handleExclude = (memberId: string, pseudo: string) => {
    Alert.alert(
      "Exclure le membre",
      `Voulez-vous exclure ${pseudo} de la constellation ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Exclure",
          style: "destructive",
          onPress: async () => {
            try {
              await excludeMember(memberId);
              // Mise à jour locale : retire le membre exclu de la liste
              setMembers((prev: any[]) =>
                prev.filter((m: any) => m.id !== memberId),
              );
            } catch (err: any) {
              Alert.alert(
                "Erreur",
                err.message ?? "Impossible d'exclure ce membre.",
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
          {constellationName}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {constellationDescription ? (
          <Text style={styles.description}>{constellationDescription}</Text>
        ) : null}

        {/* Section Membres */}
        <Text style={styles.sectionTitle}>Membres</Text>
        <FlatList
          data={members}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, idx) =>
            item?.id ? String(item.id) : `member-${idx}`
          }
          contentContainerStyle={styles.membersList}
          renderItem={({ item, index }) => {
            const firstName: string = item?.user?.firstName ?? "";
            const lastName: string = item?.user?.lastName ?? "";
            const pseudo: string = item?.user?.pseudo ?? "";
            const isCurrentUser: boolean = item?.user?.isCurrentUser === true;
            const role: string = item?.role ?? "";
            const memberId: string = item?.id ?? "";
            const initial = firstName.charAt(0).toUpperCase() || "?";
            const avatarBg = AVATAR_COLORS[index % AVATAR_COLORS.length];
            const avatarText =
              AVATAR_TEXT_COLORS[index % AVATAR_TEXT_COLORS.length];

            // Affiche le bouton d'exclusion si :
            // - l'utilisateur courant est Sirius (propriétaire)
            // - ET le membre n'est pas l'utilisateur courant lui-même
            const showExcludeBtn = currentUserIsSirius && !isCurrentUser;

            return (
              <View style={styles.memberCard}>
                {/* Bouton d'exclusion */}
                {showExcludeBtn && (
                  <TouchableOpacity
                    style={styles.excludeBtn}
                    onPress={() => handleExclude(memberId, pseudo || firstName)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="trash" size={13} color="#ef4444" />
                  </TouchableOpacity>
                )}

                <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
                  <Text style={[styles.avatarText, { color: avatarText }]}>
                    {initial}
                  </Text>
                </View>

                {isCurrentUser && (
                  <View style={styles.youBadge}>
                    <Text style={styles.youBadgeText}>Vous</Text>
                  </View>
                )}

                <Text style={styles.memberPseudo} numberOfLines={1}>
                  {pseudo || firstName}
                </Text>
                <Text style={styles.memberName} numberOfLines={1}>
                  {firstName} {lastName}
                </Text>
                <Text style={styles.memberRole}>{getRoleLabel(role)}</Text>
              </View>
            );
          }}
        />

        {/* Section Taches */}
        <Text style={styles.sectionTitle}>Tâches du groupe</Text>
        {todos.length === 0 && (
          <Text style={styles.emptyText}>
            Aucune tâche pour cette constellation.
          </Text>
        )}
        {todos.map((todo) => {
          const statusStyle = todo.completed
            ? { bg: "#f0fdf4", text: "#16a34a", label: "Terminée" }
            : { bg: "#f1f5f9", text: "#94a3b8", label: "À faire" };
          return (
            <View key={todo.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusStyle.bg },
                  ]}
                >
                  <Text
                    style={[styles.statusText, { color: statusStyle.text }]}
                  >
                    {statusStyle.label}
                  </Text>
                </View>
                {currentUserIsSirius && (
                  <TouchableOpacity
                    style={styles.deleteTaskBtn}
                    onPress={() => handleDeleteTask(todo)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="trash" size={16} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.taskTitle}>{todo.title}</Text>
            </View>
          );
        })}
      </ScrollView>
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
  backArrow: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0d084d",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#0a2540",
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },

  description: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 24,
    lineHeight: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0a2540",
    marginBottom: 12,
    marginTop: 8,
  },

  membersList: {
    paddingBottom: 16,
    gap: 12,
  },
  memberCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
    alignItems: "center",
    width: 110,
  },
  excludeBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
  },
  youBadge: {
    backgroundColor: "#0d084d",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  youBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  memberPseudo: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
    textAlign: "center",
  },
  memberName: {
    fontSize: 11,
    color: "#64748b",
    textAlign: "center",
    marginTop: 2,
  },
  memberRole: {
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 4,
  },

  taskCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  taskTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  deleteTaskBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    paddingVertical: 24,
  },
});
