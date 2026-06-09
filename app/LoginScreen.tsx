// app/LoginScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { LoginUserDTO } from "../src/DTOs/LoginUserDTO";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const [dto, setDto] = useState<LoginUserDTO>({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    if (!dto.username.trim() || !dto.password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    try {
      setIsLoading(true);
      await login(dto);
    } catch (e: any) {
      setError(e.message ?? "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

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
          <Text style={styles.headerTitle}>Connexion</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.welcomeText}>Heureux de vous revoir !</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Adresse mail"
              placeholderTextColor="#9ca3af"
              value={dto.username}
              onChangeText={(v) => setDto((prev) => ({ ...prev, username: v }))}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#9ca3af"
              value={dto.password}
              onChangeText={(v) => setDto((prev) => ({ ...prev, password: v }))}
              secureTextEntry
            />

            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Se connecter</Text>
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
            <Text style={styles.footerText}>Pas encore de compte ? </Text>
            <TouchableOpacity>
              <Text style={styles.registerText}>Inscrivez-vous</Text>
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
    marginBottom: 20,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#0a2540",
    fontWeight: "600",
    fontSize: 14,
  },
  loginButton: {
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
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
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
  registerText: {
    color: "#6366f1",
    fontWeight: "600",
    fontSize: 14,
  },
});
