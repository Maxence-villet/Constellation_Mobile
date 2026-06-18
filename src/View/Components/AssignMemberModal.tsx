// src/View/Components/AssignMemberModal.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export interface MemberOption {
  id: string;
  pseudo: string;
  firstName: string;
  lastName: string;
}

interface Props {
  visible: boolean;
  taskTitle: string;
  members: MemberOption[];
  onSelect: (memberId: string) => void;
  onClose: () => void;
}

export default function AssignMemberModal({
  visible,
  taskTitle,
  members,
  onSelect,
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

        <Text style={styles.title}>Attribuer la tâche</Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {`"${taskTitle}"`}
        </Text>

        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.memberRow}
              onPress={() => onSelect(item.id)}
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
                <Text style={styles.memberName}>
                  {item.firstName} {item.lastName}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

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
    maxHeight: "60%",
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
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0a2540",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 16,
    fontStyle: "italic",
  },
  list: {
    flexGrow: 0,
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
    backgroundColor: "#0d084d15",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0d084d",
  },
  memberInfo: {
    flex: 1,
  },
  memberPseudo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  memberName: {
    fontSize: 12,
    color: "#64748b",
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
