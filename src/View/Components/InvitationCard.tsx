// src/View/Components/InvitationCard.tsx
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Invitation } from "@/src/Models/Invitation";

interface Props {
  invitation: Invitation;
  onAccept: (memberId: string) => Promise<void>;
  onDecline: (memberId: string) => Promise<void>;
}

export function InvitationCard({ invitation, onAccept, onDecline }: Props) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  const handleAccept = async () => {
    try {
      setIsAccepting(true);
      await onAccept(invitation.id);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDecline = async () => {
    try {
      setIsDeclining(true);
      await onDecline(invitation.id);
    } finally {
      setIsDeclining(false);
    }
  };

  const isLoading = isAccepting || isDeclining;

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>✦</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{invitation.constellation_name}</Text>
        {invitation.invited_by_pseudo ? (
          <Text style={styles.subtitle}>
            Invité par{" "}
            <Text style={styles.bold}>{invitation.invited_by_pseudo}</Text>
          </Text>
        ) : (
          <Text style={styles.subtitle}>Vous avez reçu une invitation</Text>
        )}
        <Text style={styles.role}>Rôle : {invitation.role}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.acceptBtn, isLoading && styles.disabled]}
          onPress={handleAccept}
          disabled={isLoading}
        >
          {isAccepting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.acceptText}>✓</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.declineBtn, isLoading && styles.disabled]}
          onPress={handleDecline}
          disabled={isLoading}
        >
          {isDeclining ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <Text style={styles.declineText}>✕</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginHorizontal: 24,
    marginVertical: 6,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0d084d11",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 20, color: "#0d084d" },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  subtitle: { fontSize: 13, color: "#64748b", marginTop: 2 },
  bold: { fontWeight: "600", color: "#0f172a" },
  role: { fontSize: 12, color: "#94a3b8", marginTop: 4 },
  actions: { flexDirection: "row", gap: 8 },
  btn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptBtn: { backgroundColor: "#0d084d" },
  declineBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  acceptText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  declineText: { color: "#ef4444", fontSize: 16, fontWeight: "700" },
  disabled: { opacity: 0.5 },
});
