// app/RegisterScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
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
import { useAuth } from "../src/Contexts/AuthContexts";
import { RegisterUserDTO } from "../src/DTOs/RegisterUserDTO";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RegisterScreen() {
  const { register } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const [dto, setDto] = useState<RegisterUserDTO>({
    firstName: "",
    lastName: "",
    pseudo: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);

    if (
      !dto.firstName.trim() ||
      !dto.lastName.trim() ||
      !dto.pseudo.trim() ||
      !dto.email.trim() ||
      !dto.password.trim()
    ) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    if (dto.password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setIsLoading(true);
      await register(dto);
      Alert.alert("Succès", "Compte créé ! Connectez-vous.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (err: any) {
      setError(err.message ?? "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Inscription</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.welcomeText}>Rejoignez-nous !</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              placeholderTextColor="#9ca3af"
              value={dto.firstName}
              onChangeText={(v) =>
                setDto((prev) => ({ ...prev, firstName: v }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Nom"
              placeholderTextColor="#9ca3af"
              value={dto.lastName}
              onChangeText={(v) => setDto((prev) => ({ ...prev, lastName: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Pseudo"
              placeholderTextColor="#9ca3af"
              value={dto.pseudo}
              onChangeText={(v) => setDto((prev) => ({ ...prev, pseudo: v }))}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              value={dto.email}
              onChangeText={(v) => setDto((prev) => ({ ...prev, email: v }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#9ca3af"
              value={dto.password}
              onChangeText={(v) => setDto((prev) => ({ ...prev, password: v }))}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor="#9ca3af"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[
                styles.registerButton,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>S'inscrire</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.socialDivider}>
            <Text style={styles.socialDividerText}>Se connecter avec</Text>
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/0/747.png",
                }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
                }}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginText}>Connectez-vous</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
  },
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
  backButtonText: {
    fontSize: 24,
    color: "#0f172a",
    bottom: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0a2540",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0a2540",
    textAlign: "center",
    marginBottom: 40,
  },
  form: {
    marginBottom: 32,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#0d084d33",
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0f172a",
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: "#0d084d",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0d084d",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  socialDivider: {
    alignItems: "center",
    marginBottom: 24,
  },
  socialDividerText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 40,
  },
  socialButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  loginText: {
    color: "#6366f1",
    fontWeight: "600",
    fontSize: 14,
  },
});
