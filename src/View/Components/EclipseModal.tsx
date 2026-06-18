// src/View/Components/EclipseModal.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { EclipseAttributes } from "../../Models/Eclipse";

export interface EclipseMemberOption {
  id: string;
  pseudo: string;
  firstName: string;
  lastName: string;
}

interface Props {
  visible: boolean;
  todoTitle: string;
  // Membres Étoile uniquement, excluant l'utilisateur courant
  etoileMembers: EclipseMemberOption[];
  // Tous les membres, pour résoudre les noms dans l'historique
  allMembers: EclipseMemberOption[];
  eclipseHistory: EclipseAttributes[];
  onConfirm: (toMemberId: string) => void;
  onClose: () => void;
}

function getMemberName(
  memberId: string,
  members: EclipseMemberOption[],
): string {
  const m = members.find((m) => m.id === memberId);
  return m ? m.pseudo || m.firstName : "Inconnu";
}

export default function EclipseModal({
  visible,
  todoTitle,
  etoileMembers,
  allMembers,
  eclipseHistory,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        <View style={styles.handle} />

        {/* Titre */}
        <View style={styles.titleRow}>
          <Text style={styles.moonIcon}>🌑</Text>
          <View style={styles.titleTexts}>
            <Text style={styles.title}>Créer une Éclipse</Text>
            <Text style={styles.subtitle} numberOfLines={2}>
              {`"${todoTitle}"`}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Historique des délégations */}
          {eclipseHistory.length > 0 && (
            <View style={styles.historySection}>
              <Text style={styles.sectionLabel}>
                <Ionicons name="time-outline" size={13} color="#64748b" />
                {"  "}Historique
              </Text>
              {eclipseHistory.map((entry, i) => (
                <View key={entry.id ?? i} style={styles.historyRow}>
                  <Text style={styles.historyText}>
                    {getMemberName(entry.fromMemberId, allMembers)}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={12}
                    color="#94a3b8"
                    style={styles.arrow}
                  />
                  <Text style={styles.historyText}>
                    {getMemberName(entry.toMemberId, allMembers)}
                  </Text>
                  <Text style={styles.historyDate}>
                    {new Date(entry.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Sélection de l'Étoile réceptrice */}
          <Text style={styles.sectionLabel}>
            <Ionicons name="star-outline" size={13} color="#64748b" />
            {"  "}Déléguer à une Étoile
          </Text>

          {etoileMembers.length === 0 ? (
            <Text style={styles.emptyText}>
              Aucune Étoile disponible dans cette constellation.
            </Text>
          ) : (
            <FlatList
              data={etoileMembers}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.memberRow}
                  onPress={() => onConfirm(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {(item.pseudo || item.firstName).charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberPseudo}>
                      {item.pseudo || item.firstName}
                    </Text>
                    <Text style={styles.memberRole}>Étoile ★</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </ScrollView>

        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(10, 37, 64, 0.52)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 24,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e2e8f0",
    alignSelf: "center",
    marginBottom: 18,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 16,
  },
  moonIcon: { fontSize: 28 },
  titleTexts: { flex: 1 },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0a2540",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    fontStyle: "italic",
  },
  scroll: { flexGrow: 0 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
  historySection: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  historyText: {
    fontSize: 13,
    color: "#0f172a",
    fontWeight: "500",
  },
  arrow: { marginHorizontal: 6 },
  historyDate: {
    fontSize: 11,
    color: "#94a3b8",
    marginLeft: "auto",
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    paddingVertical: 16,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8b5cf615",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8b5cf6",
  },
  memberInfo: { flex: 1 },
  memberPseudo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  memberRole: {
    fontSize: 12,
    color: "#8b5cf6",
    fontWeight: "500",
    marginTop: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#f1f5f9",
  },
  cancelBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748b",
  },
});
