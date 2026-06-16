// app/InviteMemberScreen.tsx
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConstellationsStackParamList } from "../routes/app.routes";
import { MemberRole } from "../src/DTOs/SendInvitationDTO";
import { useMemberController } from "../src/Http/Controllers/useMemberController";

type Props = NativeStackScreenProps<
  ConstellationsStackParamList,
  "InviteMember"
>;
type NavigationProp = NativeStackNavigationProp<ConstellationsStackParamList>;

const ROLES: { value: MemberRole; label: string; description: string }[] = [
  {
    value: "Etoile",
    label: "Étoile",
    description: "Membre standard",
  },
  {
    value: "Soleil",
    label: "Soleil",
    description: "Membre avec droits d'invitation",
  },
];

export default function InviteMemberScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<Props["route"]>();
  const { constellationId, constellationName } = route.params;

  const { inviteMember } = useMemberController();

  const [pseudocode, setPseudocode] = useState("");
  const [role, setRole] = useState<MemberRole>("Etoile");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isValidPseudocode = (value: string) => {
    const parts = value.trim().split("#");
    return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
  };

  const handleInvite = async () => {
    setError(null);
    setSuccess(null);

    if (!pseudocode.trim()) {
      setError("Veuillez saisir un pseudocode.");
      return;
    }
    if (!isValidPseudocode(pseudocode)) {
      setError("Format invalide. Utilisez : pseudo#code");
      return;
    }

    try {
      setIsLoading(true);
      await inviteMember(
        { pseudocode: pseudocode.trim(), role },
        constellationId,
      );
      setSuccess(`Invitation envoyée à ${pseudocode.trim()} !`);
      setPseudocode("");
    } catch (err: any) {
      setError(err.message ?? "Erreur lors de l'envoi de l'invitation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Inviter un membre</Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {constellationName}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.hint}>
            <Text style={styles.hintIcon}>✦</Text>
            <Text style={styles.hintText}>
              Demandez à votre ami son pseudocode. Il est au format{" "}
              <Text style={styles.hintBold}>pseudo#code</Text> et se trouve dans
              son profil.
            </Text>
          </View>

          <Text style={styles.label}>Pseudocode *</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="Ex: alice#A1B2"
            placeholderTextColor="#9ca3af"
            value={pseudocode}
            onChangeText={(v) => {
              setPseudocode(v);
              setError(null);
              setSuccess(null);
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Rôle</Text>
          <View style={styles.roleRow}>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r.value}
                style={[
                  styles.roleCard,
                  role === r.value && styles.roleCardActive,
                ]}
                onPress={() => setRole(r.value)}
              >
                <Text
                  style={[
                    styles.roleLabel,
                    role === r.value && styles.roleLabelActive,
                  ]}
                >
                  {r.label}
                </Text>
                <Text
                  style={[
                    styles.roleDesc,
                    role === r.value && styles.roleDescActive,
                  ]}
                >
                  {r.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error && (
            <View style={styles.messageBanner}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          )}
          {success && (
            <View style={[styles.messageBanner, styles.successBanner]}>
              <Text style={styles.successText}>✓ {success}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.inviteButton, isLoading && styles.buttonDisabled]}
            onPress={handleInvite}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.inviteButtonText}>Envoyer invitation</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  backButtonText: { fontSize: 24, color: "#0f172a", bottom: 2 },
  headerCenter: { alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#0a2540" },
  headerSub: { fontSize: 12, color: "#64748b", marginTop: 2 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  hint: {
    flexDirection: "row",
    backgroundColor: "#0d084d08",
    borderRadius: 12,
    padding: 14,
    marginBottom: 28,
    gap: 10,
    alignItems: "flex-start",
  },
  hintIcon: { fontSize: 16, color: "#0d084d", marginTop: 1 },
  hintText: { flex: 1, fontSize: 14, color: "#475569", lineHeight: 20 },
  hintBold: { fontWeight: "700", color: "#0d084d" },
  label: { fontSize: 14, fontWeight: "500", color: "#0a2540", marginBottom: 8 },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#0d084d33",
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 18,
    color: "#0f172a",
    backgroundColor: "#fff",
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  inputError: { borderColor: "#ef4444" },
  roleRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  roleCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#fff",
  },
  roleCardActive: {
    borderColor: "#0d084d",
    backgroundColor: "#0d084d0a",
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 4,
  },
  roleLabelActive: { color: "#0d084d" },
  roleDesc: { fontSize: 12, color: "#94a3b8" },
  roleDescActive: { color: "#475569" },
  messageBanner: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fef2f2",
  },
  successBanner: { backgroundColor: "#f0fdf4" },
  errorText: { color: "#ef4444", fontSize: 14 },
  successText: { color: "#16a34a", fontSize: 14, fontWeight: "500" },
  inviteButton: {
    backgroundColor: "#0d084d",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: { opacity: 0.7 },
  inviteButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
