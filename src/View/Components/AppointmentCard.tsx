// src/View/Components/AppointmentCard.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Appointment } from "../../Models/Appointment";

interface Props {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
  canDelete?: boolean; // false si l'utilisateur n'est pas le créateur
  canEdit?: boolean;
  assigneeName?: string; // nom du membre assigné (si présent)
}

export default function AppointmentCard({
  appointment,
  onEdit,
  onDelete,
  canDelete = true,
  canEdit = true,
  assigneeName,
}: Props) {
  return (
    <View style={styles.card}>
      {/* En-tête : titre + actions */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {appointment.title}
        </Text>
        <View style={styles.actions}>
          {canEdit && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => onEdit(appointment)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Ionicons name="create-outline" size={18} color="#0d084d" />
            </TouchableOpacity>
          )}
          {canDelete && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => onDelete(appointment)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Date et heure */}
      <View style={styles.dateRow}>
        <Ionicons name="calendar-outline" size={14} color="#0d084d" />
        <Text style={styles.dateText}>{appointment.formattedDate()}</Text>
        <Ionicons
          name="time-outline"
          size={14}
          color="#0d084d"
          style={styles.timeIcon}
        />
        <Text style={styles.dateText}>{appointment.formattedTime()}</Text>
      </View>

      {/* Assigné à */}
      {assigneeName ? (
        <View style={styles.assigneeRow}>
          <Ionicons name="person-outline" size={12} color="#0d084d" />
          <Text style={styles.assigneeText}>{assigneeName}</Text>
        </View>
      ) : null}

      {/* Description */}
      {appointment.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {appointment.description}
        </Text>
      ) : null}

      {/* Rappels */}
      <View style={styles.remindersRow}>
        {appointment.reminders.map((r, i) => (
          <View key={i} style={styles.reminderChip}>
            <Ionicons name="notifications-outline" size={11} color="#0d084d" />
            <Text style={styles.reminderText}>{r.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginRight: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#0d084d0f",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    backgroundColor: "#fef2f2",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  dateText: {
    fontSize: 13,
    color: "#0d084d",
    fontWeight: "500",
  },
  timeIcon: {
    marginLeft: 8,
  },
  description: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 10,
  },
  remindersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  reminderChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#0d084d0f",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  reminderText: {
    fontSize: 11,
    color: "#0d084d",
    fontWeight: "500",
  },
  assigneeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  assigneeText: {
    fontSize: 12,
    color: "#0d084d",
    fontWeight: "500",
  },
});
