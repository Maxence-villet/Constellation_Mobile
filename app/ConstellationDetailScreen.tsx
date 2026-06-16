import { useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConstellationsStackParamList } from "../routes/app.routes";

type Props = NativeStackScreenProps<
  ConstellationsStackParamList,
  "ConstellationDetail"
>;

interface FakeTask {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  category: string;
}

const FAKE_TASKS: FakeTask[] = [
  {
    id: "1",
    title: "Faire les courses",
    description: "Lait, pain, legumes",
    status: "todo",
    priority: "medium",
    category: "errand",
  },
  {
    id: "2",
    title: "Nettoyer le salon",
    description: "Aspirateur + vitres",
    status: "in_progress",
    priority: "low",
    category: "chore",
  },
  {
    id: "3",
    title: "Preparer la reunion",
    description: "Slides et agenda",
    status: "done",
    priority: "high",
    category: "work",
  },
  {
    id: "4",
    title: "Appeler le plombier",
    description: "Fuite robinet cuisine",
    status: "todo",
    priority: "high",
    category: "errand",
  },
];

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

function getStatusStyle(status: FakeTask["status"]): {
  bg: string;
  text: string;
  label: string;
} {
  switch (status) {
    case "todo":
      return { bg: "#f1f5f9", text: "#94a3b8", label: "A faire" };
    case "in_progress":
      return { bg: "#fff7ed", text: "#f97316", label: "En cours" };
    case "done":
      return { bg: "#f0fdf4", text: "#16a34a", label: "Termine" };
  }
}

function getPriorityColor(priority: FakeTask["priority"]): string {
  switch (priority) {
    case "low":
      return "#10b981";
    case "medium":
      return "#f59e0b";
    case "high":
      return "#ef4444";
  }
}

export default function ConstellationDetailScreen({ route }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<ConstellationsStackParamList>>();
  const { constellationName, constellationDescription, members } = route.params;

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
            const initial = firstName.charAt(0).toUpperCase() || "?";
            const avatarBg = AVATAR_COLORS[index % AVATAR_COLORS.length];
            const avatarText =
              AVATAR_TEXT_COLORS[index % AVATAR_TEXT_COLORS.length];

            return (
              <View style={styles.memberCard}>
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

        <Text style={styles.sectionTitle}>Taches en cours</Text>
        {FAKE_TASKS.map((task) => {
          const statusStyle = getStatusStyle(task.status);
          const priorityColor = getPriorityColor(task.priority);
          return (
            <View key={task.id} style={styles.taskCard}>
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
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: priorityColor },
                  ]}
                />
              </View>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDesc}>{task.description}</Text>
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
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  taskDesc: {
    fontSize: 13,
    color: "#64748b",
  },
});
