import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../routes/app.routes";
import ButtonPrimary from "./components/ui/button";
import ButtonSecondary from "./components/ui/button secondary";
import { Colors } from "./constants/colors";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleGetStarted = () => {
    // À définir plus tard (OnboardingScreen par exemple)
    console.log("Commencer l'aventure");
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleRegister = () => {
    // À définir plus tard
    console.log("Créer un compte");
  };

  return (
    <LinearGradient
      colors={[
        Colors.home.darkBlue,
        Colors.home.mediumBlue,
        Colors.home.lightPurple,
      ]}
      locations={[0, 0.55, 1]}
      style={styles.gradient}
    >
      <ImageBackground
        source={require("@/assets/images/Artboard/Constellation BG.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        imageStyle={{ opacity: 0.35 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.heroSection}>
          <Image
            source={require("@/assets/images/Artboard/Logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Image
            source={require("@/assets/images/Artboard/Name Logo.png")}
            style={styles.nameLogo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>
            METTEZ DE L'ORDRE DANS VOTRE UNIVERS
          </Text>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity onPress={handleGetStarted}>
            <ButtonPrimary label="Commencer l'aventure" icon="◆" />
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity onPress={handleLogin}>
            <ButtonSecondary label="J'ai déjà un compte" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRegister}>
            <ButtonSecondary label="Créer un compte" variant="secondary" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function Divider() {
  return (
    <View style={dividerStyles.row}>
      <View style={dividerStyles.line} />
      <Text style={dividerStyles.label}>ou</Text>
      <View style={dividerStyles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 28,
  },

  heroSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  logo: {
    width: 180,
    height: 180,
  },
  nameLogo: {
    width: "90%",
    height: 60,
    marginTop: 8,
  },
  tagline: {
    color: Colors.home.white,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.8,
    textAlign: "center",
    opacity: 0.85,
    marginTop: 4,
  },

  actionsSection: {
    paddingBottom: Platform.OS === "android" ? 28 : 12,
    gap: 12,
  },
});

const dividerStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 4,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.home.lightWhite,
  },
  label: {
    color: Colors.home.lightWhite,
    fontSize: 13,
    fontWeight: "500",
  },
});
