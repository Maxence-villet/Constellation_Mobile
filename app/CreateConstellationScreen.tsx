import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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
import { RootStackParamList } from "../routes/app.routes";
import { useConstellationController } from "../src/Http/Controllers/useConstellationController";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CreateConstellationScreen() {
  const { create } = useConstellationController();
  const navigation = useNavigation<NavigationProp>();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    setError(null);
    if (!name.trim()) {
      setError("Le nom de la constellation est obligatoire.");
      return;
    }

    try {
      setIsLoading(true);
      await create({ name: name.trim(), description: description.trim() });
      navigation.goBack();
    } catch (err: any) {
      setError(err.message ?? "Erreur lors de la création.");
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
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nouvelle Constellation</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Nom de la constellation *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Famille, Coloc, Équipe projet"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Description (optionnelle)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Décrivez brièvement le groupe..."
            placeholderTextColor="#9ca3af"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.createButton, isLoading && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.createButtonText}>Créer</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
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
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#0a2540" },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  label: { fontSize: 14, fontWeight: "500", color: "#0a2540", marginBottom: 8 },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#0d084d33",
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0f172a",
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  textArea: { height: 120, textAlignVertical: "top", paddingTop: 12 },
  createButton: {
    backgroundColor: "#0d084d",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  buttonDisabled: { opacity: 0.7 },
  createButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
});
