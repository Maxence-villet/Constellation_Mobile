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
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConstellationsStackParamList } from "../routes/app.routes";
import { useAuth } from "../src/Contexts/AuthContexts";
import { useMemberController } from "../src/Http/Controllers/useMemberController";
import { useTaskController } from "../src/Http/Controllers/useTaskController";
import { TaskAttributes } from "../src/Models/Task";

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

// ─── Helpers roles ────────────────────────────────────
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

// ─── Helpers statut tache ────────────────────────────
function getStatusStyle(status: string): {
  bg: string;
  text: string;
  label: string;
} {
  switch (status) {
    case "todo":
      return { bg: "#f1f5f9", text: "#94a3b8", label: "A faire" };
    case "in_progress":
      return { bg: "#fff7ed", text: "#f97316", label: "En cours" };
    case "pending_validation":
      return { bg: "#fef9c3", text: "#ca8a04", label: "En validation" };
    case "done":
      return { bg: "#f0fdf4", text: "#16a34a", label: "Termine" };
    default:
      return { bg: "#f1f5f9", text: "#94a3b8", label: status };
  }
}

// ─── Helpers priorite tache ──────────────────────────
function getPriorityColor(priority: string): string {
  switch (priority) {
    case "low":
      return "#10b981";
    case "medium":
      return "#f59e0b";
    case "high":
      return "#ef4444";
    default:
      return "#94a3b8";
  }
}

// ─── Composant carte tache ────────────────────────────
function TaskCard({
  task,
  assigneeName,
  isAssignedToCurrentUser,
  currentUserPseudo,
}: {
  task: TaskAttributes;
  assigneeName: string | null;
  isAssignedToCurrentUser: boolean;
  currentUserPseudo: string | null;
}) {
  const statusStyle = getStatusStyle(task.status);
  const priorityColor = getPriorityColor(task.priority);

  return (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {statusStyle.label}
          </Text>
        </View>
        <View
          style={[styles.priorityDot, { backgroundColor: priorityColor }]}
        />
      </View>
      <Text style={styles.taskTitle}>{task.title}</Text>
      {task.description ? (
        <Text style={styles.taskDesc} numberOfLines={2}>
          {task.description}
        </Text>
      ) : null}
      {assigneeName ? (
        <View style={styles.assigneeRow}>
          <Ionicons name="person-outline" size={12} color="#64748b" />
          <Text style={styles.assigneeText} numberOfLines={1}>
            {assigneeName}
          </Text>
          {isAssignedToCurrentUser && (
            <View style={styles.assigneeYouBadge}>
              <Text style={styles.assigneeYouBadgeText}>Vous</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.assigneeRow}>
          <Ionicons name="person-outline" size={12} color="#94a3b8" />
          <Text style={styles.assigneeTextUnassigned}>
            {currentUserPseudo ? `${currentUserPseudo}` : "Non assigne"}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Ecran principal ──────────────────────────────────
export default function ConstellationDetailScreen({ route }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<ConstellationsStackParamList>>();

  const { constellationId, constellationName, constellationDescription } =
    route.params;

  const [members, setMembers] = useState<any[]>(route.params.members ?? []);

  const { user: currentUser } = useAuth();
  const { excludeMember } = useMemberController();
  const { tasks, isLoading: isLoadingTasks } =
    useTaskController(constellationId);

  // Determine si l'utilisateur courant est le proprietaire (Sirius)
  const currentUserIsSirius =
    members.find((m: any) => m.user?.isCurrentUser === true)?.role === "Sirius";

  // Indexe les membres par id_user pour trouver le nom de l'assigne
  const membersByUserId: Record<string, { pseudo: string; firstName: string }> =
    {};
  for (const m of members) {
    const uid = m.id_user ?? m.user?.id;
    if (uid) {
      const pseudo = m.user?.pseudo ?? m.pseudo ?? "";
      const firstName =
        m.user?.firstName ?? m.firstName ?? m.user?.first_name ?? "";
      membersByUserId[String(uid)] = { pseudo, firstName };
    }
  }

  // Enrichit avec l'utilisateur de la session (pseudo toujours disponible)
  if (currentUser?.id) {
    const uid = String(currentUser.id);
    if (!membersByUserId[uid]) {
      membersByUserId[uid] = {
        pseudo: currentUser.pseudo ?? "",
        firstName: currentUser.firstName ?? "",
      };
    } else {
      // Complete les champs manquants avec les donnees de session
      if (!membersByUserId[uid].pseudo && currentUser.pseudo) {
        membersByUserId[uid].pseudo = currentUser.pseudo;
      }
      if (!membersByUserId[uid].firstName && currentUser.firstName) {
        membersByUserId[uid].firstName = currentUser.firstName;
      }
    }
  }

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
            const initial =
              (firstName || pseudo).charAt(0).toUpperCase() || "?";
            const avatarBg = AVATAR_COLORS[index % AVATAR_COLORS.length];
            const avatarText =
              AVATAR_TEXT_COLORS[index % AVATAR_TEXT_COLORS.length];
            const showExcludeBtn = currentUserIsSirius && !isCurrentUser;

            return (
              <View style={styles.memberCard}>
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
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Taches en cours</Text>
          <TouchableOpacity
            style={styles.addTaskBtn}
            onPress={() =>
              navigation.navigate("CreateTask", {
                constellationId,
                constellationName,
                members,
              })
            }
          >
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {isLoadingTasks ? (
          <ActivityIndicator color="#0d084d" style={{ marginVertical: 24 }} />
        ) : tasks.length === 0 ? (
          <View style={styles.emptyTasks}>
            <Text style={styles.emptyTasksIcon}>{"\u{1F4CB}"}</Text>
            <Text style={styles.emptyTasksText}>
              Aucune tache pour le moment
            </Text>
            <Text style={styles.emptyTasksHint}>
              Appuyez sur + pour creer la premiere tache
            </Text>
          </View>
        ) : (
          tasks.map((task) => {
            const assigneeInfo = task.assigned_to
              ? (membersByUserId[String(task.assigned_to)] ?? null)
              : null;
            const assigneeName = assigneeInfo
              ? `@${assigneeInfo.pseudo || assigneeInfo.firstName}`
              : null;
            const isAssignedToCurrentUser =
              currentUser?.id != null &&
              String(task.assigned_to) === String(currentUser.id);

            return (
              <TaskCard
                key={task.id}
                task={task}
                assigneeName={assigneeName}
                isAssignedToCurrentUser={isAssignedToCurrentUser}
                currentUserPseudo={currentUser?.pseudo ?? null}
              />
            );
          })
        )}
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
  backArrow: { fontSize: 22, fontWeight: "700", color: "#0d084d" },
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
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 8,
  },
  addTaskBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#0d084d",
    alignItems: "center",
    justifyContent: "center",
  },

  // ─── Membres ───────────────────────────────────────
  membersList: { paddingBottom: 16, gap: 12 },
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
  avatarText: { fontSize: 20, fontWeight: "700" },
  youBadge: {
    backgroundColor: "#0d084d",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  youBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
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

  // ─── Taches ────────────────────────────────────────
  emptyTasks: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyTasksIcon: { fontSize: 36, marginBottom: 10 },
  emptyTasksText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 4,
  },
  emptyTasksHint: { fontSize: 13, color: "#94a3b8", textAlign: "center" },

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
  statusText: { fontSize: 12, fontWeight: "600" },
  priorityDot: { width: 10, height: 10, borderRadius: 5 },
  taskTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  taskDesc: { fontSize: 13, color: "#64748b", marginBottom: 6 },
  assigneeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  assigneeText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  assigneeTextUnassigned: {
    fontSize: 12,
    color: "#94a3b8",
    fontStyle: "italic",
  },
  assigneeYouBadge: {
    backgroundColor: "#0d084d",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  assigneeYouBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
